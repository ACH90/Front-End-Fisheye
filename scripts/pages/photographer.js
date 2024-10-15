async function getPhotographerById(id) {
  // Charger les données depuis le fichier JSON
  try {
    const response = await fetch("../data/photographers.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // Trouver le photographe correspondant à l'ID
    const photographer = data.photographers.find((photog) => photog.id == id);
    if (!photographer) {
      throw new Error("Photographer not found");
    }
    return photographer;
  } catch (error) {
    console.error("Error fetching photographer data:", error);
  }
}

async function getMediaByPhotographerId(id) {
  // Charger les données depuis le fichier JSON
  const response = await fetch("../data/photographers.json");
  const data = await response.json();

  // Trouver les œuvres correspondant au photographe
  const media = data.media.filter((item) => item.photographerId == id);
  return media;
}

function displayPhotographerData(photographer, media) {
  if (!photographer) return;

  // Création du header
  const photographerHeader = document.querySelector(".photograph-header");

  // Création div Photographer info
  const photographerInfo = document.createElement("div");
  photographerInfo.classList.add("photographer-info");
  photographerHeader.appendChild(photographerInfo);

  // Trouver le bouton "Contactez-moi" dans le HTML
  const contactButton = photographerHeader.querySelector(".contact_button");

  // Création des éléments à ajouter avant le bouton
  const h1 = document.createElement("h1");
  h1.textContent = photographer.name;

  const location = document.createElement("p");
  location.textContent = `${photographer.city}, ${photographer.country}`;
  location.classList.add("photographer-location");

  const tagline = document.createElement("p");
  tagline.textContent = photographer.tagline;
  tagline.classList.add("photographer-tagline");

  const price = document.createElement("p");
  price.textContent = `${photographer.price}€/jour`;
  price.classList.add("photographer-price");

  // Ajouter les éléments avant le bouton "Contactez-moi"
  photographerInfo.appendChild(h1, contactButton);
  photographerInfo.appendChild(location, contactButton);
  photographerInfo.appendChild(tagline, contactButton);
  photographerInfo.appendChild(price, contactButton);

  // Ajouter photographerInfo avant bouton "Contactez-moi"
  photographerHeader.insertBefore(photographerInfo, contactButton);

  // Ajouter la photo après le bouton "Contactez-moi"
  const img = document.createElement("img");
  img.setAttribute("src", `assets/photographers/${photographer.portrait}`);
  img.setAttribute("alt", photographer.name);

  photographerHeader.appendChild(img);
}

// Creer une fonction pour extraire le type de media
function getMediaType(mediaItem) {
  if (mediaItem.image && mediaItem.image.endsWith(".jpg")) {
    return "image";
  } else if (mediaItem.video && mediaItem.video.endsWith(".mp4")) {
    return "video";
  }
  return null;
}

function mediaFactory(mediaItem) {
  // Creer l'element media-item
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

  // Creer l'element media-piece dans le media-item
  const mediaPiece = document.createElement("div");
  mediaPiece.classList.add("media-piece");
  mediaElement.appendChild(mediaPiece);

  let mediaContent;

  // Utiliser la fonction getMediaType pour vérifier le type
  const mediaType = getMediaType(mediaItem);

  // Utiliser un sous-dossier spécifique au photographe (par exemple, basé sur l'ID)
  const mediaFolder = `${mediaItem.photographerId}`; // Le dossier de chaque photographe

  if (mediaType === "image") {
    mediaContent = document.createElement("img");
    mediaContent.setAttribute(
      "src",
      `assets/media/${mediaFolder}/${mediaItem.image}`
    );
    mediaContent.setAttribute("alt", mediaItem.title);
  } else if (mediaType === "video") {
    mediaContent = document.createElement("video");
    mediaContent.setAttribute("controls", true);
    const source = document.createElement("source");
    source.setAttribute(
      "src",
      `assets/media/${mediaFolder}/${mediaItem.video}`
    );
    source.setAttribute("type", "video/mp4");
    mediaContent.appendChild(source);
  }

  // Ajouter le mediaContent à la mediaElement
  mediaPiece.appendChild(mediaContent);

  // Creer l'élément media-info dans le media-item après la video ou l'image
  const mediaInfo = document.createElement("div");
  mediaInfo.classList.add("media-info");
  mediaElement.appendChild(mediaInfo);

  const mediaTitle = document.createElement("p");
  mediaTitle.textContent = mediaItem.title;

  // Créer la section des likes avec l'icône de cœur
  const mediaLikes = document.createElement("p");

  // Ajouter le nombre de likes
  const likesCount = document.createElement("span");
  likesCount.textContent = mediaItem.likes + " ";

  // Créer l'icône de cœur
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-solid", "fa-heart");

  // Ajouter le nombre de likes et l'icône de cœur dans la section des likes
  mediaLikes.appendChild(likesCount);
  mediaLikes.appendChild(heartIcon);

  mediaInfo.appendChild(mediaTitle);
  mediaInfo.appendChild(mediaLikes);

  return mediaElement;
}

function displayPhotographerMedia(media) {
  // Créer une section pour les œuvres du photographe
  const mediaSection = document.querySelector(".photographer-works");

  // Pour chaque œuvre, utiliser la factory pour créer et ajouter les éléments
  media.forEach((item) => {
    const mediaElement = mediaFactory(item);
    mediaSection.appendChild(mediaElement);
  });

  // Ajouter la section des œuvres au DOM (dans le main ou ailleurs)
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
  displayPhotographerData(photographer); // Affiche les infos du photographe
  displayPhotographerMedia(media); // Affiche les œuvres du photographe
});
