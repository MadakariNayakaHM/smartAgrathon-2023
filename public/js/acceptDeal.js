

const accepDeal= async (dealId,text,agreed)=>
{
    try{
        const res = await axios ({

            method:'PATCH',
            url:'/bugSlayers/dealers/acceptDeal',
            data :{dealId,
                text,
                agreed

                  }
        })

        // console.log(res)
    } catch (err){console.log(err)}
}
document.querySelector('.aggrement').addEventListener('submit',e=>{
    e.preventDefault();
    const dealId= document.getElementById('dealId').value;
    const text= document.getElementById('text1').value;
    console.log(text);
    const agreed= parseInt(document.getElementById('agreed').value);

   
    accepDeal(dealId,text, agreed)
window.alert("Accepted successfully")
});






