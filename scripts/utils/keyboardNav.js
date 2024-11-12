// Fonction de retour vers la page d'accueil
// eslint-disable-next-line no-unused-vars
function returnToHomepage() {
  const modal = document.querySelector(".modal-carousel");
  const modalForm = document.getElementById("contact_modal");

  // Vérifiez si la modale ou le formulaire sont visibles
  const isModalVisible =
    modal && window.getComputedStyle(modal).display === "flex";
  const isModalFormVisible =
    modalForm && window.getComputedStyle(modalForm).display === "block";

  if (isModalVisible) {
    console.log("Fermer d'abord la modale");
    modal.style.display = "none"; // Fermer la modale
    modal.setAttribute("aria-hidden", "true");
  } else if (isModalFormVisible) {
    console.log("Fermer d'abord le formulaire de contact");
    modalForm.style.display = "none"; // Fermer le formulaire de contact
    modalForm.setAttribute("aria-hidden", "true");
  } else {
    setTimeout(() => {
      window.location.href = "./index.html"; // Redirection vers index.html
    }, 300);
    console.log("Retour vers la page d’accueil");
  }
}

//
