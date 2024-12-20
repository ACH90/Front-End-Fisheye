async function getPhotographers() {
  // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
  // requête sur le fichier JSON en utilisant "fetch".

  const response = await fetch("./data/photographers.json");

  // et bien retourner le tableau photographers seulement une fois récupéré
  return await response.json();
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    // eslint-disable-next-line no-undef
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });

  // Initialiser la navigation clavier après l'ajout des photographes
  // eslint-disable-next-line no-undef
  // initKeyboardNavigation();
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
