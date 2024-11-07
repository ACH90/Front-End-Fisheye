import {
  getPhotographerById,
  setMediaArray,
} from "../dataLoader/dataLoader.js";

import { openModal, closeModalCarousel } from "../utils/lightbox.js";

import MediaFactory from "../factory/mediaFactory.js";

let totalLikesElement; // Déclaration globale pour l'élément des likes totaux

// Fonction pour mettre à jour le total des likes
function updateTotalLikes(mediaArray) {
  if (!totalLikesElement) return; // Vérification si totalLikesElement est défini

  let totalLikes = mediaArray.reduce((sum, media) => sum + media.likes, 0);
  totalLikesElement.textContent = `${totalLikes} `;
  console.log("Total des likes:", totalLikes);
}

// Fonction pour créer un media item
function createMediaItem(mediaItem) {
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

  const mediaPiece = document.createElement("div");
  mediaPiece.classList.add("media-piece");

  console.log(mediaItem); // Vérifie si mediaItem contient toutes les propriétés nécessaires

  const media = MediaFactory.createMedia(mediaItem);
  mediaPiece.appendChild(media.createElement());

  mediaElement.appendChild(mediaPiece);
  mediaElement.appendChild(createMediaInfo(mediaItem));

  return mediaElement;
}

// Fonction pour créer la section des likes
function createLikesSection(mediaItem, mediaArray) {
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
    updateTotalLikes(mediaArray);
  });

  mediaLikes.appendChild(likesCount);
  mediaLikes.appendChild(heartIcon);

  return mediaLikes;
}

// Fonction pour créer les informations du media (titre et likes)
function createMediaInfo(mediaItem, mediaArray) {
  const mediaInfo = document.createElement("div");
  mediaInfo.classList.add("media-info");

  const mediaTitle = document.createElement("p");
  mediaTitle.textContent = mediaItem.title;
  mediaInfo.appendChild(mediaTitle);

  const mediaLikes = createLikesSection(mediaItem, mediaArray);
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

  // Initialisation du total des likes
  totalLikesElement = document.createElement("p");
  totalLikesElement.classList.add("photographer-likes");

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-solid", "fa-heart");

  // Mettre à jour le total des likes après le calcul
  likesAndPrice.appendChild(totalLikesElement);
  likesAndPrice.appendChild(heartIcon);

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
  contactButton.addEventListener("click", () => openModal(photographer.name));
}

// Afficher les médias du photographe
async function displayPhotographerMedia(photographerId) {
  const media = await setMediaArray(photographerId); // Appel de la fonction qui remplit mediaArray et met à jour les likes
  const mediaSection = document.querySelector(".photographer-works");

  media.forEach((item) => {
    const mediaElement = createMediaItem(item, media);
    mediaElement.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(item.id, media);
    });
    mediaSection.appendChild(mediaElement);
  });

  const main = document.querySelector("#main");
  main.appendChild(mediaSection);

  updateTotalLikes(media); // Met à jour le total des likes après avoir affiché les médias
}

// Extraire l'ID du photographe depuis l'URL
const params = new URLSearchParams(window.location.search);
const photographerId = params.get("id");

// Charger et afficher les données du photographe et ses œuvres
Promise.all([
  getPhotographerById(photographerId),
  displayPhotographerMedia(photographerId),
]).then(([photographer]) => {
  displayPhotographerData(photographer);
});
