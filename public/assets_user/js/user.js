

//CART MANAGEMENT
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



  const totalPrice = async (id, act, stock) => {
    console.log(11);
    const elem = document.getElementById(id);
    console.log(`elem ${elem}`)
    if (act == "inc") elem.value ? (elem.value = Number(elem.value) + 1) : "";
    else if (act == "dec") elem.value > 1 ? (elem.value = Number(elem.value) - 1) : "";

    let subTotal = 0;
    let datas = [];
    let length = document.getElementsByName("productTotal").length;
    console.log(`length ${length}`)

    for (let i = 0; i < length; i++) {
        
        const quantity = parseFloat(document.getElementsByName("num-product")[i].value);
    console.log(`quantity ${quantity}`)
        
        const price = parseFloat(document.getElementsByName("productprice")[i].value);
        console.log(`price ${price}`)

        const productTotal = isNaN(quantity) || isNaN(price) ? 0 : quantity * price;
        console.log(`productTotal ${productTotal}`)

        document.getElementsByName("productTotal")[i].innerText = "₹ " + productTotal.toFixed();
        subTotal += productTotal;
        console.log(`subTotal ${subTotal}`)
        

        datas.push({
            id: document.getElementsByName("productId")[i].value,
            quantity: Number(document.getElementsByName("num-product")[i].value),
        });
    }
    // console.log(document.getElementById("subTotal")); 
    console.log(subTotal);
    document.getElementById("subTotal").innerText = "₹ " + subTotal.toFixed();
    console.log(33);
    let data = await fetch("/cartUpdation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            datas,
        }),
    });
};
  





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
  
  
//


////////////////ADDRESS MANAGEMENT////////////////

///////////Add Address///////////

const addAddressBtn = document.getElementById("addAddressBtn");
console.log(100)
const addAddressPanel = document.getElementById("addAddressPanel");

if (addAddressBtn) {
console.log(101)

    addAddressBtn.addEventListener("click", function () {
        addAddressPanel.style.display = "block";
        editAddressPanel.style.display = "none";
    });
}

const addAddress = document.getElementById("addAddress");

if (addAddress) {
    addAddress.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        if ($(form).valid()) {
            try {
                const response = await fetch("/addNewAddress", {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully added new address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    addAddressPanel.style.display = "none";
                    form.reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    });
}

const addAddressCheckout = document.getElementById("addAddressCheckout");
console.log(10)
console.log(addAddressCheckout)
if (addAddressCheckout) {
console.log(22)

    addAddressCheckout.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        console.log(`f-details ${form}`);
        const formData = new FormData(form);
       
        // if ($(form).valid()) {
            try {
                console.log("try")
                const response = await fetch("/addNewAddress", {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await Swal.fire({
                        icon: "success",
                        title: "Successfully added new address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    if (result.value) {
                        form.reset();
                        location.reload();
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        // }
    });
}

///////////Edit Address///////////

const editAddressBtns = document.querySelectorAll(".edit-address-btn");
const editAddressPanel = document.querySelector("#editAddressPanel");

const addressIdInput = document.getElementById("addressId");

const fullNameInput = document.querySelector(".full-name-input");
const mobileNumberInput = document.querySelector(".mobile-number-input");
const addressLineInput = document.querySelector(".address-line-input");
const emailInput = document.querySelector(".email-input");
const cityInput = document.querySelector(".city-input");
const stateInput = document.querySelector(".state-input");
const pincodeInput = document.querySelector(".pincode-input");

editAddressBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
        event.preventDefault();
        editAddressPanel.style.display = "block";
        addAddressPanel.style.display = "none";

        const addressId = btn.dataset.id;

        try {
            const response = await fetch(`/addressData?addressId=${addressId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json", // Adjust the content type based on your server's requirements
                    // Add any other headers if required
                },
            });

            if (response.ok) {
                const addressData = await response.json();

                // Populate the input fields with the received addressData

                addressIdInput.value = addressData._id;

                fullNameInput.value = addressData.name;
                mobileNumberInput.value = addressData.mobile;
                addressLineInput.value = addressData.addressLine;
                emailInput.value = addressData.email;
                cityInput.value = addressData.city;
                stateInput.value = addressData.state;
                pincodeInput.value = addressData.pincode;
            } else {
                console.log("Failed to fetch address data");
            }
        } catch (error) {
            console.log(error.message);
        }
    });
});

function scrollToForm() {
    // Delay for a certain duration (e.g., 500 milliseconds) before scrolling
    setTimeout(function () {
        // Calculate the offset of the target element
        const targetOffset = $("#editAddressPanel").offset().top;

        // Calculate the height of the window
        const windowHeight = $(window).height();

        // Calculate the final scroll position to scroll to the top of the target element
        const scrollPosition = targetOffset - windowHeight + $("#editAddressPanel").outerHeight();

        // Animate scrolling to the target element
        $("html, body").animate(
            {
                scrollTop: scrollPosition,
            },
            800
        ); // Adjust the animation speed as needed
    }, 300); // Adjust the delay duration as needed
}

function scrollToForm2() {
    // Delay for a certain duration (e.g., 500 milliseconds) before scrolling
    setTimeout(function () {
        // Calculate the offset of the target element
        const targetOffset = $("#addAddressPanel").offset().top;

        // Calculate the height of the window
        const windowHeight = $(window).height();

        // Calculate the final scroll position to scroll to the top of the target element
        const scrollPosition = targetOffset - windowHeight + $("#addAddressPanel").outerHeight();

        // Animate scrolling to the target element
        $("html, body").animate(
            {
                scrollTop: scrollPosition,
            },
            800
        ); // Adjust the animation speed as needed
    }, 300); // Adjust the delay duration as needed
}

const updateAddress = document.getElementById("updateAddress");

if (updateAddress) {
    updateAddress.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const addressId = document.getElementById("addressId").value;

        if ($(form).valid()) {
            try {
                const response = await fetch(`/updateAddress?addressId=${addressId}`, {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully Updated address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    editAddressPanel.style.display = "none";
                    form.reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    });
}

///////////Delete Address///////////

const deleteAddress = async (addressId) => {
    const result = await Swal.fire({
        title: "Delete Address",
        text: "Do you want to delete this address? \nThis cannot be undo!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes,Delete",
        cancelButtonText: "DISMISS",
    });

    if (result.value) {
        try {
            const response = await fetch(`/deleteAddress?addressId=${addressId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Address has been deleted successfully",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#4CAF50",
                });
                document.getElementById("addressCard" + addressId).innerHTML = "";
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Somthing error!!",
                    showConfirmButton: true,
                    confirmButtonText: "DISMISS",
                    confirmButtonColor: "#D22B2B",
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    }
};

///////////////////////////////// User Profile Management ///////////////////

const updateProfile = document.getElementById("updateProfile");

if (updateProfile) {
    updateProfile.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const addressId = document.getElementById("addressId").value;

        if ($(form).valid()) {
            try {
                const response = await fetch(`/updateAddress?addressId=${addressId}`, {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully Updated address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    editAddressPanel.style.display = "none";
                    form.reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    });
}

