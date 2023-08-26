const removeFromCart = async (productId, cartId) => {
    const response = await fetch(`/removeCart?productId=${productId}&cartId=${cartId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        Swal.fire({
            icon: "success",
            title: "Product has been removed successfully",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#79a206",
        });
        document.getElementById("row" + productId).innerHTML = "";
        updateTotalAmount();
        updateCartCount();

    }
};

function updateTotalAmount() {
    let subTotal = 0;
  
    const quantityElements = document.getElementsByName("num-product");
    const priceElements = document.getElementsByName("productprice");
  
    for (let i = 0; i < quantityElements.length; i++) {
      const quantity = parseFloat(quantityElements[i].value);
      const price = parseFloat(priceElements[i].value);
      const productTotal = isNaN(quantity) || isNaN(price) ? 0 : quantity * price;
      subTotal += productTotal;
    }
  
    const subTotalElements = document.querySelectorAll("#subTotal");
    subTotalElements.forEach((element) => {
      element.innerText = "₹ " + subTotal.toFixed(2);
    });
  }
  function updateCartCount() {
    let initialcount = document.getElementById("cart_count");
    let count = parseInt(initialcount.innerText); // Convert text to integer
    count = count - 1; // Increment by 1
    initialcount.innerText = count; // Update the element with the new value
}