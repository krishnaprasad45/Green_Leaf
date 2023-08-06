const Banner = require("../model/bannerModel");
const cloudinary = require("../../config/cloudinary");
require("dotenv").config();



const loadBanners = async (req, res) => {
    try {
        const bannerData = await Banner.find();

        if (req.session.bannerSave) {
           res.render("viewBanners", {
                bannerData,
                bannerSave: "Banner created successfully!",
                user: req.session.admin,
                data:null
            });
            req.session.bannerSave = false;
        } else if (req.session.bannerExist) {
            res.render("viewBanners", {
                bannerData,
                bannerSave:"",
                bannerExist: "Banner alreddy exitsts!",
                bannerDelete: "",
                user: req.session.admin,
                data:null

            });
            req.session.bannerExist = false;
        } else if (req.session.bannerUpdate) {
            res.render("viewBanners", {
                bannerData,
                bannerUpdate: "Banner updated successfully!",
                bannerDelete: "",
                bannerSave:"",
                bannerExist:"",
                user: req.session.admin,
                data:null

            });
            req.session.bannerUpdate = false;
        }else if (req.session.bannerDelete) {
            res.render("viewBanners", {
                bannerData,
                bannerDelete: "Banner deleted successfully!",
                bannerUpdate:"",
                bannerSave:"",
                bannerExist:"",
                user: req.session.admin,
                data:null

            });
            req.session.bannerDelete = false;
        }
        else {
            res.render("viewBanners", { bannerData, user: req.session.admin,bannerSave:"",bannerExist:"",bannerUpdate:"", bannerDelete: "", data:null});
        }
    } catch (error) {
        console.log(error.message);
    }
};


const addBanner = async (req, res) => {
    try {
        res.render("addBanner", { user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};


const addNewBanner = async (req,res)=>{
    try {
        console.log("addNewBanner Post middleware")
        const { title, label, bannerSubtitle } = req.body
        const image = req.file
            console.log(`image ${image}`)

        console.log(1)

        if (!image) {
            // Handle the case when no image is uploaded
            console.log("No image uploaded");
            // You might want to return an error response or redirect the user back to the form page.
            return;
        }

        const existing = await Banner.findOne({ title: title })
        console.log(2)

        if (existing) {
            req.session.bannerExist = true;
            res.redirect("/banners");
        } else {
        console.log("addnewbanner else condition")

            const result = await cloudinary.uploader.upload(image.path, {
                folder: "Banners",
            });

            const banner = new Banner({
                title: title,
                subtitle: bannerSubtitle,
                label: label,
                image: {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            });

            await banner.save();
            console.log("banner added")
            req.session.bannerSave = true;
            res.redirect("/banners");
        }
        
    } catch (error) {
        console.log("Error during image upload:", error);    }
}

const editBanner = async (req, res) => {
    
    try {

        const bannerId = req.params.id;
        const bannerData = await Banner.findById({ _id: bannerId });

        res.render("updateBanner", { bannerData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};


const updateBanner = async (req, res) => {
    try {

        const { title, label, bannerSubtitle } = req.body
        const bannerId = req.params.id;
        const newImage = req.file;

        const banner = await Banner.findById(bannerId);
        const bannerImageUrl = banner.image.url;
        
        let result;
        if (newImage) {
            if(bannerImageUrl){
                await cloudinary.uploader.destroy(banner.image.public_id);
            }
            result = await cloudinary.uploader.upload(newImage.path, {
                folder: "Banners"
            });
        } else {
            result = {
                public_id: banner.imageUrl.public_id,
                secure_url: bannerImageUrl
            };
        }

        const bannerExist = await Banner.findOne({ title: title });
        const imageExist = await Banner.findOne({ 'image.url': result.secure_url });

        if (!bannerExist || !imageExist) {
            await Banner.findByIdAndUpdate(
                bannerId,
                {
                    title: title,
                    subtitle: bannerSubtitle,
                    label: label,
                    image: {
                        public_id: result.public_id,
                        url: result.secure_url
                    },
                },
                { new: true }
            );
            req.session.bannerUpdate = true;
            res.redirect("/admin/banners");
        } else {
            req.session.bannerExist = true;
            res.redirect("/admin/banners");
        }
    } catch (error) {
        console.log(error.message);
    }
};


const bannerStatus = async (req, res) => {
    try {
        const bannerId = req.params.id;

        const unlistBanner = await Banner.findById(bannerId);

        await Banner.findByIdAndUpdate(
            bannerId,
            { $set: { active: !unlistBanner.active } },
            { new: true }
        );

        res.redirect('/admin/banners')
    } catch (error) {
        console.log(error.message);
    }
};



module.exports = {
    addBanner,
    editBanner,
    updateBanner,
    bannerStatus,
    addNewBanner,
    loadBanners,
}

