// Insère une transformation Cloudinary (redimensionnement + optimisation
// auto du format/qualité) dans une URL Cloudinary déjà existante, sans avoir
// à re-uploader le fichier : Cloudinary génère la variante à la volée et la
// met en cache. Exemple :
//   https://res.cloudinary.com/xxx/image/upload/v123/photo.jpg
//   -> https://res.cloudinary.com/xxx/image/upload/w_400,q_auto,f_auto/v123/photo.jpg
//
// Si l'URL fournie n'est pas reconnue comme une URL Cloudinary "upload"
// (fiche sans photo, URL externe...), elle est renvoyée telle quelle : pas
// de risque de casser un affichage existant.
export const cloudinaryTransform = (url, transformation) => {
  if (!url) return url;
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return url;
  const insertAt = index + marker.length;
  return url.slice(0, insertAt) + transformation + "/" + url.slice(insertAt);
};

// Vignette de la page d'accueil (~101 cartes affichées en même temps) :
// une image large ne sert à rien pour une carte de 365px de large, et
// alourdit inutilement le chargement de la page.
export const cloudinaryCardThumbnail = (url) =>
  cloudinaryTransform(url, "w_400,q_auto,f_auto");

// Photo de la fiche détaillée : affichée plus grande (jusqu'à ~373px de CSS,
// donc jusqu'à ~750px sur un écran haute densité), mais toujours inutile de
// servir la résolution d'upload d'origine.
export const cloudinaryDetailImage = (url) =>
  cloudinaryTransform(url, "w_800,q_auto,f_auto");
