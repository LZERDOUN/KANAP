//-------------------------------------------------------------------------
//Récupérer informations API
//-------------------------------------------------------------------------
const getAllProducts = () =>
  fetch("http://localhost:3000/api/products/")
    .then(function (response) {
      return response.json();
    })
    .catch(function (erreur) {
      console.log(erreur);
      alert("Oops il semble y avoir un problème veuiller réessayer plus tard");
    });

//-------------------------------------------------------------------------
//Fonction pour filtrer les articles par ID
//-------------------------------------------------------------------------
const filterByID = (article, allProducts) => {
  for (let item of allProducts) {
    if (article.productId === item._id) {
      return item;
    }
  }
};

//-------------------------------------------------------------------------
//Fonction calculateCartTotal pour obtenir le prix total du panier
//-------------------------------------------------------------------------
function calculateCartTotal(CART_MAP) {
  const cartTotal = Object.keys(CART_MAP).map(
    (key) => CART_MAP[key].inputValue * CART_MAP[key].price
  );
  console.log(cartTotal);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const prixTotal = cartTotal.reduce(reducer, 0);
  console.log(prixTotal);
  return prixTotal;
}

//--------------------------------------------------------------------------------------
//Fonction calculateTotalArticle pour obtenir le nombre total d'article dans le panier
//--------------------------------------------------------------------------------------
function calculateTotalArticles(CART_MAP) {
  const cartTotalArticles = Object.keys(CART_MAP).map(
    (key) => CART_MAP[key].inputValue
  );
  console.log(cartTotalArticles);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const articleTotal = cartTotalArticles.reduce(reducer, 0);
  console.log(articleTotal);
  return articleTotal;
}

//--------------------------------------------------------------------------------------
//Affichage du panier et modifications possibles sur quantité ou suppression article
//--------------------------------------------------------------------------------------
async function getCartPage() {
  const CART_MAP = {};
  await readingCart(CART_MAP);
  console.log(CART_MAP);

  let cartItems = document.getElementsByClassName("cart__item");
  for (let i = 0; i < cartItems.length; i++) {
    const productID = document
      .getElementsByClassName("cart__item")
      [i].getAttribute("data-id");
    const color = document
      .getElementsByClassName("cart__item")
      [i].getAttribute("data-color");
    const productInput = document.getElementsByClassName("itemQuantity")[i];

    //Modification quantité + MAJ prix panier et nombre articles panier
    productInput.addEventListener("change", function (e) {
      let quantiteEnregistree = document.getElementsByClassName(
        "cart__item__content__settings__quantity"
      )[i];
      CART_MAP[productID + color].inputValue = productInput.valueAsNumber;
      CART_MAP[productID + color].quantiteChoisie = productInput.valueAsNumber;
      quantiteEnregistree.querySelector("p").innerHTML =
        "Qté : " + productInput.valueAsNumber;

      const prixTotal = calculateCartTotal(CART_MAP);
      let prixPanier = document.getElementById("totalPrice");
      prixPanier.textContent = `${prixTotal}`;

      const articleTotal = calculateTotalArticles(CART_MAP);
      let articlesPanier = document.getElementById("totalQuantity");
      articlesPanier.textContent = `${articleTotal}`;

      //MAJ LocalStorage
      let cartLocalStorage = JSON.parse(localStorage.getItem("monPanier"));
      const cartUpdated = cartLocalStorage.map(function (cartItem) {
        if (
          cartItem.productId === productID &&
          cartItem.couleurChoisie === color
        ) {
          return {
            ...cartItem,
            quantiteChoisie: productInput.value,
          };
        } else {
          return cartItem;
        }
      });

      updateLocalStorage(cartUpdated);

      if (productInput.value < 1 || productInput.value > 100) {
        alert("Veuillez choisir une quantité entre 1 et 100.");
        quantiteEnregistree.querySelector("p").innerHTML =
          "Erreur, merci de choisir une quantité valide";
        articlesPanier.textContent = "Erreur";
        prixPanier.textContent = "Erreur";
      }
    });

    const deleteProduct = document.getElementsByClassName("deleteItem")[i];
    deleteProduct.addEventListener("click", async function () {
      cartItems[i].remove();
      delete CART_MAP[productID + color];

      let cartLocalStorage = JSON.parse(localStorage.getItem("monPanier"));
      const cartUpdated = cartLocalStorage.filter(function (cartItem) {
        return !(
          cartItem.productId == productID && cartItem.couleurChoisie == color
        );
      });

      updateLocalStorage(cartUpdated);
      console.log(CART_MAP);
      delete CART_MAP[productID];

      const prixTotal = calculateCartTotal(CART_MAP);
      let prixPanier = document.getElementById("totalPrice");
      prixPanier.textContent = `${prixTotal}`;

      const articleTotal = calculateTotalArticles(CART_MAP);
      let articlesPanier = document.getElementById("totalQuantity");
      articlesPanier.textContent = `${articleTotal}`;
      await readingCart();
    });
  }
}

getCartPage();

//----------------------------------------------------------------------
//         PARTIE FORMULAIRE POUR VALIDATION DE LA COMMANDE
//----------------------------------------------------------------------

const formulaire = document.querySelector(".cart__order__form");

//Ecouter modification des champs du formulaire
formulaire.firstName.addEventListener("change", function () {
  validFirstName(this);
});
formulaire.lastName.addEventListener("change", function () {
  validLastName(this);
});
formulaire.address.addEventListener("change", function () {
  validAddress(this);
});
formulaire.city.addEventListener("change", function () {
  validCity(this);
});
formulaire.email.addEventListener("change", function () {
  validEmail(this);
});

//Ecouter la soumission du formulaire
formulaire.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    validFirstName(formulaire.firstName) &&
    validLastName(formulaire.lastName) &&
    validAddress(formulaire.address) &&
    validCity(formulaire.city) &&
    validEmail(formulaire.email)
  ) {
    console.log("Formulaire valide");
    const panierEnCours = JSON.parse(localStorage.getItem("monPanier"));

    const products = panierEnCours.map((item) => item.productId);
    console.log(products);

    const contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };
    console.log(JSON.stringify({ contact, products }));
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("then", response.body);
        return response.json();
      })
      .then(function (data) {
        console.log(data.orderId);
        RedirectionPageConfirmation(data.orderId);
      })
      .catch(function (err) {
        console.log("err", err);
      });
  } else {
    console.log("Formulaire non valide");
  }
});

//Création des expressions régulières pour la validation des champs du formulaire
let lettersOnlyRegExp = new RegExp("[A-Za-zÀ-ÖØ-öø-ÿ-]{2,25}");
let addressRegExp = new RegExp("[A-Za-zÀ-ÖØ-öø-ÿ0-9.,'-]{2,50}");
let emailRegExp = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
);

//************************** VALIDATION PRENOM **************************

const validFirstName = function (inputFirstName) {
  let messageErreurFirstName = document.getElementById("firstNameErrorMsg");
  //On teste le format du prénom saisi
  if (lettersOnlyRegExp.test(inputFirstName.value)) {
    messageErreurFirstName.innerText = "";
    return true;
  } else {
    messageErreurFirstName.innerText = "Prénom non-valide";
    return false;
  }
};

//************************** VALIDATION NOM **************************

const validLastName = function (inputLastName) {
  let messageErreurLastName = document.getElementById("lastNameErrorMsg");
  //On teste le format du nom saisi
  if (lettersOnlyRegExp.test(inputLastName.value)) {
    messageErreurLastName.innerText = "";
    return true;
  } else {
    messageErreurLastName.innerText = "Nom non-valide";
    return false;
  }
};

//************************** VALIDATION ADDRESSE **************************

const validAddress = function (inputAdress) {
  let messageErreurAddress = document.getElementById("addressErrorMsg");
  //On teste le format de l'adresse saisie
  if (addressRegExp.test(inputAdress.value)) {
    messageErreurAddress.innerText = "";
    return true;
  } else {
    messageErreurAddress.innerText =
      "Addresse non-valide, format attendu : N° __ Adresse __ (Exemple : 21 Rue Magenta)";
    return false;
  }
};

//************************** VALIDATION VILLE **************************

const validCity = function (inputCity) {
  let messageErreurCity = document.getElementById("cityErrorMsg");
  //On teste le format du nom saisi
  if (lettersOnlyRegExp.test(inputCity.value)) {
    messageErreurCity.innerText = "";
    return true;
  } else {
    messageErreurCity.innerText = "Ville non-valide";
    return false;
  }
};

//************************** VALIDATION EMAIL **************************

const validEmail = function (inputEmail) {
  let messageErreurEmail = document.getElementById("emailErrorMsg");
  //On teste le format de l'adresse email saisie
  if (emailRegExp.test(inputEmail.value)) {
    messageErreurEmail.innerText = "";
    return true;
  } else {
    messageErreurEmail.innerText =
      "Adresse email non-valide, merci de vérifier le format";
    return false;
  }
};

function RedirectionPageConfirmation(orderId) {
  document.location.href =
    "http://127.0.0.1:5500/front/html/confirmation.html?orderId=" + orderId;
  localStorage.clear();
}
