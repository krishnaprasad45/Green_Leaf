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