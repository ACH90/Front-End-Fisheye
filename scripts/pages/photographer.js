let mediaArray = []; // Déclare mediaArray globalement
let totalLikesElement; // Déclaration globale pour l'élément des likes totaux

// Assurer que la fonction returnToHomepage soit appelée lors de l'événement "Escape"
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    returnToHomepage();
  }
});

// Charger le fichier JSON (fetch)
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

// Fonction principale pour créer un media item
function createMediaItem(mediaItem) {
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

  const mediaPiece = document.createElement("div");
  mediaPiece.classList.add("media-piece");

  const media = MediaFactory.createMedia(mediaItem);
  mediaPiece.appendChild(media.createElement());

  mediaElement.appendChild(mediaPiece);
  mediaElement.appendChild(createMediaInfo(mediaItem));

  return mediaElement;
}

// Fonction pour créer la section des likes
function createLikesSection(mediaItem) {
  const mediaLikes = document.createElement("p");
  const likesCount = document.createElement("span");
  likesCount.textContent = mediaItem.likes + " ";

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-regular", "fa-heart");

  heartIcon.addEventListener("click", function (event) {
    event.stopPropagation();

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
    let totalLikes = mediaArray.reduce((sum, media) => sum + media.likes, 0);
    totalLikesElement.textContent = `${totalLikes} `;
  });

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

// Afficher les données du photographe
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

  // Calcul du total des likes
  let totalLikes = mediaArray.reduce((sum, media) => sum + media.likes, 0);
  totalLikesElement = document.createElement("p");
  totalLikesElement.textContent = `${totalLikes} `;
  totalLikesElement.classList.add("photographer-likes");

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-regular", "fa-heart");
  totalLikesElement.appendChild(heartIcon);

  likesAndPrice.appendChild(totalLikesElement);

  const price = document.createElement("p");
  price.textContent = `${photographer.price}€/jour`;
  price.classList.add("photographer-price");

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
    displayModal(photographer.name)
  );
}

// Afficher les médias du photographe
function displayPhotographerMedia(media) {
  mediaArray = media; // Stocker le tableau des médias globalement
  modalMediaArray = media; // Initialiser modalMediaArray dès le chargement
  const mediaSection = document.querySelector(".photographer-works");

  media.forEach((item, index) => {
    const mediaElement = createMediaItem(item);
    mediaElement.addEventListener("click", (event) => {
      event.preventDefault();
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
