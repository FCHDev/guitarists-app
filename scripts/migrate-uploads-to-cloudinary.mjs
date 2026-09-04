#!/usr/bin/env node
/**
 * Migration des photos de guitaristes encore hébergées localement
 * (public/uploads/..., héritage d'avant Cloudinary) vers Cloudinary, comme
 * le sont déjà les photos ajoutées depuis la page admin.
 *
 * Pour chaque fiche dont img_url commence par "/uploads/" :
 *   1. lit le fichier correspondant dans public/uploads
 *   2. l'envoie à Cloudinary (même compte/preset non signé que l'admin)
 *   3. met à jour le champ img_url de la fiche avec l'URL Cloudinary renvoyée
 *
 * La mise à jour en base nécessite d'être authentifié (RLS : écriture
 * réservée à "authenticated"). Le script demande l'email et le mot de passe
 * du compte admin de façon interactive (mot de passe masqué), exactement
 * comme pour se connecter sur /admin. Rien n'est stocké ni affiché en clair.
 *
 * Usage (depuis le dossier guitaristapp) :
 *   node scripts/migrate-uploads-to-cloudinary.mjs            (dry-run, aucune écriture ni upload)
 *   node scripts/migrate-uploads-to-cloudinary.mjs --apply    (migration réelle)
 */

import { readFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

const CLOUDINARY_CLOUD_NAME = "gho9ewh4";
const CLOUDINARY_UPLOAD_PRESET = "guitaristes";
const LEGACY_PREFIX = "/uploads/";

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
function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    let muted = false;
    const originalWrite = rl._writeToOutput.bind(rl);
    rl._writeToOutput = (stringToWrite) => {
      if (muted) {
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

async function uploadToCloudinary(filePath) {
  const fileBuffer = readFileSync(filePath);
  const blob = new Blob([fileBuffer]);
  const formData = new FormData();
  formData.append("file", blob, path.basename(filePath));
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Échec de l'upload Cloudinary (${res.status})`);
  }
  return data.secure_url;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const env = loadEnvLocal();
  const supabaseUrl = env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = env.REACT_APP_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("REACT_APP_SUPABASE_URL et/ou REACT_APP_SUPABASE_ANON_KEY manquants dans .env.local");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log(`Mode : ${APPLY ? "APPLICATION RÉELLE" : "dry-run (aucune écriture ni upload)"}\n`);

  if (APPLY) {
    const email = await prompt("Email admin (le même que pour /admin) : ");
    const password = await promptHidden("Mot de passe admin (masqué) : ");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      throw new Error("Échec de connexion à Supabase : " + authError.message);
    }
    console.log("Connecté avec succès.\n");
  }

  const { data: guitarists, error } = await supabase
    .from("guitarists")
    .select("id, nom, prenom, img_url")
    .like("img_url", `${LEGACY_PREFIX}%`);

  if (error) {
    throw new Error("Erreur de lecture Supabase : " + error.message);
  }

  console.log(`${guitarists.length} fiche(s) avec une image locale (${LEGACY_PREFIX}...) trouvée(s).\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const guitarist of guitarists) {
    const label = `${guitarist.prenom || ""} ${guitarist.nom || ""}`.trim() || `#${guitarist.id}`;
    const relativePath = guitarist.img_url.slice(1); // retire le "/" initial
    const filePath = path.join(PROJECT_ROOT, "public", relativePath);

    if (!existsSync(filePath)) {
      console.log(`⚠️  ${label} : fichier introuvable (${guitarist.img_url}), ignoré.`);
      skipped++;
      continue;
    }

    if (!APPLY) {
      console.log(`(dry-run) ${label} : ${guitarist.img_url} -> serait envoyé sur Cloudinary`);
      continue;
    }

    try {
      const cloudinaryUrl = await uploadToCloudinary(filePath);
      const { error: updateError } = await supabase
        .from("guitarists")
        .update({ img_url: cloudinaryUrl })
        .eq("id", guitarist.id);
      if (updateError) throw updateError;
      console.log(`✅ ${label} : ${guitarist.img_url} -> ${cloudinaryUrl}`);
      success++;
      await sleep(250); // ménage l'API Cloudinary (compte gratuit)
    } catch (err) {
      console.error(`❌ ${label} (${guitarist.img_url}) : ${err.message}`);
      failures.push({ label, img_url: guitarist.img_url, error: err.message });
      failed++;
    }
  }

  console.log("\n--- Résumé ---");
  console.log(`Fiches trouvées : ${guitarists.length}`);
  if (APPLY) {
    console.log(`Migrées avec succès : ${success}`);
    console.log(`Fichiers introuvables (ignorées) : ${skipped}`);
    console.log(`Échecs : ${failed}`);
    if (failures.length > 0) {
      console.log("\nDétail des échecs :");
      for (const f of failures) {
        console.log(`- ${f.label} (${f.img_url}) : ${f.error}`);
      }
      console.log(
        "\nNe supprime PAS public/uploads tant que ces échecs ne sont pas réglés : les fichiers correspondants sont encore nécessaires."
      );
    } else if (skipped === 0) {
      console.log(
        "\nToutes les fiches ont été migrées. public/uploads peut être supprimé et retiré du dépôt."
      );
    } else {
      console.log(
        "\nQuelques fichiers étaient introuvables (voir ci-dessus) : vérifie-les avant de supprimer public/uploads."
      );
    }
  } else {
    console.log("Relance avec --apply pour migrer réellement ces fiches.");
  }
}

main().catch((err) => {
  console.error("\nErreur : " + err.message);
  process.exit(1);
});
