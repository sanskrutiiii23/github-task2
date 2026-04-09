document.addEventListener("DOMContentLoaded", () => {
  const profileCard = document.getElementById("profileCard");
  const reposList = document.getElementById("reposList");

  const input = document.getElementById("usernameInput");
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchProfile();
    }
  });
});

async function fetchProfile(){
   const username= document.getElementById("usernameInput").value;
   if(!username) return;

   const reposList = document.getElementById("reposList");
   reposList.innerHTML = `<p class="text-center">Loading...</p>`;

   const profileCard = document.getElementById("profileCard");
   profileCard.classList.add("hidden");

   const welcomeSection = document.getElementById("welcomeSection");
   if (welcomeSection) welcomeSection.style.display = "none";

   const userRes= await fetch(`https://api.github.com/users/${username}`);
   const userData= await userRes.json();

     if (userData.message === "Not Found") {
          const reposList = document.getElementById("reposList");
          reposList.innerHTML = `<p class="text-red-500 text-center">User not found</p>`;
          profileCard.classList.remove("hidden");
          return;
        }

         console.log(userData);

        document.getElementById("avatar").src = userData.avatar_url;
        document.getElementById("name").textContent = userData.name || "No Name";
        document.getElementById("username").textContent = "@" + userData.login;
        const date = new Date(userData.created_at);
        document.getElementById("joinDate").textContent = date.toDateString();

        document.getElementById("reposCount").textContent = userData.public_repos;
        document.getElementById("followersCount").textContent = userData.followers;
        document.getElementById("followingCount").textContent = userData.following;

    const repofetch= await fetch(userData.repos_url)
    let repos = await repofetch.json();

     const starfetch= await fetch(userData.starred_url.replace("{/owner}{/repo}", ""));
     let stars = await starfetch.json();
     document.getElementById("starsCount").textContent = stars.length;
     reposList.innerHTML = "";
        
        repos.forEach((repo) => {
          const div = document.createElement("div");
          div.className = "p-4 border rounded bg-gray-50 hover:shadow-md transition";

          div.innerHTML = `
            <a href="${repo.html_url}" target="_blank" class="text-blue-600 font-semibold">${repo.name}</a>
            <p class="text-sm text-gray-600">${repo.description || "No description provided."}</p>
            <p class="text-sm mt-1">⭐ ${repo.stargazers_count}</p>
          `;

          reposList.appendChild(div);
        });

        profileCard.classList.remove("hidden");
      

}
