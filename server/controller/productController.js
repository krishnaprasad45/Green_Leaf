const model = require("../model/product");
const productData = model.products;

const addProduct = (req, res) => {
  res.render("add_product");
};

const addProductPost = async (req, res) => {
  console.log(req.body);
  const { product_name } = req.body;

  try {
    const exist = await productData.findOne({ product_name: product_name });
    if (exist) {
      res.render("add_product", { message: "The product already exists" });
    } else {
      const product = new productData({
        product_name: req.body.product_name,
        product_details: req.body.product_details,
        category: req.body.category,
        price: req.body.price,
      });

      await product.save();
      res.redirect("/view_products");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  console.log(`..........  ${productId}`);
  try {
    const product = await productData.findById(productId);
    console.log(`.......... product ${product}`);

    if (!product) {
      return res.render("update_product", { message: "Product not found" });
    }

    res.render("update_product", { product });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProductPost = async (req, res) => {
  const { product_name, product_details, category, price } = req.body;
  const id = req.params.id;

  try {
    const product = await productData.findById(id);
    if (!product) {
      return res.render("update_product", { message: "Product not found" });
    }

    product.product_name = product_name;
    product.product_details = product_details;
    product.category = category;
    product.price = price;

    await product.save();

    res.redirect("/view_products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteId = req.params.id;
    await productData.findByIdAndDelete(deleteId);
    res.redirect("/view_products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const viewProducts = async (req, res) => {
  try {
    const data = await productData.find();
    res.render("view_products", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addProduct,
  addProductPost,
  updateProduct,
  updateProductPost,
  deleteProduct,
  viewProducts,
};
