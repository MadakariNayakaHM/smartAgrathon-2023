

const signin= async (dealId,bargainedPrice)=>
{
    try{
        const res = await axios ({

            method:'POST',
            url:'/bugSlayers/dealers/bargain',
            data :{dealId,bargainedPrice
                }
        })

        // console.log(res)
    } catch (err){console.log(err)}
}
document.querySelector('.form--bargain').addEventListener('submit',e=>{
    e.preventDefault();
   const dealId= document.getElementById('dealId').value;
   const bargainedPrice= document.getElementById('bargainedPrice').value;
   
signin(dealId,bargainedPrice)
window.alert("bargained successfully")
});






