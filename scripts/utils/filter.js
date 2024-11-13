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
  const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
  dropdownToggle.setAttribute("aria-expanded", !expanded);

  // Basculer le tabindex en fonction de l'état d'expansion
  dropdownItems.forEach((item) => {
    item.setAttribute("tabindex", expanded ? "-1" : "0"); // -1 pour les masquer, 0 pour les rendre tabulables
  });
});

// Fonction pour trier le tableau mediaArray
function sortMediaArray(sortBy) {
  if (sortBy === "popularity") {
    // eslint-disable-next-line no-undef
    mediaArray.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "date") {
    // eslint-disable-next-line no-undef
    mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "title") {
    // eslint-disable-next-line no-undef
    mediaArray.sort((a, b) => a.title.localeCompare(b.title));
  }

  // eslint-disable-next-line no-undef
  displayPhotographerMedia(mediaArray);
}

// Fonction pour gérer la sélection d'un élément
dropdownItems.forEach((item) => {
  item.addEventListener("click", () => handleSelection(item));

  // Gestion de la sélection avec la touche Enter
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSelection(item);
    }
  });
});

// Fonction pour mettre à jour la sélection
function handleSelection(item) {
  // Mettre à jour le texte du bouton avec l'option sélectionnée
  dropdownToggle.innerHTML = `${item.textContent} <span class="arrow">&#9660;</span>`;
  dropdownToggle.setAttribute("aria-expanded", false);

  // Mettre à jour aria-selected et aria-activedescendant
  dropdownItems.forEach((i) => i.setAttribute("aria-selected", "false"));
  item.setAttribute("aria-selected", "true");
  dropdownToggle.setAttribute("aria-activedescendant", item.id);

  // Appliquer une classe active pour marquer l'élément sélectionné
  dropdownItems.forEach((i) => i.classList.remove("active"));
  item.classList.add("active");

  // Trier les médias en fonction de l'option sélectionnée
  const sortByValue = item.getAttribute("data-value");
  clearMediaSection();
  sortMediaArray(sortByValue);
}

// Fermer le dropdown si on clique en dehors
function closeDropdown(event) {
  if (
    !dropdownToggle.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownToggle.setAttribute("aria-expanded", false);
    // Retirer le tabindex pour cacher les éléments du menu au focus
    dropdownItems.forEach((item) => item.setAttribute("tabindex", "-1"));
  }
}

// Fermer le dropdown si on clique en dehors
document.addEventListener("click", closeDropdown);
