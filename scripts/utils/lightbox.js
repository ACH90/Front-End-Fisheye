//------------------------------------------------------------- Lightbox

let currentSlideIndex = 0;
let modalMediaArray = []; // Tableau global pour stocker les médias

function openModal(index, mediaArray) {
  // Initialiser currentSlideIndex avec l'index du média cliqué
  currentSlideIndex = index;
  modalMediaArray = mediaArray; // Stocker le mediaArray dans une variable globale

  // Sélectionner l'élément de la modale et l'afficher
  const modal = document.querySelector(".modal-carousel");
  modal.style.display = "flex";

  // Afficher le média correspondant à l'index
  showSlide(currentSlideIndex);
}

function showSlide(index) {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = ""; // Vider le contenu précédent

  const mediaItem = modalMediaArray[index]; // Utiliser modalMediaArray ici

  // Créer le média avec la MediaFactory
  const mediaElement = MediaFactory.createMedia(mediaItem).createElement();

  // Si le média est une vidéo, la démarrer automatiquement
  if (mediaElement.tagName === "VIDEO") {
    mediaElement.play();
  }

  modalContent.appendChild(mediaElement);
}

function changeSlide(n) {
  currentSlideIndex += n;

  // Vérifie si l'index est en dehors des limites
  if (currentSlideIndex < 0) {
    currentSlideIndex = modalMediaArray.length - 1; // Va à la dernière image
  } else if (currentSlideIndex >= modalMediaArray.length) {
    currentSlideIndex = 0; // Revient à la première image
  }

  showSlide(currentSlideIndex); // Affiche le slide courant
}

function closeModalCarousel() {
  const modal = document.querySelector(".modal-carousel");

  // Trouver la vidéo dans la modale
  const video = modal.querySelector("video");

  // Si une vidéo est présente, la mettre en pause et réinitialiser son temps de lecture
  if (video) {
    video.pause(); // Met en pause la vidéo
    video.currentTime = 0; // Remet la vidéo à 0
  }

  // Fermer la modale
  modal.style.display = "none";

  currentSlideIndex = 0;
}
