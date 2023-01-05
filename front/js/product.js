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

//-------------------------------------------------------------------------
//Gérer l'ajout de produit au panier
//-------------------------------------------------------------------------

let choixDeProduit = document.getElementById("addToCart");

choixDeProduit.addEventListener("click", function () {
  //on recupere l'ID, la valeur de la couleur choisie, la valeur de la quantite dans l'API
  let couleurChoisie = listOfColor.value;
  let quantiteChoisie = listeQuantite.valueAsNumber;
  let update = 0;
  if (!couleurChoisie || !quantiteChoisie) {
    alert("veuillez choisir une couleur et/ou une quantité supérieur à 0 !");
  } else if (quantiteChoisie < 0 || quantiteChoisie > 100) {
    alert("veuillez choisir une quantité valide");
  } else {
    //Analyse une chaîne de caractères JSON et construit la valeur JavaScript décrit par cette chaîne
    let panierEnCours = JSON.parse(localStorage.getItem("monPanier"));
    if (panierEnCours) {
      for (
        let compteurProduit = 0;
        compteurProduit < panierEnCours.length;
        compteurProduit++
      ) {
        //pas d'ajout de ligne dans le tableau, article déjà existant (quantité modifiée)
        if (panierEnCours[compteurProduit].productId == productId) {
          if (panierEnCours[compteurProduit].couleurChoisie == couleurChoisie) {
            panierEnCours[compteurProduit].quantiteChoisie += quantiteChoisie;
            update = 1;
          }
        }
      }
      //ajout dans le tableau de l'article avec les values choisies par le user
      if (update == 0) {
        panierEnCours.push({ productId, couleurChoisie, quantiteChoisie });
        console.log(
          "un produit différent a été ajouté au panier déjà existant"
        );
        console.log(panierEnCours);
      }
      // aucun article dans le panier, création d'un nouveau tableau
    } else {
      panierEnCours = [{ productId, couleurChoisie, quantiteChoisie }];
      console.log("un nouveau tableau a été crée");
      console.log(panierEnCours);
    }
    //enregistrer le panier
    //convertit la valeur JavaScript en chaîne JSON
    //pour etre envoyé dans la key "monPanier" du localStorage
    localStorage.setItem("monPanier", JSON.stringify(panierEnCours));
    alert("Produit ajouté au panier");
  }
});
