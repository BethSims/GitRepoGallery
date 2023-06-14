//Selects the div with profile information
const overview = document.querySelector(".overview");
//Selects the UL to display repos in
const repoList = document.querySelector(".repo-list");
//Selects section where repos will appear
const repoSection = document.querySelector(".repos");
//Selects section where individual repo data will appear
const repoDetails = document.querySelector(".repo-data");
//Creates a variable to pass the username
const username = "BethSims";


const fetchProfile = async function () {
    const request = await fetch(`https://api.github.com/users/${username}`);
    const profileData = await request.json();
    // console.log(profileData);
    displayUserData(profileData);
};

fetchProfile();

const displayUserData = function(data) {
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    userInfo.innerHTML = `
        <figure>
          <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Bio:</strong> ${data.bio}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div> 
    ` 
    overview.append(userInfo);

    fetchRepos();
};

const fetchRepos = async function() {
  const request = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await request.json();
  // console.log(repoData);
  displayRepoData(repoData);
};

const displayRepoData = function(repos) {
  for (const repo of repos) {
    const li = document.createElement("li");
    li.classList.add("repo");
    li.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(li);
  };
};

repoList.addEventListener("click", function(e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    fetchRepoDetails(repoName);
  }
});

const fetchRepoDetails = async function(repoName) {
  const request = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await request.json();
  const fetchLanguages = await fetch(repoInfo.language_url);
  const languageData = await fetchLanguages.json;
  console.log(languageData);
};