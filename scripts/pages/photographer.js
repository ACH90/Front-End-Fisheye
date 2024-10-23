let mediaArray = []; // Déclare mediaArray globalement

// Charger le fichier JSON (fetch)
async function loadJsonData() {
  try {
    const response = await fetch("../data/photographers.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}

//Trouver le photographe par son ID
async function getPhotographerById(id) {
  try {
    const data = await loadJsonData();
    const photographer = data.photographers.find((photog) => photog.id == id);
    if (!photographer) {
      throw new Error("Photographer not found");
    }
    return photographer;
  } catch (error) {
    console.error("Error fetching photographer data:", error);
  }
}

// Fonction pour filtrer les médias par ID de photographe
function filterMediaByPhotographerId(mediaArray, photographerId) {
  return mediaArray.filter((item) => item.photographerId == photographerId);
}

// Charger les medias du photographe par l'ID
async function getMediaByPhotographerId(id) {
  try {
    const data = await loadJsonData();
    const media = filterMediaByPhotographerId(data.media, id);
    return media;
  } catch (error) {
    console.error("Error fetching media data:", error);
  }
}

function displayPhotographerData(photographer) {
  if (!photographer) return;

  // Création du header
  const photographerHeader = document.querySelector(".photograph-header");

  // Création div Photographer info
  const photographerInfo = document.createElement("div");
  photographerInfo.classList.add("photographer-info");
  photographerHeader.appendChild(photographerInfo);

  //Selection de l'element header
  const header = document.querySelector(".modal header");

  //Creation div photographer-name dans la div modal juste après le header
  const photographerNameDiv = document.createElement("div");
  photographerNameDiv.classList.add("photographer-name");

  // Insérer la nouvelle div après le header
  header.insertAdjacentElement("afterend", photographerNameDiv);

  // Ajouter du contenu à la div
  photographerNameDiv.innerHTML = `<h2>${photographer.name}</h2>`;

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

// Extraire le type de media (image ou video)
function getMediaType(mediaItem) {
  if (mediaItem.image && mediaItem.image.endsWith(".jpg")) {
    return "image";
  } else if (mediaItem.video && mediaItem.video.endsWith(".mp4")) {
    return "video";
  }
  return null;
}

// Fonction pour créer l'élément image ou vidéo
function createMediaContent(mediaItem) {
  const mediaType = getMediaType(mediaItem);
  const mediaFolder = `${mediaItem.photographerId}`; // Dossier du photographe
  let mediaContent;

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

  return mediaContent;
}

// Fonction pour créer la section des likes
function createLikesSection(mediaItem) {
  const mediaLikes = document.createElement("p");

  // Ajouter le nombre de likes
  const likesCount = document.createElement("span");
  likesCount.textContent = mediaItem.likes + " ";

  // Créer l'icône de cœur
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-regular", "fa-heart");

  // Ajouter un gestionnaire d'événements pour liker
  heartIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Empêcher la propagation du clic à l'élément parent

    if (heartIcon.classList.contains("fa-regular")) {
      // Passer de fa-regular à fa-solid
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");

      // Incrémenter le compteur de likes
      mediaItem.likes += 1;
      likesCount.textContent = mediaItem.likes + " ";
    } else {
      // Passer de fa-solid à fa-regular (annuler le like)
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");

      // Décrémenter le compteur de likes
      mediaItem.likes -= 1;
      likesCount.textContent = mediaItem.likes + " ";
    }
  });

  mediaLikes.appendChild(likesCount);
  mediaLikes.appendChild(heartIcon);

  return mediaLikes;
}

// Fonction principale pour créer un media item
function mediaFactory(mediaItem) {
  // Créer l'élément media-item
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

  // Créer l'élément media-piece dans le media-item
  const mediaPiece = document.createElement("div");
  mediaPiece.classList.add("media-piece");
  mediaElement.appendChild(mediaPiece);

  // Ajouter le contenu média (image ou vidéo)
  const mediaContent = createMediaContent(mediaItem);
  mediaPiece.appendChild(mediaContent);

  // Créer l'élément media-info
  const mediaInfo = document.createElement("div");
  mediaInfo.classList.add("media-info");
  mediaElement.appendChild(mediaInfo);

  // Ajouter le titre du média
  const mediaTitle = document.createElement("p");
  mediaTitle.textContent = mediaItem.title;
  mediaInfo.appendChild(mediaTitle);

  // Ajouter la section des likes
  const mediaLikes = createLikesSection(mediaItem);
  mediaInfo.appendChild(mediaLikes);

  return mediaElement;
}

function displayPhotographerMedia(media) {
  // Initialiser mediaArray avec les œuvres du photographe
  mediaArray = media;

  // Créer une section pour les œuvres du photographe
  const mediaSection = document.querySelector(".photographer-works");

  // Pour chaque œuvre, utiliser la factory pour créer et ajouter les éléments
  media.forEach((item, index) => {
    const mediaElement = mediaFactory(item);

    // Ajouter un événement de clic pour ouvrir la modale avec le carrousel
    mediaElement.addEventListener("click", (event) => {
      // Empêcher l'action par défaut (lecture de la vidéo)
      event.preventDefault();

      openModal(index, media); // Ouvrir la modale et passer l'index du média cliqué
    });

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
