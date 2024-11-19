function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

// eslint-disable-next-line no-unused-vars
function displayModal(photographerName) {
  const modal = document.getElementById("contact_modal");
  const main = document.getElementById("main");
  const close = modal.querySelector(".close-modal");

  if (!close) {
    console.error("L'élément .close n'a pas été trouvé !");
    return;
  }

  modal.style.display = "block";
  close.focus();

  main.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "false");

  // Active le trapping du focus
  trapFocus(modal);
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    closeModal(); // Fermer la modale si la touche Enter est appuyée lorsque le focus est sur la croix de la modale
  }
});

// Écouter l'événement keydown
document.addEventListener("keydown", function (event) {
  const modal = document.getElementById("contact_modal");

  // Vérifier si la touche pressée est "Escape" et si la modale est ouverte
  if (event.key === "Escape" && modal.style.display === "flex") {
    closeModal();
  }
});

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
