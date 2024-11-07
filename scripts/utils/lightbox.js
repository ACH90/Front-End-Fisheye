//------------------------------------------------------------- Lightbox

let currentSlideIndex = 0;
let modalMediaArray = []; // Tableau global pour stocker les médias

function openModal(index = 0, mediaArray) {
  if (mediaArray.length === 0) {
    console.warn("Aucun média disponible pour afficher dans la modale.");
    return;
  }
  // Initialiser currentSlideIndex avec l'index du média cliqué
  currentSlideIndex = index;
  modalMediaArray = mediaArray; // Stocker le mediaArray dans une variable globale

  // Sélectionner l'élément de la modale et l'afficher
  const modal = document.querySelector(".modal-carousel");
  modal.style.display = "flex";

  // Afficher le média correspondant à l'index
  showSlide(currentSlideIndex);

  // Ajouter un écouteur d'événements pour gérer les touches du clavier
  document.addEventListener("keydown", handleKeyDown);
}

// Ouvrir la modale en appuyant sur une touche spécifique
document.addEventListener("keydown", function (event) {
  modalMediaArray = mediaArray; // Stocker le mediaArray dans une variable globale
  if (event.key === "Enter") {
    const modal = document.querySelector(".modal-carousel");

    // Ouvrir la modale avec le premier média si elle est actuellement fermée
    if (modal.style.display !== "flex") {
      openModal(0, modalMediaArray); // Affiche le premier média
    }
  }
});

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

function handleKeyDown(event) {
  // Vérifier si la modale est ouverte
  const modal = document.querySelector(".modal-carousel");
  if (modal.style.display === "flex") {
    if (event.key === "ArrowLeft") {
      // Flèche gauche pour changer vers la gauche
      changeSlide(-1);
    } else if (event.key === "ArrowRight") {
      // Flèche droite pour changer vers la droite
      changeSlide(1);
    } else if (event.key === "Escape") {
      // Touche Échap pour fermer la modale
      closeModalCarousel();
    }
  }
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

  // Retirer l'écouteur d'événements pour éviter les fuites de mémoire
  document.removeEventListener("keydown", handleKeyDown);

  currentSlideIndex = 0;
}
