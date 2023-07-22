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