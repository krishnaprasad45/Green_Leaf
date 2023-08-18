const model = require("../model/product");
const productData = model.products;
const categoryData = require("../model/category");
const Razorpay = require("razorpay");



const cloudinary = require("../../config/cloudinary");
require("dotenv").config();



const addProduct = async (req, res) => {
  try {
    const categorydata = await categoryData.find();
    res.render("add_product", { categorydata });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addProductPost = async (req, res) => {
  const { product_name } = req.body;
 

  try {
    const files = req.files;
    const productImages = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Products",
      });

      const image = {
        public_id: result.public_id,
        url: result.secure_url
      };
      productImages.push(image)

    }
    const exist = await productData.findOne({ product_name: product_name });
    if (exist) {
      res.render("add_product", { message: "The product already exists" });
    } else {
      const product = new productData({
        product_name: req.body.product_name,
        product_details: req.body.product_details,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.quantity,
        
        imageUrl:productImages
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
 
  try {
    const product = await productData.findById(productId);
    const categoryDatas = await categoryData.find();

    if (!product) {
      return res.render("update_product", { message: "Product not found" });
    }

    res.render("update_product", { product, categoryDatas});
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await categoryData.findById(categoryId);



    if (!category) {
      return res.render("updateCategory", { message: "Category not found" });
    }

    res.render("updateCategory", { category });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProductPost = async (req, res) => {
  const { product_name, product_details, category, price, quantity } = req.body;
  const id = req.params.id;

  try {
    const product = await productData.findById(id);
    if (!product) {
      return res.render("update_product", { message: "Product not found",data:null });
    }

    product.product_name = product_name;
    product.product_details = product_details;
    product.category = category;
    product.price = price;
    product.stock = quantity,
    
    await product.save();

    res.redirect("/view_products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const updateCategoryPost = async (req, res) => {
  const { category, description, imageUrl } = req.body;

  const id = req.params.id;

  try {
    const categoryFields = await category.findById(id);

    if (!categoryFields) {
      return res.render("updateCategory", { message: "Category not found" });
    }

    // Update individual properties of categoryFields
    categoryFields.category = category;
    categoryFields.description = description;

    // Since imageUrl is an object with public_id and url properties,
    // we need to update them separately
    categoryFields.imageUrl.public_id = imageUrl.public_id;
    categoryFields.imageUrl.url = imageUrl.url;

    await categoryFields.save();

    res.redirect("/viewCategory");
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
    // const data = await productData.find();


        // Search codes here

        let data;

        const search = req.query.search;
    
        if (search) {
          data = await productData.find({
            $or: [
              { product_name: { $regex: ".*" + search + ".*", $options: "i" } },
              { category: { $regex: ".*" + search + ".*", $options: "i" } },
            ]
          });
        }
         else {
            data = await productData.find()
    
        }
        // Search Function ends






    res.render("view_products", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error...........");
  }
};
////                                CATEGORY                                                  ///

const addCategory = (req, res) => {
  res.render('addCategory')
};

const viewCategory = async (req, res) => {
  try {
    

    // Search codes here

    let data;

    const search = req.query.search;

    if (search) {
      data = await categoryData.find({
        $or: [
          { category: { $regex: ".*" + search + ".*", $options: "i" } },
      
        ]
      });
    }
     else {
        data = await categoryData.find()

    }
    // Search Function ends

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

const deleteCategory = async (req, res) => {
  try {
    const deleteId = req.params.id;
    await categoryData.findByIdAndDelete(deleteId);
    res.redirect("/viewCategory");
  } catch (error) {
    res.status(500).send(error.message);
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
  viewCategory,
  updateCategory,
  updateCategoryPost,
  deleteCategory,
};
