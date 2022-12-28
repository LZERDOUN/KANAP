//---------------------------------------------------------------------------------
//Sélectionner des éléments de la page product.html et les placer dans une variable
//---------------------------------------------------------------------------------
let titlePage = document.getElementsByTagName("title");
let productImage = document.querySelector(".item__img");
let productTitle = document.querySelector("#title");
let productPrice = document.querySelector("#price");
let productDescription = document.getElementById("description");
let listOfColor = document.getElementById("colors");

//--------------------------------------------------------------------------
// Récupération de l'ID du produit via l' URL
//--------------------------------------------------------------------------
let productId = new URL(location.href).searchParams.get("id");

//--------------------------------------------------------------------------
//Requête envoyée au service web afin de recupérer les données de l'API
//--------------------------------------------------------------------------
fetch("http://localhost:3000/api/products/" + productId)
  .then(function (response) {
    return response.json();
  })
  .then(function (value) {
    displayProduct(value);
  })
  .catch(function (erreur) {
    console.log(erreur);
    alert("Oops il semble y avoir un problème veuiller réessayer plus tard");
  });

//-------------------------------------------------------------------------
//Fonction displayProduct : Affichage des données produits
//-------------------------------------------------------------------------

function displayProduct(product) {
  titlePage[0].innerHTML = product.name;
  productTitle.innerText = product.name;
  productImage.insertAdjacentHTML(
    "afterbegin",
    `<img src=${product.imageUrl} alt=${product.altTxt}>`
  );
  productPrice.innerText = product.price;
  productDescription.innerText = product.description;
  //affichage du choix des couleur du produit
  for (let myColor of product.colors) {
    let optionColor = document.createElement("option");
    optionColor.text = myColor;
    optionColor.value = myColor;
    listOfColor.appendChild(optionColor);
  }
}

//-------------------------------------------------------------------------
//Gérer l'ajout de quantité de produit
//-------------------------------------------------------------------------

let listeQuantite = document.getElementById("quantity");
let quantiteProduit;
listeQuantite.addEventListener("change", function (ajouteUnArticle) {
  quantiteProduit = ajouteUnArticle.target.value;
  productId.quantiteChoisie = quantiteProduit;
});
