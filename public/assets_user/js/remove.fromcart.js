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
    }
};