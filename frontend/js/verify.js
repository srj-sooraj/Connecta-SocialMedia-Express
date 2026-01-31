document.getElementById('verifyform').addEventListener('submit',async(e)=>{
  e.preventDefault();
  
  const otp = document.getElementById('otp').value;
  
  const email = localStorage.getItem('email');
console.log(email);

    const res = await fetch('http://localhost:3000/api/verifyotp',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });

  const result = await res.json()

  if (result.ok) {
    alert('OTP verified successfully');
    window.location.href = "./signup.html";
  } else {
    alert('OTP verification failed');
    // localStorage.removeItem('email');
  }

})