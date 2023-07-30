const addToCart = async (productId) => {
    console.log(111);
    console.log(productId);


    try {
    console.log("try");

        const addToCartButton = document.getElementById("addToCartBtn");
        // const productName = document.getElementsByName("productName")[0].value;
        const quantity = document.getElementById(productId).value;
        console.log(`quantity: ${quantity}`);

        // const response = await fetch(`/addToCart?id=${productId}&quantity=${quantity}`, {
        const response = await fetch(`/addToCart?id=${productId}`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("before response line")
        
        let data = await response.json();
        console.log("after response line")

        console.log(data.message)
        console.log(data)


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
