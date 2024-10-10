async function getPhotographerById(id) {
  // Charger les données depuis le fichier JSON
  try {
    const response = await fetch("../data/photographers.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // Trouver le photographe correspondant à l'ID
    const photographer = data.photographers.find((photog) => photog.id == id);
    if (!photographer) {
      throw new Error("Photographer not found");
    }
    return photographer;
  } catch (error) {
    console.error("Error fetching photographer data:", error);
  }
}

async function getMediaByPhotographerId(id) {
  // Charger les données depuis le fichier JSON
  const response = await fetch("../data/photographers.json");
  const data = await response.json();

  // Trouver les œuvres correspondant au photographe
  const media = data.media.filter((item) => item.photographerId == id);
  return media;
}

function displayPhotographerData(photographer, media) {
  if (!photographer) return;

  // Création du header
  const photographerHeader = document.querySelector(".photograph-header");

  // Création div Photographer info
  const photographerInfo = document.createElement("div");
  photographerInfo.classList.add("photographer-info");
  photographerHeader.appendChild(photographerInfo);

  // Trouver le bouton "Contactez-moi" dans le HTML
  const contactButton = photographerHeader.querySelector(".contact_button");

  // Création des éléments à ajouter avant le bouton
  const h1 = document.createElement("h1");
  h1.textContent = photographer.name;

  const location = document.createElement("p");
  location.textContent = `${photographer.city}, ${photographer.country}`;
  location.classList.add("photographer-location");

  const tagline = document.createElement("p");
  tagline.textContent = photographer.tagline;
  tagline.classList.add("photographer-tagline");

  const price = document.createElement("p");
  price.textContent = `${photographer.price}€/jour`;
  price.classList.add("photographer-price");

  // Ajouter les éléments avant le bouton "Contactez-moi"
  photographerInfo.appendChild(h1, contactButton);
  photographerInfo.appendChild(location, contactButton);
  photographerInfo.appendChild(tagline, contactButton);
  photographerInfo.appendChild(price, contactButton);

  // Ajouter photographerInfo avant bouton "Contactez-moi"
  photographerHeader.insertBefore(photographerInfo, contactButton);

  // Ajouter la photo après le bouton "Contactez-moi"
  const img = document.createElement("img");
  img.setAttribute("src", `assets/photographers/${photographer.portrait}`);
  img.setAttribute("alt", photographer.name);

  photographerHeader.appendChild(img);

  // Création section pour les œuvres
  const photographerWorks = document.querySelector(".photographer-works");

  // Ajouter chaque œuvre dans la section
  media.forEach((item) => {
    const mediaElement = document.createElement("div");
    mediaElement.classList.add("media-item");

    const mediaImg = document.createElement("img");
    mediaImg.setAttribute("src", `assets/media/${item.image}`);
    mediaImg.setAttribute("alt", item.title);

    const mediaTitle = document.createElement("p");
    mediaTitle.textContent = item.title;

    const mediaLikes = document.createElement("p");
    mediaLikes.textContent = `${item.likes} Likes`;

    mediaElement.appendChild(mediaImg);
    mediaElement.appendChild(mediaTitle);
    mediaElement.appendChild(mediaLikes);

    photographerWorks.appendChild(mediaElement);
  });

  // Ajouter la section des œuvres après la photo du photographe
  // photographerHeader.appendChild(mediaSection);
}

// Extraire l'ID du photographe depuis l'URL
const params = new URLSearchParams(window.location.search);
const photographerId = params.get("id");

// Charger et afficher les données du photographe et ses œuvres
Promise.all([
  getPhotographerById(photographerId),
  getMediaByPhotographerId(photographerId),
]).then(([photographer, media]) => {
  displayPhotographerData(photographer, media);
});
