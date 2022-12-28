let itemsElement = document.querySelector("#items");

//---------------------------------------------------------------------------------
//AFFICHAGE PRODUITS - UTILISATION API FETCH POUR RECUPERER DONNEES
//---------------------------------------------------------------------------------

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    return res.json();
  })
  .then(function (products) {
    console.log(products);
    console.log(typeof products);
    for (let i = 0; i < products.length; i++) {
      itemsElement.insertAdjacentHTML(
        "afterbegin",
        `
          <a href='./product.html?id=${products[i]._id}'>
              <article>
                <img src=${products[i].imageUrl} alt=${products[i].altTxt}>
                <h3 class="productName">${products[i].name}</h3>                  
                <p class="productDescription">${products[i].description}</p>
              </article>
          </a>
        `
      );
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
  });
