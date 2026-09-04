#!/usr/bin/env node
// Migre les guitaristes de Firebase Realtime Database vers la table
// Supabase `guitarists` (voir supabase/schema.sql, à exécuter AVANT ce
// script). N'utilise que fetch natif, aucune dépendance à installer.
//
// À exécuter dans TON propre terminal (pas via l'environnement de Claude),
// car il demande la clé service_role Supabase, qui ne doit jamais transiter
// ailleurs que sur ta machine :
//
//   node scripts/migrate-firebase-to-supabase.mjs           (dry-run, aucune écriture)
//   node scripts/migrate-firebase-to-supabase.mjs --apply    (écrit réellement dans Supabase)
//
// La clé service_role se trouve dans le dashboard Supabase :
// Project Settings > API > service_role (secret). Ne JAMAIS la mettre dans
// .env.local ni la committer : ce script te la demande à chaque exécution.

import { createInterface } from "readline";
import { readFileSync } from "fs";

const APPLY = process.argv.includes("--apply");

function loadEnvLocal() {
  try {
    const content = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
    const env = {};
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      // Les valeurs sont entourées de guillemets simples ou doubles dans
      // .env.local : on les retire pour récupérer la valeur brute.
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[match[1]] = value;
    }
    return env;
  } catch {
    return {};
  }
}

function prompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function fetchFirebaseGuitarists(databaseURL) {
  const url = databaseURL.replace(/\/?$/, "/") + ".json";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Échec de lecture Firebase (${response.status})`);
  }
  const data = await response.json();
  if (!data) return [];
  return Object.values(data);
}

// Certaines fiches Firebase ont une chaîne vide ("") plutôt que null/absent
// pour les champs numériques (ex. année de mort d'un guitariste vivant) :
// Postgres refuse "" pour une colonne int, il faut convertir en null.
function toIntOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toSupabaseRow(guitarist) {
  return {
    nom: guitarist.nom ?? "",
    prenom: guitarist.prenom ?? null,
    nationalite: guitarist.nationalite ?? null,
    ville: guitarist.ville ?? null,
    annee_naissance: toIntOrNull(guitarist.anneeNaissance),
    annee_mort: toIntOrNull(guitarist.anneeMort),
    mort: guitarist.mort === true || guitarist.mort === "true",
    area: guitarist.area ?? null,
    bio: guitarist.bio ?? null,
    bio2: guitarist.bio2 ?? null,
    bio3: guitarist.bio3 ?? null,
    bio4: guitarist.bio4 ?? null,
    img_url: guitarist.imgURL ?? null,
    wiki: guitarist.wiki ?? null,
    yt_ref: guitarist.ytRef ?? null,
  };
}

async function insertIntoSupabase(supabaseUrl, serviceRoleKey, rows) {
  const response = await fetch(`${supabaseUrl}/rest/v1/guitarists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Échec d'insertion Supabase (${response.status}) : ${text}`);
  }
}

async function main() {
  const env = loadEnvLocal();
  const databaseURL = env.REACT_APP_DATABASE_URL;
  const supabaseUrl = env.REACT_APP_SUPABASE_URL;

  if (!databaseURL || !supabaseUrl) {
    console.error(
      "REACT_APP_DATABASE_URL et/ou REACT_APP_SUPABASE_URL manquants dans .env.local"
    );
    process.exit(1);
  }

  console.log(`Lecture des guitaristes depuis Firebase (${databaseURL})...`);
  const guitarists = await fetchFirebaseGuitarists(databaseURL);
  console.log(`${guitarists.length} fiches trouvées.`);

  const rows = guitarists.map(toSupabaseRow);

  if (!APPLY) {
    console.log("\nDry-run (aucune écriture). Aperçu de la première fiche transformée :");
    console.log(JSON.stringify(rows[0], null, 2));
    console.log(
      `\nRelance avec --apply pour insérer les ${rows.length} fiches dans Supabase.`
    );
    return;
  }

  const serviceRoleKey = await prompt(
    "Clé service_role Supabase (Project Settings > API), collée ici puis Entrée : "
  );
  if (!serviceRoleKey) {
    console.error("Clé vide, arrêt.");
    process.exit(1);
  }

  console.log(`\nEnvoi de ${rows.length} fiches vers Supabase (${supabaseUrl})...`);
  // Par lots de 50 pour rester raisonnable sur la taille de la requête.
  const BATCH_SIZE = 50;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await insertIntoSupabase(supabaseUrl, serviceRoleKey, batch);
    console.log(`  ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length} insérées`);
  }
  console.log("\nMigration terminée.");
}

main().catch((error) => {
  console.error("Erreur :", error.message);
  process.exit(1);
});
