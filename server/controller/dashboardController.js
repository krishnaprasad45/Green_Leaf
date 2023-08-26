const moment = require('moment');
const Sale = require("../model/order");
const model = require("../model/user_register");
const Order = require("../model/order");
const xvfb = require("xvfb");
const ejs = require('ejs');


const userData = model.user_register;


let months        = []
let ordersByMonth  = []
let revenueByMonth = []
let totalRevenue = 0
let totalSales  = 0


const adminDashboard = async (req, res) => {
    try {
      const sales = await Sale.find({});
      const signups = await userData.find().count()
      
  
      const salesByMonth = {};
  
      sales.forEach((sale) => {
        const monthYear = moment(sale.date).format('MMMM YYYY');
        if (!salesByMonth[monthYear]) {
          salesByMonth[monthYear] = {
            totalOrders: 0,
            totalRevenue: 0
          };
        }
        salesByMonth[monthYear].totalOrders += 1;
        salesByMonth[monthYear].totalRevenue += sale.total;
      });
  
      const chartData = [];
  
      Object.keys(salesByMonth).forEach((monthYear) => {
        const { totalOrders, totalRevenue } = salesByMonth[monthYear];
        chartData.push({
          month: monthYear.split(' ')[0],
          totalOrders: totalOrders || 0,
          totalRevenue: totalRevenue || 0
        });
      });
  
        months = [];
        ordersByMonth = [];
        revenueByMonth = [];
        totalRevenue = 0;
        totalSales = 0;
  
      chartData.forEach((data) => {
        months.push(data.month);
        ordersByMonth.push(data.totalOrders);
        revenueByMonth.push(data.totalRevenue);
        totalRevenue += Number(data.totalRevenue);
        totalSales += Number(data.totalOrders);
      });
  
      const thisMonthOrder = ordersByMonth[ordersByMonth.length - 1];
      const thisMonthSales = revenueByMonth[revenueByMonth.length - 1];
     
  
      res.render("admin_dashboard", {
        user: req.session.admin,
        revenueByMonth,
        months,
        signups,
        ordersByMonth,
        totalRevenue,
        totalSales,
        thisMonthOrder,
        thisMonthSales,
        productUpdated:""
      });
    } catch (error) {
      console.log(error.message);
    }
};
const chartData = async (req, res) => {
  try {
      res.json({
          months: months,
          revenueByMonth: revenueByMonth,
          ordersByMonth: ordersByMonth,
      });
  } catch (error) {
      console.log(error.message);
  }
};

const getSales = async (req, res) => {
  try {
    console.log("getSales middleware")
      const { startDate, endDate } = req.query;

      const newstartDate = new Date(startDate);
      const newEndDate = new Date(endDate);

      const orderData = await Order.find({
          date: {
              $gte: newstartDate,
              $lte: newEndDate,
          },
          status: "Delivered",
      }).sort({ date: "desc" });
      const formattedOrders = orderData.map((order) => ({
          date: moment(order.date).format("YYYY-MM-DD"),
          ...order,
      }));

      console.log(orderData);

      let salesData = [];
      
      formattedOrders.forEach((element) => {
          salesData.push({
              date: element.date,
              orderId: element._doc.orderId,
              total: element._doc.total,
              paymentMethod: element._doc.paymentMethod,
              productName: element._doc.product,
          });
      });

      let grandTotal = 0;

      salesData.forEach((element) => {
          grandTotal += element.total;
      });

      const orderdatas = {
          grandTotal: grandTotal,
          orders: salesData,
      };


      const renderTemp = `
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
        <div class="col-xl-12 d-flex justify-content-end mb-4">
        <button onclick="downloadSalesReport()" class="btn btn-primary">DOWNLOAD REPORT</button>
       
        </div>
        `;

      const renderContent = ejs.render(renderTemp, { data: orderdatas });
      console.log(renderContent);
      res.status(200).json({data: renderContent});

  } catch (error) {
      console.log(error.message);
  }
};




const downloadSalesReport = async (req, res) => {
try {
  const orderData = req.body.orderData;
  const { startDate, endDate } = req.query;

  const xvfbOptions = {
      silent: true,
  };

  const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const xvfbInstance = new xvfb(xvfbOptions);
  xvfbInstance.startSync();

  const page = await browser.newPage();

  await page.goto(
      `https://www.gadgetry.fun/admin/renderSalesReport?orderData=${encodeURIComponent(JSON.stringify(orderData))}
        &startDate=${startDate}&endDate=${endDate}`,
      {
          waitUntil: "networkidle2",
      }
  );

  const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
  });

  await browser.close();
  xvfbInstance.stopSync();

  res.set({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=SalesReport.pdf`,
  });

  res.send(pdfBuffer);
} catch (error) {
  console.log(error.message);
}
};

const renderSalesReport = async (req, res) => {
try {
  console.log("salesssssssss");
  const orderData = JSON.parse(decodeURIComponent(req.query.orderData)); // Parse the orderData string into an object

  const startDate = moment(new Date(req.query.startDate)).format('MMMM D, YYYY');
  const endDate = moment(new Date(req.query.endDate)).format('MMMM D, YYYY');

  const salesReportDate = moment(new Date()).format('MMMM D, YYYY');

  res.render('salesReport', { orderData, salesReportDate, startDate, endDate });
  console.log("reprttttttttt");

} catch (error) {
  console.log(error.message);
}
};


module.exports = {
  adminDashboard,
  getSales,
  renderSalesReport,
  downloadSalesReport,
  chartData,

}