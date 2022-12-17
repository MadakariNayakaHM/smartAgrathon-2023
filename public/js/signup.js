

const signup= async (name,email,phone,password,confirmPassword)=>
{
    try{
        const res = await axios ({

            method:'POST',
            url:'/bugSlayers/user/signup',
            data :{
                name,email,phone,password,confirmPassword}
        })

        // console.log(res)
    } catch (err){console.log(err)}
}
document.querySelector('.form--signUp').addEventListener('submit',e=>{
    e.preventDefault();
   const email= document.getElementById('email').value;
   const password= document.getElementById('password').value;
   const confirmPassword=document.getElementById('confirmPassword').value;
   const name=document.getElementById('name').value;
   const phone=document.getElementById('phone').value;
signup(name,email,phone,password,confirmPassword,)
window.alert("signup successfull")});





