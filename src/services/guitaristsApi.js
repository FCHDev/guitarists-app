import { supabase } from "./supabaseClient";

// La table Postgres utilise des noms de colonnes en snake_case (convention
// idiomatique côté base), mais tout le reste du code (composants, pages)
// continue à manipuler des objets en camelCase comme du temps de Firebase :
// PostgREST permet d'aliaser chaque colonne au moment du select
// ("alias:colonne"), donc rien à changer côté composants.
const SELECT_COLUMNS =
  "id, nom, prenom, nationalite, ville, " +
  "anneeNaissance:annee_naissance, anneeMort:annee_mort, mort, area, " +
  "bio, bio2, bio3, bio4, imgURL:img_url, wiki, ytRef:yt_ref";

// Sens inverse pour les écritures (insert/update) : objet JS camelCase ->
// colonnes Postgres snake_case. Les années vides ("") sont converties en
// null, Postgres refusant une chaîne vide pour une colonne entière.
const toRow = (fields) => ({
  nom: fields.nom,
  prenom: fields.prenom,
  nationalite: fields.nationalite,
  ville: fields.ville,
  annee_naissance: fields.anneeNaissance === "" ? null : fields.anneeNaissance,
  annee_mort: fields.anneeMort === "" ? null : fields.anneeMort,
  mort: Boolean(fields.mort),
  area: fields.area,
  bio: fields.bio,
  bio2: fields.bio2,
  bio3: fields.bio3,
  bio4: fields.bio4,
  img_url: fields.imgURL,
  wiki: fields.wiki,
  yt_ref: fields.ytRef,
});

export const fetchGuitarists = async () => {
  const { data, error } = await supabase
    .from("guitarists")
    .select(SELECT_COLUMNS);
  if (error) throw error;
  return data;
};

export const fetchGuitaristById = async (id) => {
  const { data, error } = await supabase
    .from("guitarists")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createGuitarist = async (fields) => {
  const { data, error } = await supabase
    .from("guitarists")
    .insert(toRow(fields))
    .select(SELECT_COLUMNS)
    .single();
  if (error) throw error;
  return data;
};

export const updateGuitarist = async (id, fields) => {
  const { data, error } = await supabase
    .from("guitarists")
    .update(toRow(fields))
    .eq("id", id)
    .select(SELECT_COLUMNS)
    .single();
  if (error) throw error;
  return data;
};

export const deleteGuitarist = async (id) => {
  const { error } = await supabase.from("guitarists").delete().eq("id", id);
  if (error) throw error;
};

// Écoute en continu les changements de la table (ajout/modification/
// suppression), pour garder le rafraîchissement automatique de la liste que
// permettait l'écoute Firebase (onValue sans onlyOnce). On recharge toute
// la liste à chaque évènement plutôt que d'essayer de fusionner le
// changement reçu : plus simple et largement suffisant vu le volume (une
// centaine de fiches).
export const subscribeToGuitarists = (onChange) => {
  const channel = supabase
    .channel("guitarists-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "guitarists" },
      onChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
