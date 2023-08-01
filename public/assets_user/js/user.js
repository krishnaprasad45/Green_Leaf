const addToCart = async (productId) => {
    


    try {
    event.preventDefault();
        const addToCartButton = document.getElementById("addToCartBtn");
        let quantity = document.getElementById(productId).value;
        
        if(quantity === null){
            quantity = 1
        }
        
        

        const response = await fetch(`/addToCart?id=${productId}&quantity=${quantity}`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        let data = await response.json();



        if (data.message === "Item already in cart!!") {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Product is already in cart.\n So quantity increased",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
        } else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Product successfully added to cart",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        // You can add code here to handle the error, show an error message, or perform any other necessary actions.
    }
};






function calculateSubtotal() {
    let cartItems = document.querySelectorAll('tbody#cart-container tr');
    let subtotal = 0;
  
    cartItems.forEach((item) => {
      let productId = item.querySelector('[id^="product_id"]').value;
      let productPrice = parseFloat(item.querySelector(`#product-price-${productId}`).textContent.replace('/-', ''));
      let quantity = parseInt(item.querySelector(`#product-quantity-${productId} input`).value);
      let productTotalElement = item.querySelector(`#product_total-${productId}`);
  
      let productTotal = productPrice * quantity;
      subtotal += productTotal;
  
      productTotalElement.textContent = `${productTotal}/-`;
    });
  
    // Display the subtotal in all the places with the class "subtotal-placeholder"
    let subtotalElements = document.querySelectorAll('.subtotal-placeholder');
    subtotalElements.forEach((element) => {
      element.textContent = `${subtotal}/-`;
    });
  }
  





const addToWishlist = async (productId, cartId) => {
    const response = await fetch(`/addToWishlist?productId=${productId}&cartId=${cartId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (data.message === "Added to wishlist") {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Product added to wishlist",
            showConfirmButton: true,
            confirmButtonColor: "#00A300",
        });

        document.getElementById("row" + productId).innerHTML = "";
    } else {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Product is already in wishlist!",
            showConfirmButton: true,
            confirmButtonColor: "#00A300",
        });
    }
};

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
        confirmButtonColor: "#4CAF50",
      });
      document.getElementById("row" + productId).innerHTML = "";
    }
  };
  
  const removeCartalert = async (productId, cartId) => {
    const result = await Swal.fire({
      title: "Remove item from cart",
      text: "Do you want to remove this product from your cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Move to wishlist",
      cancelButtonText: "Yes, remove",
    });
  
    // Handle the user's response
    if (result.value) {
      addToWishlist(productId, cartId);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      removeFromCart(productId, cartId);
    }
  };
  


