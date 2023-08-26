
$('#newPass').submit(function(e){
    const pass = $("#password").val();
    const pass2 = $("#new_password").val();
    if(pass2!==pass){
        e.preventDefault();
        $("#notmatch").show();
    }else{
        $("#notmatch").hide();
    }

})

$('#signup').submit(function(e){
    const pass = $("#password_signup").val();
    const pass2 = $("#re_password").val();
    if(pass2!==pass){
        e.preventDefault();
        $("#notmatch").show();
    }else{
        $("#notmatch").hide();
    }

})