/////////// Order Management ///////////

const placeOrder = async()=>{
    try {

        const selectedPayment = document.querySelector(".payment-radio:checked").value;
        
        if(selectedPayment === "Cash On Delivery"){
            cashOnDelivery(selectedPayment)
        }
        else if(selectedPayment === "Razorpay"){
            razorpay(selectedPayment)
        }
      

        
    } catch (error) {
        console.log(error.message);
    }
}
/////////// Address selection ///////////

const addressRadios = document.querySelectorAll('input[name="selectedAddress"]');
const paymentRadios = document.querySelectorAll(".payment-radio");
const placeOrderBtn = document.getElementById("place-order-btn");


addressRadios.forEach((radio) => {
    radio.addEventListener("change", handleAddressSelection);
});

paymentRadios.forEach((radio) => {
    radio.addEventListener("change", handleAddressSelection);
});



function handleAddressSelection() {
    
    const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked');
    const selectedPayment = document.querySelector(".payment-radio:checked");
    

    if (selectedAddress && selectedPayment) {
        placeOrderBtn.disabled = false;
    } else {
        placeOrderBtn.disabled = true;
    }

}


const cashOnDelivery = async(selectedPayment, updatedBalance)=>{
    try {

        const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked').value;
        const subTotal = Number(document.getElementById('subTotalValue').value)
        
        const response = await fetch('/placeOrder',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                selectedAddress: selectedAddress,
                selectedPayment: selectedPayment,
                amount: subTotal,
                walletBalance: updatedBalance,
                couponData: couponData,
                
              })
        })

        

        const orderConfirmData = await response.json()

        if(orderConfirmData.order ===  "Success"){

            window.location.href = '/orderSuccess'
            

        }       
        
    } catch (error) {
        console.log(error.message);
    }
}


///  RAZOR PAY ///
const razorpay = async (selectedPayment)=>{
    try {

        const subTotal = Number(document.getElementById('subTotalValue').value)

        var options = {
            "key": "rzp_test_22xYD9iPqzsIzH", // Enter the Key ID generated from the Dashboard
            "amount": subTotal * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Green Leaf",
            "description": "Order payment",
            "image": "/images/demos/demo-8/logo.png",
            "order_id": undefined, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                cashOnDelivery(selectedPayment)
               
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        
        rzp1.open();
        
    } catch (error) {
        console.log(error.message);
    }
}

// Wallet

const wallet = async(selectedPayment)=>{
    try {
       
        const balance = document.getElementById('userWallet').value
        const subTotal = Number(document.getElementById('subTotalValue').value)
        const insufficientBalanceAlert = document.getElementById('insufficientBalanceAlert');


        if(balance > subTotal){
            const updatedBalance = balance - subTotal
            cashOnDelivery(selectedPayment, updatedBalance )
        }else{
            insufficientBalanceAlert.classList.remove('d-none');
            insufficientBalanceAlert.classList.add('d-flex');
        }

        
    } catch (error) {
        console.log(error.message);
    }
}

window.addEventListener("load", function () {
    const insufficientBalanceAlert = document.getElementById("insufficientBalanceAlert");
    if (insufficientBalanceAlert) {
        insufficientBalanceAlert.classList.remove("d-flex");
        insufficientBalanceAlert.classList.add("d-none");
    }
});

const closeButton = document.querySelector(".btn-close");
if(closeButton){
    closeButton.addEventListener("click", function () {
        const insufficientBalanceAlert = document.getElementById("insufficientBalanceAlert");
        insufficientBalanceAlert.classList.remove("d-flex");
        insufficientBalanceAlert.classList.add("d-none");
    });
}



/////////// Coupon Management ///////////

let coupon
let couponData
let couponDeleteSubtotal = null;

let subtotalElement = document.getElementById("subTotalValue");

if (subtotalElement) {
    couponDeleteSubtotal = Number(subtotalElement.value);
}

const inputField = document.getElementById("checkout-discount-input");

if (inputField) {
    inputField.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });
}

function selectCoupon(code) {
    const inputField = document.getElementById("checkout-discount-input");
    inputField.value = code;
    inputField.style.backgroundColor = code ? "white" : "";
    // You can also perform additional actions with the discount value if needed
}

// COUPON VALIDATION STARTS
const validateCoupon = async () => {
   
    coupon = document.getElementById("checkout-discount-input").value;
   

    const subTotal = Number(document.getElementById("subTotalValue").value);


 

    const response = await fetch("/validateCoupon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            coupon: coupon,
            subTotal: subTotal,
        }),
    });

    couponData = await response.json();



    const couponModel = document.getElementById("couponModel");
    const couponDiscount = document.getElementById("couponDiscount");
    const couponMessage = document.getElementById("couponMessage")
  

    const subTotalElement = document.getElementById("subTotal");
    const subTotalText = document.getElementById("subTotalText");


    if (couponData === "invalid") {
        Swal.fire({
            icon: "error",
            title: "INVALID COUPON CODE",
            showConfirmButton: true,
            confirmButtonText: "DISMISS",
            confirmButtonColor: "#4CAF50",
        });
    } else if (couponData === "expired") {
        Swal.fire({
            icon: "warning",
            title: "COUPON IS EXPIRED",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    } else if (couponData === "already used") {
        Swal.fire({
            icon: "warning",
            title: "ALREADY USED",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    } else if (couponData === "minimum value not met") {
        Swal.fire({
            icon: "warning",
            title: "COUPON CAN'T BE APPLIED",
            text: "We're sorry, the minimum order value to apply the coupon has not been met.",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    } else {
        if(couponData.maximum === "maximum" ) {
            Swal.fire({
                icon: "success",
                title: `"${coupon}" APPLIED SUCCESSFULLY!!`,
                html:`<strong>Maximum discount </strong>for this coupon is <strong style="color: green;" >₹ ${couponData.discountAmount}</strong>, and you have reached the maximum discount limit!`,
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            });
        }else{
            Swal.fire({
                icon: "success",
                title: `"${coupon}" APPLIED SUCCESSFULLY!!`,
                html: `You have received a discount of <strong style="color: green;" >₹ ${couponData.discountAmount}</strong>.<br>Enjoy your savings!`,
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            });
        }

         if (couponMessage) {
    // The element with ID "couponMessage" is found in the DOM
    if (couponData.maximum === "maximum") {
      couponMessage.innerHTML = "Maximum Coupon Discount:";
    }
  }
        // couponModel.style.display = "table-row";
        couponDiscount.innerHTML = `₹ ${couponData.discountAmount}`;

        subTotalElement.innerHTML = `₹ ${couponData.newTotal}`;
        subTotalText.innerHTML = "Total After Coupon Discount:";
       
        document.getElementById('subTotalValue').value = couponData.newTotal
        document.getElementById('subTotal').value = couponData.newTotal

        $('#couponIcon').removeClass('icon-long-arrow-right').addClass('fa-regular fa-trash-can p-1');

        $('#couponButton').attr('onclick', 'couponDelete()');
    };
}

// COUPON VALIDATION ENDS


couponDelete = async () => {

    const result = await Swal.fire({
        title: `Do you want to remove the coupon "${coupon}"?`,
        html:`By doing so, you will lose the discount amount <strong style="color: green;" >₹ ${couponData.discountAmount}</strong> associated with the coupon. Please confirm your decision`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'DISMISS'
        
    });

    if(result.value){

        const couponModel = document.getElementById("couponModel");
        const subTotalText = document.getElementById("subTotalText");
        const subTotalElement = document.getElementById("subTotal");
        const subTotalValue = document.getElementById("subTotalValue");

        couponModel.style.display = "none";
        subTotalText.innerHTML = "Grand Total:";
        subTotalElement.innerHTML = `₹ ${couponDeleteSubtotal}`;
        subTotalValue.value = couponDeleteSubtotal;

        $("#couponIcon").removeClass("fa-regular fa-trash-can p-1").addClass("icon-long-arrow-right");

        $("#couponButton").attr("onclick", "validateCoupon()");

        Swal.fire({
            icon: "success",
            title: `"${coupon}" REMOVED SUCCESSFULLY!!`,
            html: `The applied coupon has been successfully removed. The discount associated with the coupon has been removed as well`,
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    }
    
}