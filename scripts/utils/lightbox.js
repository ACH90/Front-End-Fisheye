// lightbox.js

import { getMediaByPhotographerId } from "../dataLoader/dataLoader.js";

import MediaFactory from "../factory/mediaFactory.js";

let currentSlideIndex = 0;
let modalMediaArray = [];

// Fonction pour ouvrir la modale avec les médias
export function openModal(index = 0, mediaArray) {
  if (!mediaArray || mediaArray.length === 0) {
    console.warn("Aucun média disponible pour afficher dans la modale.");
    return;
  }
  currentSlideIndex = index;
  modalMediaArray = mediaArray;

  const modal = document.querySelector(".modal-carousel");
  modal.style.display = "flex";

  showSlide(currentSlideIndex);

  document.addEventListener("keydown", handleKeyDown);
}

// Fonction pour afficher un slide spécifique (média)
export function showSlide(index) {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";

  const mediaItem = modalMediaArray[index];
  const mediaElement = MediaFactory.createMedia(mediaItem).createElement();

  if (mediaElement.tagName === "VIDEO") {
    mediaElement.play();
  }

  modalContent.appendChild(mediaElement);
}

// Fonction pour changer de slide avec les flèches gauche/droite
export function changeSlide(n) {
  currentSlideIndex += n;

  if (currentSlideIndex < 0) {
    currentSlideIndex = modalMediaArray.length - 1;
  } else if (currentSlideIndex >= modalMediaArray.length) {
    currentSlideIndex = 0;
  }

  showSlide(currentSlideIndex);
}

// Fonction pour gérer les événements de touche dans la modale (flèches et Échap)
function handleKeyDown(event) {
  const modal = document.querySelector(".modal-carousel");
  if (modal.style.display === "flex") {
    if (event.key === "ArrowLeft") {
      changeSlide(-1);
    } else if (event.key === "ArrowRight") {
      changeSlide(1);
    } else if (event.key === "Escape") {
      closeModalCarousel();
    }
  }
}

// Fonction pour fermer la modale
export function closeModalCarousel() {
  const modal = document.querySelector(".modal-carousel");

  const video = modal.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  modal.style.display = "none";
  document.removeEventListener("keydown", handleKeyDown);
  currentSlideIndex = 0;
}

// Fonction pour récupérer les médias du photographe par ID
const params = new URLSearchParams(window.location.search);
const photographerId = params.get("id");

getMediaByPhotographerId(photographerId).then((media) => {
  modalMediaArray = media; // Remplir modalMediaArray avec les médias
});

// Gestion de l'ouverture de la modale avec un événement "click" sur un média
document.addEventListener("click", function (event) {
  if (event.target && event.target.closest(".media-item")) {
    const mediaItemId = event.target.closest(".media-item").dataset.mediaId;
    const mediaItem = modalMediaArray.find((item) => item.id == mediaItemId);

    if (mediaItem) {
      const mediaIndex = modalMediaArray.indexOf(mediaItem);
      openModal(mediaIndex, modalMediaArray);
    }
  }
});
