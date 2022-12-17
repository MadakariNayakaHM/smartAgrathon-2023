

const logout= async ()=>
{
    try{
        const res = await axios ({

            method:'POST',
            url:'/bugSlayers/user/logout',
            data :{
                }
        })

        // console.log(res)
    } catch (err){console.log(err)}
}
document.querySelector('.logout--form').addEventListener('submit',e=>{
    e.preventDefault();
  
   
logout()
window.alert("logout successfull")
});






