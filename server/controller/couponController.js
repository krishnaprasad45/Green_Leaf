
const Coupon = require("../model/couponModel")
const moment = require("moment");




const loadCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.find();

        const couponData = coupon.map((element) => {
            const formattedDate = moment(element.expiryDate).format("MMMM D, YYYY");

            return {
                ...element,
                expiryDate: formattedDate,
            };
        });

    res.render("viewCoupon", { couponData, user: req.session.admin  });
    } catch (error) {
        console.log(error.messaage);
    }
};

const loadAddCoupon = async (req, res) => {
    try {
        res.render("addCoupon", { user: req.session.admin });
    } catch (error) {
        console.log(error.messaage);
    }
};

const addCouponPost = async (req, res) => {
    try {
        console.log("coupon post")

        const { couponCode, couponDiscount, couponDate, minDiscount, maxDiscount } = req.body;
        console.log(`coupon details ${couponCode, couponDiscount, couponDate, minDiscount, maxDiscount}`)
        const couponCodeUpperCase = couponCode.toUpperCase();

        const couponExist = await Coupon.findOne({ code: couponCodeUpperCase });
         console.log(`couponExist ${couponExist}`)
        if (!couponExist) {
            const coupon = new Coupon({
                code: couponCodeUpperCase,
                discount: couponDiscount,
                expiryDate: couponDate,
                minDiscount: minDiscount,
                maxDiscount: maxDiscount
            });

            await coupon.save();
            console.log("coupon added")
            res.json({ message: "coupon addedd" });
        } else {
            res.json({ messaage: "coupon exists" });
        }
    } catch (error) {
        console.log(error.messaage);
    }
};

const blockCoupon = async (req, res) => {
    try {
        const couponId = req.query.couponId;

        const unlistCoupon = await Coupon.findById(couponId);

        await Coupon.findByIdAndUpdate(couponId, { $set: { status: !unlistCoupon.status } }, { new: true });

        res.json({ message: "success" });
    } catch (error) {
        console.log(error.message);
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.query.couponId;

        await Coupon.findByIdAndDelete(couponId);

        res.json({ message: "success" });
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    loadCoupons,
    blockCoupon,
    addCouponPost,
    loadAddCoupon,
    deleteCoupon,
}