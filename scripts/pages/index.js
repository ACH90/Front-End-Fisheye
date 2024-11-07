import { initKeyboardNavigation } from "../utils/keyboardNav.js";
import { getPhotographers } from "../dataLoader/dataLoader.js";

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  // Vérification si des photographes existent
  if (photographers.length === 0) {
    console.error("Aucun photographe trouvé pour le moment ");
    return;
  }
  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });

  // Initialiser la navigation clavier après l'ajout des photographes
  initKeyboardNavigation();
}

async function init() {
  // Récupère les datas des photographes via getPhotographers() importé de dataLoader.js
  const photographers = await getPhotographers();
  displayData(photographers);
}

init();
