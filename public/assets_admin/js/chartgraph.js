import ejs from 'ejs';


 let months
 let ordersByMonth
 let revenueByMonth
 let orderData





 
 if (window.location.pathname === '/admin_dashboard') {
 // Move the Chart rendering code inside the window.onload event listener
window.onload = function() {
 // Place your existing JavaScript code here
 // ...

 const getChartData = async()=>{
   const response = await fetch('/chartData',{
     headers:{
       'Content-Type': 'application/json'
     }
   })

   const data = await response.json()

   console.log(data);

   months = data.months
   ordersByMonth = data.ordersByMonth
   revenueByMonth = data.revenueByMonth

   salesGraph(months, ordersByMonth)
   revenue(months, data.revenueByMonth)
 }


 function salesGraph(months, ordersByMonth) {
   console.log(11);
   const ctx = document.getElementById('myChart');
   new Chart(ctx, {
     type: 'bar',
     data: {
       labels: months,
       datasets: [{
         label: '# of sales',
         data: ordersByMonth,
         borderWidth: 1
       }]
     },
     options: {
       scales: {
         y: {
           beginAtZero: true
         }
       }
     }
   });
 }

 function revenue(months, revenueByMonth) {
 
   const ctx1 = document.getElementById('myChart1');
   new Chart(ctx1, {
     type: 'line',
     data: {
       labels: months,
       datasets: [{
         label: '# Revenue',
         data: revenueByMonth,
         borderWidth: 1
       }]
     },
     options: {
       scales: {
         y: {
           beginAtZero: true
         }
       }
     }
   });
 }

 // Call the getChartData function after the DOM has fully loaded
 getChartData();
};
}


// Sales report


const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate());
const maxDate = tomorrow.toISOString().split('T')[0];

if(startDateInput && endDateInput){
startDateInput.setAttribute("max", maxDate);
endDateInput.setAttribute("min", startDateInput.value);
endDateInput.setAttribute("max", maxDate);
}

var startDateField = document.getElementById("start-date");
var endDateField = document.getElementById("end-date");

if(startDateField && endDateField){
startDateField.addEventListener("change", function () {
endDateField.setAttribute("min", startDateField.value);
});

endDateField.addEventListener("change", function () {
startDateField.setAttribute("max", endDateField.value);
});

}

let startDate
let endDate


const getSalesData = async() => {
  alert("getSalesData")
  startDate = document.getElementById("start-date").value;
  endDate = document.getElementById("end-date").value;
  console.log(startDate, endDate);



  const salesReportTemplate = `
  <%
  function forLoop(from, to, incr, block) {
    let accum = "";
    for (let i = from; i < to; i += incr) {
      accum += block(i);
    }
    return accum;
  }
%>
  <div class="col-xl-12">
  <!-- Account details card-->
  <div class="card mb-4">
    <div class="card-header">Sales Report</div>
    <div class="card-body ml-3 p-5">
      <ul>
        <table id="my-table" class="my-table table table-hover" style="border-top: 1px solid black;">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Order id</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Product Details</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            <% data.orders.forEach(function(order) { %>
            <tr>
              <td><%= order.date %></td>
              <td><%= order.orderId %></td>
              <td><%= order.paymentMethod %></td>
              <td>
                <% order.productName.forEach(function(product) { %>
                <p>Name: <%= product.name %></p>
                <p>Quantity: <%= product.quantity %></p>
                <p>Price: <span>₹</span><%= product.price %></p>
                <% }); %>
              </td>
              <td><span>₹</span><%= order.total %></td>
            </tr>
            <% }); %>
          </tbody>
        </table>
        <h5>Total Revenue: ₹<strong class="ml-auto"><%= data.grandTotal %></strong></h5>
      </ul>
    </div>
  </div>
</div>
<div>
  <button onclick="downloadSalesReport()" class="btn btn-primary">DOWNLOAD REPORT</button>
</div>

`;

function renderSalesReport(orderData) {
const salesReportHTML = ejs.render(salesReportTemplate, { data: orderData });
document.getElementById("table").innerHTML = salesReportHTML;

jQuery(document).ready(function ($) {
  $("#my-table").DataTable({
    dom: "Bfrtip",
    buttons: ["excelHtml5", "pdfHtml5"],
  });
});
}



//sales report fetch

  const response = await fetch(`/getSales?startDate=${startDate}&endDate=${endDate}`, {
      headers: { "Content-Type": "application/json" },
  });

  orderData = await response.json();
  if (orderData) {
      renderSalesReport(orderData);
  }
}


const downloadSalesReport = async () => {
try {
  const response = await fetch(`/downloadSalesReport?startDate=${startDate}&endDate=${endDate}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderData: orderData,
    }),
  });

  const blobData = await response.blob();
  console.log("blobbbbbb")
  const url = URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.download = `SalesReport.pdf`;
  link.click();

  URL.revokeObjectURL(url);
} catch (error) {
  console.log(error.message);
}
};