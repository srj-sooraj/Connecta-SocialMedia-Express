const token = localStorage.getItem("Auth");
if (!token) window.location.href = "./signin.html";


fetch("http://localhost:3000/api/me", {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  document.getElementById("nav-username").textContent = data.user.username;
  document.getElementById("nav-profile-img").src = data.user.profilePic;
  document.getElementById("popup-img").src = data.user.profilePic;
  document.getElementById("popup-name").textContent = data.user.username;
  document.getElementById("popup-desc").textContent = data.user.description;
});




fetch("http://localhost:3000/api/users", {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  const box = document.getElementById("users-container");

  data.users.forEach(user => {
    box.innerHTML += `
      <div>
        <img src="${user.profilePic}"> 
        <h3>${user.username}</h3>
        <p>${user.description || ""}</p>
        <button onclick="sendRequest('${user._id}')">Add</button>
      </div>
    `;
  });
});

// const res = await fetch('http://localhost:3000/api/getDetails',{
//         method:'POST',
//         headers:{'content-type':'application/json'},
//         body:JSON.stringify({username,password,cpassword,email,description})
//     })

    
//     const result = await res.json()
//     alert(result.msg)
//     if(result.ok){
//         localStorage.removeItem('email');
//         window.location.href="./signin.html"
//     }


function sendRequest(id) {
  fetch("http://localhost:3000/api/sendrequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ toUserId: id })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.msg || "Request sent");
  });
}


document.getElementById("profile-btn").onclick = () => {
  document.getElementById("profile-popup").classList.toggle("hidden");
};


document.getElementById("logout-btn").onclick = () => {
  localStorage.removeItem("Auth");
  window.location.href = "./signin.html";
};

document.getElementById("notify-btn").onclick = () => {
  const box = document.getElementById("notify-popup");
  box.classList.toggle("hidden");
  box.innerHTML = "";

  // hide badge when opened
  document.getElementById("notify-count").classList.add("hidden");
  document.getElementById("notify-btn").classList.remove("shake");

  fetch("http://localhost:3000/api/requests", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    if (data.requests.length === 0) {
      box.innerHTML = "<p>No new requests</p>";
      return;
    }

    data.requests.forEach(u => {
      box.innerHTML += `
        <div class="notify-item">
          <span>${u.username}</span>
          <button onclick="accept('${u._id}')">Accept</button>
        </div>
      `;
    });
  });
};


function accept(id) {
  fetch("http://localhost:3000/api/acceptrequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ fromUserId: id })
  }).then(() => location.reload());
}

fetch("http://localhost:3000/api/friends", {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  const box = document.getElementById("friends-container");
  box.innerHTML = "";

  if (data.friends.length === 0) {
    box.innerHTML = "<p>No friends yet</p>";
    return;
  }

  data.friends.forEach(friend => {
    box.innerHTML += `
      <div class="friend-card">
        <img src="${friend.profilePic || ''}">
        <h4>${friend.username}</h4>
        <p>${friend.description || ""}</p>
      </div>
    `;
  });
});

fetch("http://localhost:3000/api/requests", {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  const badge = document.getElementById("notify-count");
  const bell = document.getElementById("notify-btn");

  if (data.requests.length > 0) {
    badge.textContent = data.requests.length;
    badge.classList.remove("hidden");
    bell.classList.add("shake");
  }
});
