//------------------------------------------------------------- Lightbox

function openModal(index, mediaArray) {
  // Initialiser currentSlideIndex avec l'index du média cliqué
  currentSlideIndex = index;

  // Sélectionner l'élément de la modale et l'afficher
  const modal = document.querySelector(".modal-carousel");
  modal.style.display = "flex";

  // Afficher le média correspondant à l'index
  showSlide(index, mediaArray);
}

function showSlide(index, mediaArray) {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = ""; // Vider le contenu précédent

  const mediaItem = mediaArray[index];
  const mediaType = getMediaType(mediaItem);
  const mediaFolder = `${mediaItem.photographerId}`;

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

    // Démarrer la vidéo automatiquement dans la modale
    mediaContent.play();
  }

  modalContent.appendChild(mediaContent);
}

let currentSlideIndex = 0;

function changeSlide(n) {
  currentSlideIndex += n;

  // Vérifie si l'index est en dehors des limites
  if (currentSlideIndex < 0) {
    currentSlideIndex = mediaArray.length - 1; // Va à la dernière image
  } else if (currentSlideIndex >= mediaArray.length) {
    currentSlideIndex = 0; // Revient à la première image
  }

  showSlide(currentSlideIndex, mediaArray); // Affiche le slide courant
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
