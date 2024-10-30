let mediaArray = []; // Déclare mediaArray globalement

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

// Classes spécifiques pour chaque type de média
class ImageMedia {
  constructor(mediaItem) {
    this.mediaItem = mediaItem;
  }

  createElement() {
    const img = document.createElement("img");
    img.setAttribute(
      "src",
      `assets/media/${this.mediaItem.photographerId}/${this.mediaItem.image}`
    );
    img.setAttribute("alt", this.mediaItem.title);
    return img;
  }
}

class VideoMedia {
  constructor(mediaItem) {
    this.mediaItem = mediaItem;
  }

  createElement() {
    const video = document.createElement("video");
    video.setAttribute("controls", true);
    const source = document.createElement("source");
    source.setAttribute(
      "src",
      `assets/media/${this.mediaItem.photographerId}/${this.mediaItem.video}`
    );
    source.setAttribute("type", "video/mp4");
    video.appendChild(source);
    return video;
  }
}

// Factory pour créer le bon type de média
class MediaFactory {
  static createMedia(mediaItem) {
    const mediaType = MediaFactory.getMediaType(mediaItem);
    if (mediaType === "image") {
      return new ImageMedia(mediaItem);
    } else if (mediaType === "video") {
      return new VideoMedia(mediaItem);
    } else {
      throw new Error("Unknown media type");
    }
  }

  static getMediaType(mediaItem) {
    if (mediaItem.image && mediaItem.image.endsWith(".jpg")) {
      return "image";
    } else if (mediaItem.video && mediaItem.video.endsWith(".mp4")) {
      return "video";
    }
    return null;
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

  const price = document.createElement("p");
  price.textContent = `${photographer.price}€/jour`;
  price.classList.add("photographer-price");

  photographerInfo.append(h1, location, tagline, price);
  photographerHeader.insertBefore(
    photographerInfo,
    photographerHeader.querySelector(".contact_button")
  );

  const img = document.createElement("img");
  img.setAttribute("src", `assets/photographers/${photographer.portrait}`);
  img.setAttribute("alt", photographer.name);

  photographerHeader.appendChild(img);
}

// Afficher les médias du photographe
function displayPhotographerMedia(media) {
  mediaArray = media;
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
  displayPhotographerData(photographer);
  displayPhotographerMedia(media);
});
