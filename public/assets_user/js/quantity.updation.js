const totalPrice = async (id, act, stock) => {

    const elem = document.getElementById(id);

    if (act == "inc") elem.value ? (elem.value = Number(elem.value) + 1) : "";
    else if (act == "dec") elem.value > 1 ? (elem.value = Number(elem.value) - 1) : "";

    let subTotal = 0;
    let datas = [];
    let length = document.getElementsByName("productTotal").length;


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

    document.getElementById("subTotal").innerText = "₹ " + subTotal.toFixed();

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