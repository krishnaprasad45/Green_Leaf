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

const addToWishlist = async (productId, cartId) => {
   
    const response = await fetch(`/addToWishlist?productId=${productId}&cartId=${cartId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
 
    const data = await response.json();
    console.log(data.message)
    if (data.message === "Added to wishlist") {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Product added to wishlist",
            showConfirmButton: true,
            confirmButtonColor: "#79a206",
        });
 
        document.getElementById("row" + productId).innerHTML = "";
    } else {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Product is already in wishlist!",
            showConfirmButton: true,
            confirmButtonColor: "#79a206",
        });
    }
 };