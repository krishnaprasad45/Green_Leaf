 /////////////// ADD COUPON ////////////////////

 const addCouponForm = document.getElementById('addCoupon');

 if (addCouponForm){
 
 addCouponForm.addEventListener('submit', async function(event) {
   event.preventDefault();
 
   const form = event.target;
   const formData = new FormData(form);
 
   try {
       const response = await fetch('/addCoupon', {
           method: 'POST',
           body: JSON.stringify(Object.fromEntries(formData)),
           headers: {
             'Content-Type': 'application/json'
           }
         });

         const data = await response.json()
 
     if (data.message === "coupon addedd") {
       const result = await Swal.fire({
           icon: "success",
           title: "New Coupon added Successfully",
           showConfirmButton: true,
           confirmButtonText: "OK",
           confirmButtonColor: "#79a206"
           
       });
           if(result.value){
               form.reset()
               window.location.href = '/viewCoupon'
           }
       
     } else {
       Swal.fire({
           icon: "error",
           title: "Some error occured",
           showConfirmButton: true,
           confirmButtonText: "CANCEL",
           confirmButtonColor: "#D22B2B"
           
       });
     }
   } catch (error) {
     console.log('Error:', error.message);
   }
 });
}



 
 /////////////// DELETE COUPON ////////////////////


 const deleteCoupon = async(couponId)=>{
   try{
 
     const result = await Swal.fire({
       title: 'Delete Coupon',
       text: 'Do you want to delete this coupon? \nThis cannot be undo!',
       icon: 'question',
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33", 
       confirmButtonText: 'Yes,Delete',
       cancelButtonText: 'DISMISS'
       
   });
 
   if(result.value){
 
     const response = await fetch(`/deleteCoupon?couponId=${couponId}`,{
       method: 'POST'
     })
 
     const data = await response.json()
 
     if(data.message = "success"){
       Swal.fire({
         icon: "success",
         title: "Coupon has been deleted successfully",
         showConfirmButton: true,
         confirmButtonText: "OK",
         confirmButtonColor: "#4CAF50",
     });
     document.getElementById('couponRow' + couponId).innerHTML = ''
     }else{
 
       Swal.fire({
         icon: "error",
         title: "Somthing error!!",
         showConfirmButton: true,
         confirmButtonText: "DISMISS",
         confirmButtonColor: "#D22B2B"
         
     });
 
     }
 
   }
 
   }catch(error){
     console.log(error.message);
   }
 }
 

 const blockCoupon = async(couponId)=>{
   try{
 
     const result = await Swal.fire({
       title: 'Block Coupon',
       text: 'Do you want to block this coupon?',
       icon: 'question',
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33", 
       confirmButtonText: 'Yes, Block',
       cancelButtonText: 'DISMISS'
       
   });
 
   if(result.value){
 
     const response = await fetch(`/blockCoupon?couponId=${couponId}`,{
       method: 'POST'
     })
 
     const data = await response.json()
 
     if(data.message = "success"){
       const result = await Swal.fire({
         icon: "success",
         title: "Coupon has been blocked successfully",
         showConfirmButton: true,
         confirmButtonText: "OK",
         confirmButtonColor: "#4CAF50",
     });

     if(result.value){
       location.reload()
     }
     
     }else{
 
       Swal.fire({
         icon: "error",
         title: "Somthing error!!",
         showConfirmButton: true,
         confirmButtonText: "DISMISS",
         confirmButtonColor: "#D22B2B"
         
     });
 
     }
 
   }
 
   }catch(error){
     console.log(error.message);
   }
 }
 