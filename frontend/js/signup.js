document.getElementById('signup').addEventListener("submit",async(e)=>{
    e.preventDefault();
    
    const email = localStorage.getItem('email');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const cpassword = document.getElementById('cpassword').value;
    const description = document.getElementById('description').value;

    const res = await fetch('http://localhost:3000/api/signup',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({username,password,cpassword,email,description})
    })

    
    const result = await res.json()
    alert(result.msg)
    if(result.ok){
        localStorage.removeItem('email');
        window.location.href="./signin.html"
    }
})

document.getElementById('imageinput').addEventListener('change',function(){
    const file = this.files[0]
    const reader = new FileReader()
    reader.onload = function (e){
        console.log(e.target.result);
        console.log(document.getElementById('imagepreview'));
        document.getElementById('imagepreview').src=e.target.result;
        
    }
    reader.readAsDataURL(file)
})