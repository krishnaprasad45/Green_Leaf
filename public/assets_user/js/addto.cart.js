const addToCart = async (productId) => {
    try {
        event.preventDefault();
        const addToCartButton = document.getElementById("addToCartBtn");
        let quantity = document.getElementById(productId).value;

        if (quantity === null) {
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
                confirmButtonColor: "#79a206",
            });
        } else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Product successfully added to cart",
                showConfirmButton: true,
                confirmButtonColor: "#79a206",
            });
            updateCartCount();
        }
    } catch (error) {
        console.log("An error occurred:", error);
        // You can add code here to handle the error, show an error message, or perform any other necessary actions.
    }
};

function updateCartCount() {

    let initialcount = document.getElementById("cart_count");
    if(initialcount !== null){
    let countText = initialcount.innerText;
    let count = countText !== null ? parseInt(countText) : 0;

    count = count + 1; // Increment by 1
    initialcount.innerText = count; // Update the element with the new value
    }else{
    initialcount.innerText = 0;

    }
}
