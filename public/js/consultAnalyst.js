

const consultAnalyst=async (data,type)=>
{
    try{const res=await axios({
        method:'POST',
        url:'/bugSlayers/user/createPost',
        data
        
    
    })
    console.log(res)
    ;}catch (err){console.log(err)}
    }
    
    document.querySelector('.form--consultation').addEventListener('submit',e=>{
        e.preventDefault();
       
        const form = new FormData();
		var files = document.getElementById("cropPhoto").files;
		for (var i = 0; i < files.length; i++)

        
		{
			form.append('cropPhoto', files[i]);
		}
    form.append('to', document.getElementById('to').value);
    form.append('quantity', document.getElementById('quantity').value);
    form.append('cropPhoto', document.getElementById('cropPhoto').files);
    form.append('place', document.getElementById('place').value);
    form.append('query', document.getElementById('query').value);
    console.log(form);

    consultAnalyst(form, 'data');
    window.alert("Your form submitted successfully")
// console.log(req.file)
});
