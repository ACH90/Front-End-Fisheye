let mediaArray = []; // Déclare mediaArray globalement
let totalLikesElement; // Déclaration globale pour l'élément des likes totaux

// Fonction pour charger le fichier JSON (fetch)
async function loadJsonData() {
  try {
    const response = await fetch("./data/photographers.json");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

// Trouver le photographe par son ID
async function getPhotographerById(id) {
  try {
    const data = await loadJsonData();
    const photographer = data.photographers.find((photog) => photog.id == id);
    if (!photographer) throw new Error("Photographer not found");
    return photographer;
  } catch (error) {
    console.error("Error fetching photographer data:", error);
  }
}

// Charger les medias du photographe par l'ID
async function getMediaByPhotographerId(id) {
  try {
    const data = await loadJsonData();
    return data.media.filter((item) => item.photographerId == id);
  } catch (error) {
    console.error("Error fetching media data:", error);
  }
}

// Fonction pour mettre à jour le total des likes
function updateTotalLikes() {
  let totalLikes = mediaArray.reduce((sum, media) => sum + media.likes, 0);
  totalLikesElement.textContent = `${totalLikes} `;
}

// Fonction pour assigner les médias à mediaArray
function setMediaArray(media) {
  mediaArray = media; // Remplir mediaArray avec les médias récupérés
  updateTotalLikes(); // Appeler updateTotalLikes après avoir assigné mediaArray
}

// Assurer que la fonction returnToHomepage soit appelée lors de l'événement "Escape"
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // eslint-disable-next-line no-undef
    returnToHomepage();
  }
});

// Fonction pour créer la section des likes
function createLikesSection(mediaItem) {
  const mediaLikes = document.createElement("p");
  const likesCount = document.createElement("span");
  likesCount.textContent = mediaItem.likes + " ";

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-regular", "fa-heart");

  // Rendre le cœur focusable
  heartIcon.setAttribute("tabindex", "0");

  heartIcon.setAttribute("role", "img");

  // Ajouter un aria-label initial
  heartIcon.setAttribute("aria-label", "Ajouter aux favoris");

  heartIcon.addEventListener("click", function (event) {
    event.stopPropagation();

    toggleHeart(); // Appeler une fonction pour gérer l'activation/désactivation du cœur
  });

  // Ajouter un gestionnaire d'événement pour la touche "Entrée"
  heartIcon.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Vérifier si la touche appuyée est "Enter"
      event.preventDefault(); // Empêcher l'action par défaut (éviter tout comportement involontaire)
      toggleHeart(); // Appeler la fonction pour gérer l'activation/désactivation du cœur
    }
  });

  // Fonction pour basculer entre l'état "fa-regular" et "fa-solid" du cœur
  function toggleHeart() {
    if (heartIcon.classList.contains("fa-regular")) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
      mediaItem.likes += 1;
    } else {
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");
      mediaItem.likes -= 1;
    }

    likesCount.textContent = mediaItem.likes + " ";

    // Mettre à jour le total des likes dans l'élément correspondant
    updateTotalLikes();
  }

  mediaLikes.appendChild(likesCount);
  mediaLikes.appendChild(heartIcon);

  return mediaLikes;
}

// Fonction pour créer les informations du media (titre et likes)
function createMediaInfo(mediaItem) {
  const mediaInfo = document.createElement("div");
  mediaInfo.classList.add("media-info");

  const mediaTitle = document.createElement("p");
  mediaTitle.textContent = mediaItem.title;
  mediaInfo.appendChild(mediaTitle);

  const mediaLikes = createLikesSection(mediaItem);
  mediaInfo.appendChild(mediaLikes);

  return mediaInfo;
}

// Fonction principale pour créer un media item
function createMediaItem(mediaItem) {
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");
  mediaElement.setAttribute("tabindex", "0"); // Rendre l'élément focusable

  const mediaPiece = document.createElement("div");
  mediaPiece.classList.add("media-piece");

  // eslint-disable-next-line no-undef
  const media = MediaFactory.createMedia(mediaItem);
  mediaPiece.appendChild(media.createElement());

  mediaElement.appendChild(mediaPiece);
  mediaElement.appendChild(createMediaInfo(mediaItem));

  return mediaElement;
}
// --------------------------Afficher les données du photographe---------------------------------------
function displayPhotographerData(photographer) {
  if (!photographer) return;

  const photographerHeader = document.querySelector(".photograph-header");

  const photographerInfo = document.createElement("div");
  photographerInfo.classList.add("photographer-info");

  const h1 = document.createElement("h1");
  h1.textContent = photographer.name;

  const location = document.createElement("p");
  location.textContent = `${photographer.city}, ${photographer.country}`;
  location.classList.add("photographer-location");

  const tagline = document.createElement("p");
  tagline.textContent = photographer.tagline;
  tagline.classList.add("photographer-tagline");

  const likesAndPrice = document.createElement("div");
  likesAndPrice.classList.add("likes-and-price");

  // Initialisation du total des likes
  totalLikesElement = document.createElement("p");
  totalLikesElement.classList.add("photographer-likes");
  totalLikesElement.setAttribute("tabindex", "0");

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-solid", "fa-heart");
  heartIcon.setAttribute("tabindex", "0");
  heartIcon.setAttribute("aria-label", "Likes");
  heartIcon.setAttribute("role", "img");

  // Mettre à jour le total des likes après le calcul
  updateTotalLikes();

  likesAndPrice.appendChild(totalLikesElement);
  likesAndPrice.appendChild(heartIcon);
  likesAndPrice.setAttribute("tabindex", "0");

  const price = document.createElement("p");
  price.textContent = `${photographer.price}€/jour`;
  price.classList.add("photographer-price");
  price.setAttribute("tabindex", "0");

  likesAndPrice.appendChild(price);

  photographerInfo.append(h1, location, tagline, likesAndPrice);
  photographerHeader.insertBefore(
    photographerInfo,
    photographerHeader.querySelector(".contact_button")
  );

  const img = document.createElement("img");
  img.setAttribute("src", `assets/photographers/${photographer.portrait}`);
  img.setAttribute("alt", photographer.name);

  photographerHeader.appendChild(img);

  // Assure que le bouton ouvre la modale avec le nom du photographe
  const contactButton = photographerHeader.querySelector(".contact_button");
  contactButton.addEventListener("click", () =>
    // eslint-disable-next-line no-undef
    displayModal(photographer.name)
  );
}

// Afficher les médias du photographe
function displayPhotographerMedia(media) {
  setMediaArray(media); // Appel de la fonction qui remplit mediaArray
  const mediaSection = document.querySelector(".photographer-works");
  media.forEach((item, index) => {
    const mediaElement = createMediaItem(item);
    mediaElement.addEventListener("click", (event) => {
      event.preventDefault();
      // eslint-disable-next-line no-undef
      openModal(index, media);
    });
    mediaSection.appendChild(mediaElement);
  });

  const main = document.querySelector("#main");
  main.appendChild(mediaSection);
}

// Extraire l'ID du photographe depuis l'URL
const params = new URLSearchParams(window.location.search);
const photographerId = params.get("id");

// Charger et afficher les données du photographe et ses œuvres
Promise.all([
  getPhotographerById(photographerId),
  getMediaByPhotographerId(photographerId),
]).then(([photographer, media]) => {
  // Calculer la somme des likes pour tous les médias du photographe
  const totalLikes = media.reduce((sum, item) => sum + item.likes, 0);

  displayPhotographerData(photographer, totalLikes);
  displayPhotographerMedia(media);
});
