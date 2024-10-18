const champs = document.querySelectorAll(".champ");
const button = document.querySelector("#connexion");
let nbreChampsError = 0;
let checkElementIsEmpty = new Map();
checkElementIsEmpty.set("firstName", false);
checkElementIsEmpty.set("lastName", false);
checkElementIsEmpty.set("email", false);
checkElementIsEmpty.set("tel", false);
let infoId = "";
let myMessage = "";
let myRegex = "";

const getMessageRegex = (idElement) => {
  let regex = new RegExp();
  let message = "";
  switch (idElement) {
    case "firstName":
      regex = /^[\wéèà]{4,15}$/;
      message = "Le prénom doit contenir entre 4 et 15 caractères";
      break;
    case "lastName":
      regex = /^[\wéèà]{5,15}$/;
      message = "Le nom doit contenir entre 5 et 15 caractères";
      break;
    case "email":
      regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
      message = "L'email ne respecte pas le format monAdresse@monDomain.fr";
      break;
    case "tel":
      regex = /^\d{10}$/;
      message = "Le numéro doit contenir 10 chiffres";
      break;
    case "message":
      regex = /\d{1,3}[\w\séèà]+\d{5}[\w\s\-éèà]+/;
      message = "L'adresse doit être de la forme : 2 rue Luois 75014 Paris";
  }
  return [regex, message];
};

const checkAllEmpty = () => {
  let test = true;
  checkElementIsEmpty.forEach((value, key) => {
    if (value == false) {
      test = false;
    }
  });
  return test;
};

Object.values(champs).forEach((element) => {
  element.addEventListener("focusin", () => {
    infoId = element.id + "Info";
    myMessage = getMessageRegex(element.id)[1];
    element.classList.add("badInput");
    document.getElementById(infoId).innerHTML = myMessage;
    document.getElementById(infoId).classList.add("show");
    document.getElementById(infoId).classList.remove("goodInput");
  });

  element.addEventListener("focusout", () => {
    infoId = element.id + "Info";
    element.classList.remove("badInput");
    document.getElementById(infoId).classList.remove("show");
  });

  element.addEventListener("keyup", () => {
    infoId = element.id + "Info";
    let infoBulle = document.getElementById(infoId);
    [myRegex, myMessage] = getMessageRegex(element.id);

    if (myRegex.test(element.value)) {
      element.classList.add("goodInput");
      document.getElementById(infoId).classList.remove("show");
      checkElementIsEmpty.set(element.id, true);
    } else {
      element.classList.add("badInput");
      element.classList.remove("goodInput");
      document.getElementById(infoId).classList.add("show");
      checkElementIsEmpty.set(element.id, false);
    }

    if (checkAllEmpty() == true) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "");
    }
  });
});

$("#view-command-exit").on("click", () => {
  mainOpacity.style.opacity = "1";
  $("#formulaireEnvoi").css("left", "-400px");
});

$("#connexion").on("click", (event) => {
  // On coupe le comportement par défaut
  event.preventDefault();

  const divContenu = $("#view-contenu");
  divContenu.empty();

  const infosPersosFormulaire = $("#form-info-perso-command")[0];

  const divInfosPersosLabel = document.createElement("div");
  const infosPersosLabel = document.createTextNode("Vos informations");
  const divFirstRow = document.createElement("div");

  divInfosPersosLabel.classList.add(
    "fs-4",
    "font-weight-bold",
    "ms-3",
    "border-top",
    "pt-3",
    "col-11"
  );
  divFirstRow.classList.add(
    "col-12",
    "d-flex",
    "flex-wrap",
    "justify-content-around"
  );

  divInfosPersosLabel.append(infosPersosLabel);
  divContenu.append(divInfosPersosLabel);
  for (let i = 0; i < 5; i++) {
    const divInfoPerso = document.createElement("div");
    divInfoPerso.classList.add("m-1");
    if (i < 4) {
      divInfoPerso.classList.add("col-5");
    } else {
      divInfoPerso.classList.add("col-12", "ms-5");
    }

    divInfoPerso.innerHTML = `${infosPersosFormulaire.children[
      i
    ].children[0].textContent.slice(0, -1)}: <b>${
      infosPersosFormulaire.children[i].children[1].value
    }</b>`;

    divFirstRow.append(divInfoPerso);
    divContenu.append(divFirstRow);
  }

  const divPanierLabel = document.createElement("div");
  const panierLabel = document.createTextNode("Votre panier");

  divPanierLabel.classList.add(
    "fs-4",
    "font-weight-bold",
    "ms-3",
    "pt-3",
    "col-11"
  );

  divPanierLabel.append(panierLabel);
  divContenu.append(divPanierLabel);

  const divRowProducts = document.createElement("div");

  divRowProducts.classList.add("d-flex", "flex-column");

  myCart.forEach((product) => {
    const divRowProduct = document.createElement("div");
    const divTitleProduct = document.createElement("div");
    const titleProduct = document.createElement("p");
    const infoProduct = document.createElement("div");
    const priceProduct = document.createElement("p");
    const quantityProduct = document.createElement("p");

    divRowProduct.classList.add("col-11", "m-3", "border-bottom");
    divTitleProduct.classList.add("col-11");
    titleProduct.classList.add("font-weight-bold", "text-capitalize"); // ne marche pas !!!!!
    infoProduct.classList.add("col-11", "d-flex", "justify-content-between");

    titleProduct.textContent = product.get("name");
    priceProduct.innerHTML = `Prix unitaire : <b>${product.get("price")}€</b>`;
    quantityProduct.innerHTML = `Quantité : <b>${product.get("quantity")}</b>`;

    divTitleProduct.append(titleProduct);
    divRowProduct.append(divTitleProduct);
    divRowProduct.append(infoProduct);
    infoProduct.append(priceProduct);
    infoProduct.append(quantityProduct);
    divContenu.append(divRowProduct);
  });

  /***Affichage coût total de la commande */
  const divTotalPrice = document.createElement("div");
  const totalPriceText = document.createTextNode(
    `Total à payer : ${globalTotalPrice}€`
  );

  divTotalPrice.classList.add("alert", "alert-danger", "col-11", "m-3");
  divTotalPrice.append(totalPriceText);

  divContenu.append(divTotalPrice);

  /****Affichage bouton */
  const divButtons = document.createElement("div");
  const finaliserButton = document.createElement("button");

  divButtons.classList.add(
    "col-11",
    "d-flex",
    "justify-content-end",
    "border-top",
    "p-3",
    "m-3"
  );

  finaliserButton.classList.add("btn", "btn-primary", "m-2");
  finaliserButton.setAttribute("onclick", "sendCommand()");

  finaliserButton.textContent = "Finaliser la commande et payer";

  divButtons.append(finaliserButton);

  divContenu.append(divButtons);

  $("#view-confirm-infos-persos-et-panier").show(1000);
  $("#formulaireEnvoi").css("left", "-400px");
});

$("#view-infos-persos-et-cart-exit").on("click", function () {
  mainOpacity.style.opacity = "1";
  $("#view-confirm-infos-persos-et-panier").hide(1000);
});

function sendCommand() {
  document.location.href = "./redirect.html";
}
