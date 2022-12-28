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
