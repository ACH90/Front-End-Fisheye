// Fonction pour charger les données JSON
export async function loadJsonData() {
  try {
    const response = await fetch("./data/photographers.json");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

// Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
// requête sur le fichier JSON en utilisant "fetch".
export async function getPhotographers() {
  try {
    const response = await fetch("./data/photographers.json");
    if (!response.ok) {
      throw new Error("Erreur de récupération des photographes");
    }
    const data = await response.json();
    return data.photographers; // Retourner directement les photographes
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    throw error;
  }
}

// Fonction pour initialiser et remplir mediaArray
// Cette fonction ne modifie plus une variable globale, mais retourne simplement les médias
export async function setMediaArray(photographerId) {
  const data = await loadJsonData();
  if (!data) return [];

  const media = data.media.filter(
    (item) => item.photographerId == photographerId
  );

  return media; // Retourne directement les médias filtrés
}

// Fonction pour récupérer les données du photographe
export async function getPhotographerById(id) {
  const data = await loadJsonData();
  return data.photographers.find((photog) => photog.id == id);
}

// Fonction pour récupérer les médias d'un photographe par son ID
export async function getMediaByPhotographerId(id) {
  try {
    const data = await loadJsonData();
    return data.media.filter((item) => item.photographerId == id);
  } catch (error) {
    console.error("Error fetching media data:", error);
  }
}
