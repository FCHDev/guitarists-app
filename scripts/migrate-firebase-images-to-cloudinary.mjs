#!/usr/bin/env node
/**
 * Migration des photos de guitaristes encore hébergées sur Firebase Storage
 * vers Cloudinary (le stockage utilisé désormais pour les nouveaux ajouts).
 *
 * Firebase Storage nécessite maintenant un plan payant (Blaze) pour être géré
 * depuis la console. Ce script rattrape les fiches plus anciennes dont la
 * photo est encore sur Firebase Storage : il la télécharge, la réuploade sur
 * Cloudinary, puis met à jour le champ `imgURL` de la fiche dans la Realtime
 * Database.
 *
 * Usage (depuis le dossier guitaristapp) :
 *   node scripts/migrate-firebase-images-to-cloudinary.mjs            (dry-run, aucune écriture)
 *   node scripts/migrate-firebase-images-to-cloudinary.mjs --apply    (migration réelle)
 *
 * Pour --apply, le script demande l'email et le mot de passe du compte admin
 * (les mêmes que pour se connecter sur /admin) de façon interactive : rien
 * n'est écrit sur le disque ni affiché en clair.
 */

import { readFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

const CLOUDINARY_CLOUD_NAME = "gho9ewh4";
const CLOUDINARY_UPLOAD_PRESET = "guitaristes";
const FIREBASE_STORAGE_MARKER = "firebasestorage.googleapis.com";

const APPLY = process.argv.includes("--apply");

function loadEnvLocal() {
  const envPath = path.join(PROJECT_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    throw new Error(".env.local introuvable à la racine de guitaristapp");
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[trimmed.slice(0, idx).trim()] = value;
  }
  return env;
}

function prompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Masque la saisie du mot de passe (remplace chaque caractère par * à l'affichage).
// Repose sur une astuce readline standard plutôt que sur setRawMode, qui s'est
// révélé peu fiable selon les terminaux (le mot de passe restait visible).
function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    let muted = false;
    const originalWrite = rl._writeToOutput.bind(rl);
    rl._writeToOutput = (stringToWrite) => {
      if (muted) {
        // N'affiche une étoile que pour un vrai caractère saisi, pas pour
        // les séquences de contrôle (retour chariot, etc.).
        if (stringToWrite.length === 1 && stringToWrite !== "\n" && stringToWrite !== "\r") {
          originalWrite("*");
        }
        return;
      }
      originalWrite(stringToWrite);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted = true;
  });
}
async function firebaseSignIn(apiKey, email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Échec de connexion Firebase : ${data.error?.message || res.status}`);
  }
  return data.idToken;
}

async function fetchGuitarists(databaseURL) {
  const url = `${databaseURL.replace(/\/$/, "")}/.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Échec de lecture de la base (${res.status})`);
  }
  const data = await res.json();
  return data || {};
}

async function uploadToCloudinary(buffer, filename) {
  const form = new FormData();
  form.append("file", new Blob([buffer]), filename);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Échec de l'upload Cloudinary (${res.status})`);
  }
  return data.secure_url;
}

async function updateImgURL(databaseURL, key, idToken, newUrl) {
  const url = `${databaseURL.replace(/\/$/, "")}/${key}.json?auth=${idToken}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imgURL: newUrl }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Échec de la mise à jour (${res.status})`);
  }
}

async function main() {
  const env = loadEnvLocal();
  const apiKey = env.REACT_APP_CLE_API;
  const databaseURL = env.REACT_APP_DATABASE_URL;
  if (!apiKey || !databaseURL) {
    throw new Error("REACT_APP_CLE_API ou REACT_APP_DATABASE_URL manquant dans .env.local");
  }

  console.log(`Lecture de la base (${APPLY ? "mode migration" : "mode dry-run"})...`);
  const all = await fetchGuitarists(databaseURL);
  const entries = Object.entries(all).filter(
    ([, g]) => typeof g?.imgURL === "string" && g.imgURL.includes(FIREBASE_STORAGE_MARKER)
  );

  if (entries.length === 0) {
    console.log("Aucune fiche avec une image encore hébergée sur Firebase Storage. Rien à faire.");
    return;
  }

  console.log(`\n${entries.length} fiche(s) concernée(s) :`);
  for (const [key, g] of entries) {
    console.log(`  - ${key} : ${g.prenom || ""} ${g.nom || ""} -> ${g.imgURL}`);
  }

  if (!APPLY) {
    console.log("\nDry-run terminé (aucune écriture). Relance avec --apply pour migrer réellement.");
    return;
  }

  console.log("\nConnexion au compte admin nécessaire pour écrire dans la base.");
  const email = await prompt("Email admin : ");
  const password = await promptHidden("Mot de passe : ");
  const idToken = await firebaseSignIn(apiKey, email, password);
  console.log("Connecté.\n");

  let ok = 0;
  let failed = 0;
  for (const [key, g] of entries) {
    const label = `${g.prenom || ""} ${g.nom || ""} (${key})`.trim();
    try {
      console.log(`→ ${label} : téléchargement...`);
      const imgRes = await fetch(g.imgURL);
      if (!imgRes.ok) throw new Error(`téléchargement échoué (${imgRes.status})`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());

      console.log(`→ ${label} : upload vers Cloudinary...`);
      const newUrl = await uploadToCloudinary(buffer, `${key}.jpg`);

      console.log(`→ ${label} : mise à jour de la base...`);
      await updateImgURL(databaseURL, key, idToken, newUrl);

      console.log(`✓ ${label} migré -> ${newUrl}`);
      ok++;
    } catch (error) {
      console.error(`✗ ${label} : ${error.message}`);
      failed++;
    }
  }

  console.log(`\nTerminé : ${ok} migré(s), ${failed} échec(s).`);
}

main().catch((error) => {
  console.error("Erreur : " + error.message);
  process.exit(1);
});
