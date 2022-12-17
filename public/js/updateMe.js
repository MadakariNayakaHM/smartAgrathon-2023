// 
// import axios from "axios";

const updateSettings=async (data,type)=>
{
    try{const res=await axios({
        method:'PATCH',
        url:'/bugSlayers/user/updateMe',
        data
        
    
    })
    console.log(res)
    ;}catch (err){console.log(err)}
    }
    
    document.querySelector('.form--update').addEventListener('submit',e=>{
        e.preventDefault();
       
        const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    form.append('phone', document.getElementById('phone').value);
    form.append('userId', document.getElementById('userId').value);
    console.log(form);

    updateSettings(form, 'data');
    window.alert("Your profile updated successfully")
// console.log(req.file)
});
