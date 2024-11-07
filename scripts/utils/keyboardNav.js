// Fonction pour initialiser la navigation par clavier
export function initKeyboardNavigation() {
  const photographersLinks = document.querySelectorAll(".focusable-link");
  let currentIndex = 0;

  if (photographersLinks.length === 0) {
    console.error("Aucun photographe trouvé");
    return;
  }

  // Focus initial sur le premier photographe sans affichage visuel
  photographersLinks[currentIndex].setAttribute("tabindex", -1);
  photographersLinks[currentIndex].focus();

  function focusPhotographer(e) {
    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % photographersLinks.length;
    } else if (e.key === "ArrowLeft") {
      currentIndex =
        (currentIndex - 1 + photographersLinks.length) %
        photographersLinks.length;
    }

    photographersLinks[currentIndex].focus();
  }

  function openPhotographerPage(e) {
    if (e.key === "Enter") {
      photographersLinks[currentIndex].click();
    }
  }

  // Ajouter les écouteurs d'événements pour les touches
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      focusPhotographer(e);
    } else if (e.key === "Enter") {
      openPhotographerPage(e);
    }
  });
}

// Fonction de retour vers la page d'accueil depuis la modale
export function returnToHomepage() {
  const modal = document.querySelector(".modal-carousel");
  if (modal.style.display === "flex") {
    console.log("Fermer d'abord la modale");
  } else {
    setTimeout(() => {
      window.location.href = "./index.html"; // Redirection vers index.html
    }, 300);
    console.log("Retour vers la page d’accueil");
  }
}

// Ajouter un gestionnaire d'événement pour la touche "Échap"
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    console.log("Touche Échap pressée");
    returnToHomepage(); // Appel de la fonction pour revenir à la page d'accueil
  }
});

// Initialiser la navigation par clavier lorsque le DOM est prêt
// document.addEventListener("DOMContentLoaded", () => {
//   initKeyboardNavigation();
// });
