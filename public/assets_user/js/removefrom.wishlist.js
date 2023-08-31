const removeFromWishlist = async (productId) => {
    const result = await Swal.fire({
        title: "Remove item from wishlist",
        text: "Do you want to remove this\nproduct from your wishlist?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#79a206",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove",
    });

    if (result.value) {
        const response = await fetch(`/removeWishlist?productId=${productId}`, {
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
        } else {
            Swal.fire({
                icon: "warning",
                title: "Somthing error!!",
                showConfirmButton: true,
                confirmButtonText: "DISMISS",
                confirmButtonColor: "#D22B2B",
            });
        }
    }
};