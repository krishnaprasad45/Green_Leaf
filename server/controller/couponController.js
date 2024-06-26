
const Coupon = require("../model/couponModel")
const moment = require("moment");




const loadCoupons = async (req, res) => {
    try {
        // const coupon = await Coupon.find();
            // Search codes here

    let coupon;

    const search = req.query.search;

    if (search) {
        coupon = await Coupon.find({
        $or: [
          { code: { $regex: ".*" + search + ".*", $options: "i" } },
       
        ]
      });
    }
     else {
        coupon = await Coupon.find()

    }
    // Search Function ends

        const couponData = coupon.map((element) => {
            const formattedDate = moment(element.expiryDate).format("MMMM D, YYYY");

            return {
                ...element,
                expiryDate: formattedDate,
            };
        });

        res.render("viewCoupon", { couponData, user: req.session.admin });
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

        const { couponCode, couponDiscount, couponDate, minDiscount, maxDiscount } = req.body;
        const couponCodeUpperCase = couponCode.toUpperCase();

        const couponExist = await Coupon.findOne({ code: couponCodeUpperCase });
        if (!couponExist) {
            const coupon = new Coupon({
                code: couponCodeUpperCase,
                discount: couponDiscount,
                expiryDate: couponDate,
                minDiscount: minDiscount,
                maxDiscount: maxDiscount
            });

            await coupon.save();
            res.json({ message: "coupon addedd" });
        } else {
            res.json({ message: "coupon exists" });
        }
    } catch (error) {
        console.log(error.message);
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
const validateCoupon = async (req, res) => {
    try {
        const { coupon, subTotal } = req.body;
        const couponData = await Coupon.findOne({ code: coupon });

        if (!couponData) {
            res.json("invalid");
        } else if (couponData.expiryDate < new Date()) {
            res.json("expired");
        } else {
            const couponId = couponData._id;
            const discount = couponData.discount;
            const minDiscount = couponData.minDiscount
            const maxDiscount = couponData.maxDiscount
            const userId = req.session.user._id;

            const couponUsed = await Coupon.findOne({ _id: couponId, usedBy: { $in: [userId] } });

            if (couponUsed) {
                res.json("already used");
            } else {

                let discountAmount
                let maximum

                const discountValue = Number(discount);
                const couponDiscount = (subTotal * discountValue) / 100;

                if (couponDiscount < minDiscount) {

                    res.json("minimum value not met")

                } else {
                    if (couponDiscount > maxDiscount) {
                        discountAmount = maxDiscount
                        maximum = "maximum"
                    } else {
                        discountAmount = couponDiscount
                    }

                    const newTotal = subTotal - discountAmount;
                    const couponName = coupon;

                    res.json({
                        couponName,
                        discountAmount,
                        newTotal,
                        maximum
                    });
                }


            }
        }
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
    validateCoupon,
}