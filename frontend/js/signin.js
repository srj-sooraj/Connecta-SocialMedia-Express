document.getElementById('login').addEventListener("submit",async(e)=>{
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
   

    const res = await fetch('http://localhost:3000/api/signin',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({username,password})
    })
    console.log(res);
    
    const result = await res.json()
    if(res.status === 400)
        document.getElementById('msg').style.color="red";
    document.getElementById('msg').textContent=result.msg
    
    // alert(result.msg)
    if(res.status === 201)
        document.getElementById('msg').style.color="green";
        document.getElementById('msg').textContent=result.msg
    if(result.ok){
        localStorage.setItem('Auth', result.token); 
        setTimeout(()=>{
        window.location.href = "./main.html";

        },3000)
    }
})