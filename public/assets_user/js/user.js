const addToCart = async (productId) => {
    console.log(111);
    
    console.log(productId);


    try {
    console.log("try");
    event.preventDefault();
        const addToCartButton = document.getElementById("addToCartBtn");
        let quantity = document.getElementById(productId).value;
        console.log(`quantity before: ${quantity}`);
        
        if(quantity === null){
            quantity = 1
        }
        
        
        console.log(`quantity: ${quantity}`);

        const response = await fetch(`/addToCart?id=${productId}&quantity=${quantity}`, {

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


const totalPrice = async (id, act, stock) => {
    console.log(11);
    const elem = document.getElementById(id);
    
    if (act == "inc") elem.value ? (elem.value = Number(elem.value) + 1) : "";
    else if (act == "dec") elem.value > 1 ? (elem.value = Number(elem.value) - 1) : "";

    let subTotal = 0;
    let datas = [];
    let length = document.getElementsByName("productTotal").length;
    console.log(length);
    
    for (let i = 0; i < length; i++) {
        
        const quantity = parseFloat(document.getElementsByName("num-product")[i].value);
       
        const price = parseFloat(document.getElementsByName("productprice")[i].value);
    
        const productTotal = isNaN(quantity) || isNaN(price) ? 0 : quantity * price;
        document.getElementsByName("productTotal")[i].innerText = "₹ " + productTotal.toFixed();
        subTotal += productTotal;
      

        datas.push({
            id: document.getElementsByName("productId")[i].value,
            quantity: Number(document.getElementsByName("num-product")[i].value),
        });
    }
    // console.log(document.getElementById("subTotal")); 
    console.log(subTotal);
    document.getElementById("subTotal").innerText = "₹ " + subTotal.toFixed();
    document.getElementById("subTotal2").innerText = "₹ " + subTotal.toFixed();
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
