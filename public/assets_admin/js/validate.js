$(document).ready(function () {
    console.log("validate function")
    $('#bannerValidate').validate({
        rules:{
            title:{
                required: true
            },
            label:{
                required:true
            },
            bannerSubtitle:{
                required:true
            },
            image:{
                required:true
            }

        }
    })
});

$('#addCoupon').validate({
    rules:{
        couponCode:{
            required:true,
            couponNameCheck:true
        },
        couponDiscount:{
            required:true,
            discountCheck:true
        }
    },
    messages:{
        couponCode:{
            required:"Please enter a coupon code",
            couponNameCheck:"Enter a valid cooupon code"
        },
        couponDiscount:{
            required:"Please enter discount percent",
            discountCheck:"Enter valid discount percent"
        },
        couponDate:{
            required:"Please choose an expiry date"
        }
    }
})

$.validator.addMethod("couponNameCheck", function (value) {
    return /^[a-zA-Z0-9]{1,10}$/.test(value);
});

$.validator.addMethod("discountCheck", function (value) {
    return /^(?:[1-9]\d?|100)$/.test(value);
});





