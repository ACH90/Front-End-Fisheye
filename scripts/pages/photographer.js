let mediaArray = []; // Déclare mediaArray globalement

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

  //Selection de l'element header
  const header = document.querySelector(".modal header");

  //Creation div photographer-name dans la div modal juste après le header
  const photographerNameDiv = document.createElement("div");
  photographerNameDiv.classList.add("photographer-name");

  // Insérer la nouvelle div après le header
  header.insertAdjacentElement("afterend", photographerNameDiv);

  // Ajouter du contenu à la div
  photographerNameDiv.innerHTML = `<h2>${photographer.name}</h2>`;

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
}

// Creer une fonction pour extraire le type de media
function getMediaType(mediaItem) {
  if (mediaItem.image && mediaItem.image.endsWith(".jpg")) {
    return "image";
  } else if (mediaItem.video && mediaItem.video.endsWith(".mp4")) {
    return "video";
  }
  return null;
}

function mediaFactory(mediaItem) {
  // Creer l'element media-item
  const mediaElement = document.createElement("div");
  mediaElement.classList.add("media-item");

  // Creer l'element media-piece dans le media-item
  const mediaPiece = document.createElement("div");
  mediaPiece.classList.add("media-piece");
  mediaElement.appendChild(mediaPiece);

  let mediaContent;

  // Utiliser la fonction getMediaType pour vérifier le type
  const mediaType = getMediaType(mediaItem);

  // Utiliser un sous-dossier spécifique au photographe (par exemple, basé sur l'ID)
  const mediaFolder = `${mediaItem.photographerId}`; // Le dossier de chaque photographe

  if (mediaType === "image") {
    mediaContent = document.createElement("img");
    mediaContent.setAttribute(
      "src",
      `assets/media/${mediaFolder}/${mediaItem.image}`
    );
    mediaContent.setAttribute("alt", mediaItem.title);
  } else if (mediaType === "video") {
    mediaContent = document.createElement("video");
    mediaContent.setAttribute("controls", true);
    const source = document.createElement("source");
    source.setAttribute(
      "src",
      `assets/media/${mediaFolder}/${mediaItem.video}`
    );
    source.setAttribute("type", "video/mp4");
    mediaContent.appendChild(source);
  }

  // Ajouter le mediaContent à la mediaElement
  mediaPiece.appendChild(mediaContent);

  // Creer l'élément media-info dans le media-item après la video ou l'image
  const mediaInfo = document.createElement("div");
  mediaInfo.classList.add("media-info");
  mediaElement.appendChild(mediaInfo);

  const mediaTitle = document.createElement("p");
  mediaTitle.textContent = mediaItem.title;

  // Créer la section des likes avec l'icône de cœur
  const mediaLikes = document.createElement("p");

  // Ajouter le nombre de likes
  const likesCount = document.createElement("span");
  likesCount.textContent = mediaItem.likes + " ";

  // Créer l'icône de cœur
  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-regular", "fa-heart");

  // Ajouter un gestionnaire d'événements pour liker
  heartIcon.addEventListener("click", function (event) {
    // Empêcher la propagation du clic à l'élément parent (qui ouvre la lightbox)
    event.stopPropagation();

    if (heartIcon.classList.contains("fa-regular")) {
      // Passer de fa-regular à fa-solid
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");

      // Incrémenter le compteur de likes
      mediaItem.likes += 1;
      likesCount.textContent = mediaItem.likes + " ";
    } else {
      // Passer de fa-solid à fa-regular (annuler le like)
      heartIcon.classList.remove("fa-solid");
      heartIcon.classList.add("fa-regular");

      // Décrémenter le compteur de likes
      mediaItem.likes -= 1;
      likesCount.textContent = mediaItem.likes + " ";
    }
  });

  // Ajouter le nombre de likes et l'icône de cœur dans la section des likes
  mediaLikes.appendChild(likesCount);
  mediaLikes.appendChild(heartIcon);

  mediaInfo.appendChild(mediaTitle);
  mediaInfo.appendChild(mediaLikes);

  return mediaElement;
}

function displayPhotographerMedia(media) {
  // Initialiser mediaArray avec les œuvres du photographe
  mediaArray = media;

  // Créer une section pour les œuvres du photographe
  const mediaSection = document.querySelector(".photographer-works");

  // Pour chaque œuvre, utiliser la factory pour créer et ajouter les éléments
  media.forEach((item, index) => {
    const mediaElement = mediaFactory(item);

    // Ajouter un événement de clic pour ouvrir la modale avec le carrousel
    mediaElement.addEventListener("click", (event) => {
      // Empêcher l'action par défaut (lecture de la vidéo)
      event.preventDefault();

      openModal(index, media); // Ouvrir la modale et passer l'index du média cliqué
    });

    mediaSection.appendChild(mediaElement);
  });

  // Ajouter la section des œuvres au DOM (dans le main ou ailleurs)
  const main = document.querySelector("#main");
  main.appendChild(mediaSection);
}

// Extraire l'ID du photographe depuis l'URL
const params = new URLSearchParams(window.location.search);
const photographerId = params.get("id");

// Charger et afficher les données du photographe et ses œuvres
Promise.all([
  getPhotographerById(photographerId),
  getMediaByPhotographerId(photographerId),
]).then(([photographer, media]) => {
  displayPhotographerData(photographer); // Affiche les infos du photographe
  displayPhotographerMedia(media); // Affiche les œuvres du photographe
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

  return { firstName, lastName, email, message };
}

//-------------------------------------------------------------

function openModal(index, mediaArray) {
  // Initialiser currentSlideIndex avec l'index du média cliqué
  currentSlideIndex = index;

  // Sélectionner l'élément de la modale et l'afficher
  const modal = document.querySelector(".modal-carousel");
  modal.style.display = "flex";

  // Afficher le média correspondant à l'index
  showSlide(index, mediaArray);
}

function showSlide(index, mediaArray) {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = ""; // Vider le contenu précédent

  const mediaItem = mediaArray[index];
  const mediaType = getMediaType(mediaItem);
  const mediaFolder = `${mediaItem.photographerId}`;

  let mediaContent;
  if (mediaType === "image") {
    mediaContent = document.createElement("img");
    mediaContent.setAttribute(
      "src",
      `assets/media/${mediaFolder}/${mediaItem.image}`
    );
    mediaContent.setAttribute("alt", mediaItem.title);
  } else if (mediaType === "video") {
    mediaContent = document.createElement("video");
    mediaContent.setAttribute("controls", true);
    const source = document.createElement("source");
    source.setAttribute(
      "src",
      `assets/media/${mediaFolder}/${mediaItem.video}`
    );
    source.setAttribute("type", "video/mp4");
    mediaContent.appendChild(source);

    // Démarrer la vidéo automatiquement dans la modale
    mediaContent.play();
  }

  modalContent.appendChild(mediaContent);
}

let currentSlideIndex = 0;

function changeSlide(n) {
  currentSlideIndex += n;

  // Vérifie si l'index est en dehors des limites
  if (currentSlideIndex < 0) {
    currentSlideIndex = mediaArray.length - 1; // Va à la dernière image
  } else if (currentSlideIndex >= mediaArray.length) {
    currentSlideIndex = 0; // Revient à la première image
  }

  showSlide(currentSlideIndex, mediaArray); // Affiche le slide courant
}

function closeModalCarousel() {
  const modal = document.querySelector(".modal-carousel");

  // Trouver la vidéo dans la modale
  const video = modal.querySelector("video");

  // Si une vidéo est présente, la mettre en pause et réinitialiser son temps de lecture
  if (video) {
    video.pause(); // Met en pause la vidéo
    video.currentTime = 0; // Remet la vidéo à 0
  }

  // Fermer la modale
  modal.style.display = "none";

  currentSlideIndex = 0;
}
