function photographerTemplate(data) {
  const { name, portrait, tagline, city, country, price } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");

    // Création de l'image du photographe
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);

    // Création du nom du photographe
    const h2 = document.createElement("h2");
    h2.textContent = name;

    // Création de l'élément contenant la localisation
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.classList.add("photographer-location");

    // Création de l'élément contenant la tagline
    const taglineElement = document.createElement("p");
    taglineElement.textContent = tagline;
    taglineElement.classList.add("photographer-tagline");

    // Création de l'élément contenant le prix
    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;
    priceElement.classList.add("photographer-price");

    // Ajout des éléments au "article"
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(location);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);

    return article;
  }

  return { name, picture, getUserCardDOM };
}
