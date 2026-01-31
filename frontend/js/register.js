document.getElementById('mail-form').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const res = await fetch('http://localhost:3000/api/registeremail',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email})
    })
    const result = await res.json();
    console.log(result);
    if (result.ok) {
        localStorage.setItem('email',email);

       window.location.href = "./verify.html";
    } else {
        alert(result.msg)
    }
    
    console.log(res);
})