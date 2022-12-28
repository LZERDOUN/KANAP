//--------------------------------------------------------------------------
// Récupération de l'Order ID via l' URL
//--------------------------------------------------------------------------
let orderId = new URL(location.href).searchParams.get("orderId");

//--------------------------------------------------------------------------
// Afficher l'order ID sur la page Confirmation
//--------------------------------------------------------------------------
document.getElementById("orderId").innerText = orderId;
