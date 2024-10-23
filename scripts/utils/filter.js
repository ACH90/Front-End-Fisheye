//------------------------------------------------------------- Filtre Dropdown

const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");
const dropdownItems = document.querySelectorAll(".dropdown-item");

// Fonction pour vider la section des œuvres du photographe
function clearMediaSection() {
  const mediaSection = document.querySelector(".photographer-works");
  mediaSection.innerHTML = ""; // Vide le contenu précédent
}

// Fonction pour ouvrir/fermer le dropdown
dropdownToggle.addEventListener("click", () => {
  const expanded =
    dropdownToggle.getAttribute("aria-expanded") === "true" || false;
  dropdownToggle.setAttribute("aria-expanded", !expanded);
});

// Fonction pour trier le tableau mediaArray
function sortMediaArray(sortBy) {
  if (sortBy === "popularity") {
    mediaArray.sort((a, b) => b.likes - a.likes); // Trier par popularité (likes)
  } else if (sortBy === "date") {
    // Supposons que vous ayez une propriété 'date' dans vos objets mediaItem
    mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date
  } else if (sortBy === "title") {
    mediaArray.sort((a, b) => a.title.localeCompare(b.title)); // Trier par titre
  }

  displayPhotographerMedia(mediaArray); // Met à jour l'affichage après le tri
}

// Fonction pour gérer la sélection d'un élément
dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Mettre à jour le texte du bouton avec l'option sélectionnée
    dropdownToggle.innerHTML =
      item.textContent + ' <span class="arrow">&#9660;</span>';

    // Fermer le menu
    dropdownToggle.setAttribute("aria-expanded", false);

    // Ajouter une classe active à l'élément sélectionné
    dropdownItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // Trier les médias en fonction de l'option sélectionnée
    const sortByValue = item.getAttribute("data-value");

    clearMediaSection();
    sortMediaArray(sortByValue); // Appeler la fonction de tri
  });
});

// Fermer le dropdown si on clique en dehors
function closeDropdown(event) {
  if (
    !dropdownToggle.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownToggle.setAttribute("aria-expanded", false);
  }
}

// Fermer le dropdown si on clique en dehors
document.addEventListener("click", closeDropdown);
