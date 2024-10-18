
var produits = [];

$.ajax({
  url: "https://fakestoreapi.com/products?limit=20",
  dataType: "json",
  async: false, //pour être certain que les données soient chargées au lancement du programme
  cache: false,

  success: function (data) {
    produits = data;
  },

  error: function (xhr) {
    console.log(xhr.status);
  },
});

let myCart = [];
let bagdeNbreItems = $("#numberItems")[0];
const cartView = $("#cart-items");
let globalTotalPrice = 0;
const mainOpacity = $(".main-opacity")[0];

var app = document.getElementById("type-writer");

var typewriter = new Typewriter(app, {
  loop: true,
  delay: 75,
});

typewriter
  .pauseFor(500)
  .typeString('<span style="font-weight:bold;">C\'est </span> <span style="color: red; font-weight: bold;">MarketEase</span>')
  .typeString(
    ',<span style="font-weight:bold;"> C\'est une application de vente en ligne:</span><br>'
  )
  .pauseFor(300)
  .typeString(
    '<span style="color: red; font-weight: bold;">Vêtements</span>'
  )
  .pauseFor(300)
  .deleteChars(9)
  .typeString('<span style="color: red; font-weight: bold;">Accessoires</span>')
  .pauseFor(300)
  .deleteChars(11)
  .typeString('<span style="color: red; font-weight: bold;">Equipements de sport</span>')
  .pauseFor(300)
  .deleteChars(20)
  .typeString('<span style="color: red; font-weight: bold;">Des Smartphones</span>')
  .pauseFor(300)
  .deleteChars(15)
  .typeString('<span style="color: red; font-weight: bold;">Des Tablettes</span>')
  .pauseFor(300)
  .deleteChars(13)
  .pauseFor(1000)
  .start();
  
/**********************************************************************************************************************************/
/****************************** construction et injection des cartes produit dans la vue principale ********************************/
produits.forEach((element) => {
  console.log(element);
  const card = document.createElement("div");
  const divCardImage = document.createElement("div");
  const cardImage = document.createElement("img");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h5");
  const cardTextDescription = document.createElement("p");
  const cardTextPrix = document.createElement("p");
  const cardButton = document.createElement("button");

  card.classList.add("card");
  card.classList.add("m-2");
  card.classList.add("text-center");
  card.style.width = "18rem";
  divCardImage.classList.add("h-100");
  divCardImage.classList.add("m-2");
  divCardImage.classList.add("d-flex");
  divCardImage.classList.add("align-items-center");
  cardImage.classList.add("card-img-top");
  cardImage.classList.add("w-100");
  cardBody.classList.add("card-body");
  cardTitle.classList.add("card-title");
  cardTextDescription.classList.add("card-text");
  cardTextPrix.classList.add("card-text");
  cardButton.classList.add("my-button-add");
  cardButton.classList.add("add-cart-button");

  cardImage.setAttribute("src", element.image);
  divCardImage.append(cardImage);
  cardTitle.append(document.createTextNode(element.title.toUpperCase()));
  cardTextDescription.append(document.createTextNode(element.description));
  cardTextPrix.append(document.createTextNode(`Prix : ${element.price}€`));
  cardButton.append(document.createTextNode("Ajouter au panier"));
  cardBody.append(cardTitle);
  cardBody.append(cardTextDescription);
  cardBody.append(cardTextPrix);
  cardBody.append(cardButton);
  card.append(divCardImage);
  card.append(cardBody);
  $(".container").append(card);
});
/***********************************************************************************************************/
/************************************************ gestion des événements ********************************* */

// Gestion du click sur le bouton "Voir le panier de la nav bar"
$("#nav-btn-cart").on("click", function () {
  // Avant d'afficher quoi que ce soit, on vide la vue
  mainOpacity.style.opacity = "0.6";
  cartView.empty();
  console.log(bagdeNbreItems.textContent);
  //Si le panier est vide
  if (bagdeNbreItems.textContent === "0") {
    designEmptyCartView();
  } 
  else {
    const synthesisCommand = document.createElement("div");
    const firstRowSynthesisCommand = document.createElement("div");
    const secondRowSynthesisCommand = document.createElement("div");
    const totalCommand = document.createElement("div");
    const validCommandButton = document.createElement("button");

    firstRowSynthesisCommand.classList.add("px-2");
    firstRowSynthesisCommand.append(
      document.createTextNode(
        "Voici la liste de vos produits (vous pouvez modifier la quantité de chaque produit, voir le supprimer)"
      )
    );
    secondRowSynthesisCommand.classList.add("p-2");
    secondRowSynthesisCommand.classList.add("d-flex");
    secondRowSynthesisCommand.classList.add("justify-content-around");
    totalCommand.classList.add("col-6", "fs-2", "w-50");
    totalCommand.setAttribute("id", "prixTotal");
    validCommandButton.classList.add("my-button-add");
    validCommandButton.setAttribute("onclick", "validationCommande()");
    validCommandButton.append(
      document.createTextNode("Valider votre commande")
    );

    secondRowSynthesisCommand.append(totalCommand);
    secondRowSynthesisCommand.append(validCommandButton);

    synthesisCommand.append(firstRowSynthesisCommand);
    synthesisCommand.append(secondRowSynthesisCommand);
    cartView.append(synthesisCommand);
    // sinon on affiche les produits
    myCart.forEach((element) => {
      const viewProductCard = document.createElement("div");
      const firstRowViewCard = document.createElement("div");
      const designation = document.createElement("div");
      const deleteProductButton = document.createElement("button");
      const secondRowViewCard = document.createElement("div");
      const quantityLabel = document.createElement("label");
      const quantityNumber = document.createElement("input");
      const thirdRowViewCard = document.createElement("div");

      viewProductCard.classList.add("card");
      firstRowViewCard.classList.add("row", "ps-3", "pt-3");
      designation.classList.add("col-8");
      deleteProductButton.classList.add(
        "col-3",
        "my-button-delete"
      );
      deleteProductButton.setAttribute("onclick", "deleteClick(this)");
      secondRowViewCard.classList.add(
        "row",
        "d-flex",
        "col-10",
        "ps-3",
        "py-2"
      );
      quantityLabel.classList.add("w-25");
      quantityLabel.setAttribute("for", "quantityNumber");
      quantityNumber.classList.add("w-25");
      quantityNumber.setAttribute("type", "number");
      quantityNumber.setAttribute("min", "1");
      quantityNumber.setAttribute("name", "quantityNumber");
      quantityNumber.setAttribute("onchange", "quantityChange(this)");
      quantityNumber.setAttribute("value", parseInt(element.get("quantity")));
      thirdRowViewCard.classList.add("row", "col-10", "m-0", "ps-3", "pb-3");

      designation.innerHTML = `Désignation : <b>${element.get("name")}</b>`;
      deleteProductButton.append(document.createTextNode("Supprimer"));
      firstRowViewCard.append(designation);
      firstRowViewCard.append(deleteProductButton);
      quantityLabel.append(document.createTextNode("Quantité : "));
      secondRowViewCard.append(quantityLabel);
      secondRowViewCard.append(quantityNumber);
      thirdRowViewCard.innerHTML = `Prix : <b class="w-25">${element.get(
        "price"
      )}€</b>`;

      viewProductCard.append(firstRowViewCard);
      viewProductCard.append(secondRowViewCard);
      viewProductCard.append(thirdRowViewCard);
      cartView.append(viewProductCard);
    });
    updateTotalPriceAndBadge();
  }
  $("#view-cart").css("left", "calc(100vw - 500px)");
});

// Gestion du click sur le cross button de la vue du panier
$("#view-cart-exit").on("click", function () {
  $("#view-cart").css("left", "100vw");
  mainOpacity.style.opacity = "1";
});

//Gestion du click sur le bouton "dans mon panier" sur les cartes produits
$(".add-cart-button").on("click", function () {
  const nameSelectedProduct =
    $(this)[0].offsetParent.children[1].children[0].textContent;
  const priceSelectedProduct =
    $(this)[0].offsetParent.children[1].children[2].textContent; //prix au format String
  let isInMyCart = false;

  bagdeNbreItems.textContent = "" + (parseInt(bagdeNbreItems.textContent) + 1);
  badgeIsVisible();

  // On teste pour savoir si le produit est déjà présent dans le panier
  // Si oui, on augmente la quantité de 1
  myCart.forEach((item) => {
    if (nameSelectedProduct.toUpperCase() === item.get("name")) {
      isInMyCart = true;
      item.set("quantity", parseInt(item.get("quantity") + 1));
    }
  });

  //S'il n'y a pas encore de produit ou si leproduit n'est pas présent dans
  //le panier, on l'ajoute à ce dernier
  if (myCart.length == 0 || !isInMyCart) {
    const product = new Map();
    product.set("name");
    product.set("name", nameSelectedProduct);
    product.set("price", parseInt(priceSelectedProduct.match(/\d{1,3}/)[0]));
    product.set("quantity", 1);

    myCart.push(product);
    isInMyCart = false;
  }
});

//Gestion du changement des quantités dans la vue du panier
function quantityChange(element) {
  const nameInputProduct =
    element.parentNode.parentNode.children[0].children[0].children[0]
      .textContent;
  const quantityInputProduct = element.value;

  myCart.forEach((product) => {
    if (product.get("name").toUpperCase() === nameInputProduct) {
      product.set("quantity", quantityInputProduct);
    }
    updateTotalPriceAndBadge();
  });
}

//Destion du bouton de supression article dans la vue panier
function deleteClick(element) {
  const nameDeletedProduct =
    element.parentNode.parentNode.children[0].children[0].children[0]
      .textContent;
  let indexDeletedProduct = 0;
  myCart.forEach((product, index) => {
    if (product.get("name").toUpperCase() === nameDeletedProduct) {
      indexDeletedProduct = index;
    }
  });
  delete myCart[indexDeletedProduct];
  element.parentNode.parentNode.remove();
  updateTotalPriceAndBadge();
  if (bagdeNbreItems.textContent === "0") {
    designEmptyCartView();
  }
}

function validationCommande() {
  $("#view-cart").css("left", "100vw");
  $("#formulaireEnvoi").css("left", "0px");
}

function updateTotalPriceAndBadge() {
  let totalPrice = 0;
  let totalQuantity = 0;
  myCart.forEach((element) => {
    totalPrice += parseInt(element.get("quantity")) * element.get("price");
    totalQuantity += parseInt(element.get("quantity"));
  });
  if (totalQuantity.toString() === "") {
    bagdeNbreItems.textContent = "0";
  } else {
    bagdeNbreItems.textContent = totalQuantity.toString();
  }
  badgeIsVisible();
  $("#prixTotal")[0].innerHTML = `<b>Total: ${totalPrice}€</b>`;
  globalTotalPrice = totalPrice;
}

function designEmptyCartView() {
  cartView.empty();
  const emptyCartImage = document.createElement("img");
  const emptyCartText = document.createElement("p");
  emptyCartImage.setAttribute("src", "../assets/empty-cart.png");
  emptyCartImage.style.width = "100%";
  emptyCartText.append(
    document.createTextNode("Votre panier est tristement vide")
  );
  emptyCartText.classList.add("fs-5", "ms-3");
  cartView.append(emptyCartImage);
  cartView.append(emptyCartText);
}

function badgeIsVisible() {
  // Gestion du bagde au dessus du bouton "Voir mon panier" de la nav bar
  if (bagdeNbreItems.textContent === "0") {
    bagdeNbreItems.style.visibility = "hidden";
  } else {
    bagdeNbreItems.style.visibility = "visible";
  }
}
