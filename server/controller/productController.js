const model = require("../model/product");
const categoryModel = require("../model/category");

const productData = model.products;
const categoryData = categoryModel.category



const cloudinary = require("../../config/cloudinary");
require("dotenv").config();



const addProduct = async (req, res) => {
  try {
    const data = await categoryData.find();
    res.render("add_product", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addProductPost = async (req, res) => {
  const { product_name } = req.body;
  const image = req.file; 
  
  try {
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "Products",  
  });
    const exist = await productData.findOne({ product_name: product_name });
    if (exist) {
      res.render("add_product", { message: "The product already exists" });
    } else {
      const product = new productData({
        product_name: req.body.product_name,
        product_details: req.body.product_details,
        category: req.body.category,
        price: req.body.price,
        imageUrl: {
          public_id: result.public_id,
          url: result.secure_url,
      },
      });

      await product.save();
      console.log("******Data stored in the database******")

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
////                                CATEGORY                                                  ///

const addCategory = (req,res) => {
   res.render('addCategory')
};

const viewCategory = async (req, res) => {
  try {
    const data = await categoryData.find();
    res.render("viewCategory", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addCategoryPost = async (req, res) => {
  const categoryName = req.body.category_name;
  const categoryDescription = req.body.category_details;
 
  const image = req.file; 
  const lowerCategoryName = categoryName.toLowerCase();
  try {

      const result = await cloudinary.uploader.upload(image.path, {
          folder: "Categories",  
      });
      const categoryExist = await categoryData.findOne({ category: lowerCategoryName });
      if (!categoryExist) {

          const category = new categoryData({
              category: lowerCategoryName,
              imageUrl: {
                  public_id: result.public_id,
                  url: result.secure_url,
              },
              description: categoryDescription,
          });

          await category.save();
          console.log("******Data stored in the database******")
          req.session.categorySave = true;
          res.redirect("/viewCategory");
      } else {
          req.session.categoryExist = true;
          res.redirect("/viewCategory");
      }
  } catch (error) {
      console.log(error);
  }
};



module.exports = {
  addProduct,
  addProductPost,
  updateProduct,
  updateProductPost,
  deleteProduct,
  viewProducts,
  addCategory,
  addCategoryPost,
  viewCategory
};
