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
