

const answerQuery= async (reqId,solution)=>
{
    try{
        const res = await axios ({

            method:'PATCH',
            url:'/bugSlayers/analyst/acceptQuery',
            data :{reqId,solution
                  }
        })

        // console.log(res)
    } catch (err){console.log(err)}
}
document.querySelector('.form-answer').addEventListener('submit',e=>{
    e.preventDefault();
    const reqId= document.getElementById('reqId').value;
    const solution= document.getElementById('solution').value;
   
    answerQuery(reqId,solution)
window.alert("Answered successfully")
});






