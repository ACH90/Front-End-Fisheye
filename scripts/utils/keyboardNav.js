function initKeyboardNavigation() {
  const photographersLinks = document.querySelectorAll(".focusable-link");
  let currentIndex = 0;

  if (photographersLinks.length === 0) {
    console.error("Aucun photographe trouvé");
    return;
  }

  // Focus initial sur le premier photographe sans affichage visuel
  photographersLinks[currentIndex].setAttribute("tabindex", -1);
  // photographersLinks[currentIndex].classList.add("hidden-focus");

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

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      focusPhotographer(e);
    } else if (e.key === "Enter") {
      openPhotographerPage(e);
    }
  });
}

// Fonction de retour vers la page d'accueil
function returnToHomepage() {
  const modal = document.querySelector(".modal-carousel");
  if (modal.style.display === "flex") {
    console.log("Fermer dabord la modale");
  } else {
    setTimeout(() => {
      window.location.href = "index.html"; // Redirection vers index.html
    }, 300);
    console.log("Retour vers la page d’accueil");
  }
}
