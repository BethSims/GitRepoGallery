//Selects the div with profile information
const overview = document.querySelector(".overview");
//Selects the UL to display repos in
const repoList = document.querySelector(".repo-list");
//Selects section where repos will appear
const repoSection = document.querySelector(".repos");
//Selects section where individual repo data will appear
const repoDetails = document.querySelector(".repo-data");
//Selects the Back to Repo Gallery button
const backButton = document.querySelector(".view-repos");
//Selects the search input
const filterInput = document.querySelector(".filter-repos");
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
  filterInput.classList.remove("hide");
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
  // console.log(repoInfo);
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  // console.log(languageData);
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  };
  // console.log(languages);
  displayRepoDetails(repoInfo, languages);
};

const displayRepoDetails = function(repoInfo, languages) {
  repoDetails.innerHTML= "";
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
      <p>Description: ${repoInfo.description}</p>
      <p>Default Branch: ${repoInfo.default_branch}</p>
      <p>Languages: ${languages.join(", ")}</p>
      <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoDetails.append(div);
  repoDetails.classList.remove("hide");
  repoSection.classList.add("hide");
  backButton.classList.remove("hide");
};

backButton.addEventListener("click", function () {
  repoSection.classList.remove("hide");
  repoDetails.classList.add("hide");
  backButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e){
  const searchInput = filterInput.value;
  // console.log(searchInput);
  const repos = document.querySelectorAll(".repo");
  const searchText = searchInput.toLowerCase();
  for (const repo of repos) {
    const repoName = repo.innerText.toLowerCase();
    if (repoName.includes(searchText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    };
  };
});