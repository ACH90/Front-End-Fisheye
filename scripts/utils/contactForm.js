function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

//Recupération des données du formulaire de contact (Modale)

// Ajouter un écouteur d'événements pour l'envoi du formulaire
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    // Empêche la soumission du formulaire et le rechargement de la page
    event.preventDefault();

    // Appel de la fonction pour obtenir les valeurs du formulaire
    const formValues = getFormValues();

    // Vous pouvez traiter ces données ou les envoyer à un serveur ici
    console.log("Formulaire soumis avec succès :", formValues);
  });

// Fonction pour récupérer les valeurs du formulaire
function getFormValues() {
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  closeModal();

  return { firstName, lastName, email, message };
}
