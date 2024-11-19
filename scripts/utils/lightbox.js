//------------------------------------------------------------- Lightbox

let currentSlideIndex = 0;
let modalMediaArray = []; // Tableau global pour stocker les médias
let lastFocusedElement;

function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Navigation inverse
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Navigation normale
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });

  // Donner le focus au premier élément dès l'ouverture
  firstElement.focus();
}

// eslint-disable-next-line no-unused-vars
function openModal(index = 0, mediaArray) {
  currentSlideIndex = index;
  modalMediaArray = mediaArray; // Stocker le tableau des médias

  // Vérifier que le tableau contient des données
  if (mediaArray.length === 0) {
    console.warn("Aucun média disponible pour afficher dans la modale.");
    return;
  }

  // Sauvegarder l'élément actuellement en focus
  lastFocusedElement = document.activeElement;

  // Afficher la modale et configurer l'accessibilité
  const modal = document.querySelector(".modal-carousel");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");

  const main = document.getElementById("main");
  main.setAttribute("aria-hidden", "true");
  main.setAttribute("tabindex", "-1");

  // Assurer que le focus est piégé dans la modale
  trapFocus(modal);

  // Afficher le média correspondant à l'index
  showSlide(currentSlideIndex);

  // Ajouter un écouteur d'événements pour gérer les touches du clavier
  document.addEventListener("keydown", handleKeyDown);
}

function showSlide(index) {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = ""; // Vider le contenu précédent

  const mediaItem = modalMediaArray[index]; // Utiliser modalMediaArray ici

  // Créer le média avec la MediaFactory
  // eslint-disable-next-line no-undef
  const mediaElement = MediaFactory.createMedia(mediaItem).createElement();

  // Si le média est une vidéo, la démarrer automatiquement
  if (mediaElement.tagName === "VIDEO") {
    mediaElement.play();
  }

  modalContent.appendChild(mediaElement);
}
// Ecouteur d'événements pour "Enter"
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Récupérer l'élément actuellement focusé
    const focusedElement = document.querySelector(".media-item:focus"); // Assurez-vous que .media-item est bien la classe de votre média

    if (focusedElement) {
      // Trouver l'index du média dans le tableau
      const index = [...focusedElement.parentElement.children].indexOf(
        focusedElement
      );

      // Assurez-vous que mediaArray contient les médias
      // eslint-disable-next-line no-undef
      modalMediaArray = mediaArray; // Charger les données de mediaArray

      openModal(index, modalMediaArray); // Ouvrir la modale avec l'index du média
    }
  }
});
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
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  const main = document.getElementById("main");
  main.setAttribute("aria-hidden", "false");
  main.removeAttribute("tabindex");

  // Restaurer le focus à l'élément précédemment sélectionné
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

  // Supprimer les écouteurs d'événements
  document.removeEventListener("keydown", handleKeyDown);
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
