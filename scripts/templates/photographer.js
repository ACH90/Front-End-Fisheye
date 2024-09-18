function photographerTemplate(data) {
  const { name, portrait, tagline, city, country, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    article.classList.add("photographer-card");

    // Création d'un lien focussable pour l'image et le nom
    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`);
    link.setAttribute("aria-label", `Voir la page de ${name}`);
    link.classList.add("focusable-link");

    // Création de l'image du photographe
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);

    // Création du nom du photographe
    const h2 = document.createElement("h2");
    h2.textContent = name;

    // Ajout de l'image et du nom dans le lien
    link.appendChild(img);
    link.appendChild(h2);

    // Ajout des autres éléments (location, tagline, price)
    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.classList.add("photographer-location");

    const taglineElement = document.createElement("p");
    taglineElement.textContent = tagline;
    taglineElement.classList.add("photographer-tagline");

    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;
    priceElement.classList.add("photographer-price");

    // Ajout du lien et des autres informations à l'article
    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);

    return article;
  }

  return { name, picture, getUserCardDOM };
}
