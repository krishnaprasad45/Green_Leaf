const moveToCart = async (productId) => {

    try {
        const response = await fetch(`/addToCartFromWishlist?productId=${productId}`, {
            method: "GET",
            headers: {
                "content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.message === "Moved to cart from wishlist") {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Product is moved to cart",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
            updateCartCount();
            document.getElementById("row" + productId).innerHTML = "";
        } else if (data.message === "Product is already in cart!!") {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Product is already in cart",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
        } else if (data.message === "Error Occured!") {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Something error happened",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
        }
    } catch (error) {
        console.log(error.message);
    }
};

function updateCartCount() {
    let initialcount = document.getElementById("cart_count");
    let count = parseInt(initialcount.innerText); // Convert text to integer
    count = count + 1; // Increment by 1
    initialcount.innerText = count; // Update the element with the new value
}