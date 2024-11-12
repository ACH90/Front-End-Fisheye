// Fonction de retour vers la page d'accueil
// eslint-disable-next-line no-unused-vars
function returnToHomepage() {
  const modal = document.querySelector(".modal-carousel");
  if (modal.style.display === "flex") {
    console.log("Fermer dabord la modale");
  } else {
    setTimeout(() => {
      window.location.href = "./index.html"; // Redirection vers index.html
    }, 300);
    console.log("Retour vers la page d’accueil");
  }
}

//
