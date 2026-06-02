const usernameInput =
    document.querySelector(
        "#usernameInput"
    );

const analyzeBtn =
    document.querySelector(
        "#analyzeBtn"
    );

const exampleBtn =
    document.querySelector(
        "#exampleBtn"
    );

const clearBtn =
    document.querySelector(
        "#clearBtn"
    );

const profileCard =
    document.querySelector(
        "#profileCard"
    );

const statsGrid =
    document.querySelector(
        "#statsGrid"
    );
    const copyProfileBtn =
    document.querySelector(
        "#copyProfileBtn"
    );

initialize();

function initialize() {

    bindEvents();
}

function bindEvents() {

    analyzeBtn.addEventListener(
        "click",
        analyzeProfile
    );

    exampleBtn.addEventListener(
        "click",
        loadExample
    );

    clearBtn.addEventListener(
        "click",
        clearAnalyzer
    );

    copyProfileBtn?.addEventListener(
    "click",
    copyProfileUrl
);
}

async function analyzeProfile() {

    const username =
        usernameInput.value.trim();

    if (!username) {
        return;
    }

    try {

        const response =
            await fetch(
                `https://api.github.com/users/${username}`
            );

        if (!response.ok) {
            throw new Error();
        }

        const data =
    await response.json();

document
    .querySelector("#errorCard")
    ?.classList.add(
        "hidden"
    );

renderProfile(data);

await loadRepositories(
    username
);

    } catch {

        showError();

    }
}

function renderProfile(data) {
 
const statusBadge =
    document.querySelector(
        "#statusBadge"
    );

statusBadge.textContent =
    "ACTIVE";

statusBadge.className =
    "status-online";
    profileCard.classList.remove(
        "hidden"
    );

    statsGrid.classList.remove(
        "hidden"
    );

    document.querySelector(
        "#avatar"
    ).src =
        data.avatar_url;

    document.querySelector(
        "#name"
    ).textContent =
        data.name ?? "Unknown";

    document.querySelector(
        "#login"
    ).textContent =
        `@${data.login}`;

    document.querySelector(
        "#bio"
    ).textContent =
        data.bio ?? "No bio";

    document.querySelector(
        "#location"
    ).textContent =
        data.location ??
        "Unknown location";

    document.querySelector(
        "#profileLink"
    ).href =
        data.html_url;

    document.querySelector(
        "#repos"
    ).textContent =
        data.public_repos;

    document.querySelector(
        "#followers"
    ).textContent =
        data.followers;

    document.querySelector(
        "#following"
    ).textContent =
        data.following;

    document.querySelector(
        "#created"
    ).textContent =
        formatDate(
            data.created_at
        );
    document.querySelector(
        "#accountAge"
    ).textContent =
        calculateAccountAge(
            data.created_at
        );
        document.querySelector(
    "#ratio"
).textContent =
    calculateRatio(
        data.followers,
        data.following
    );
}

function loadExample() {

    usernameInput.value =
        "torvalds";

    analyzeProfile();
}

function clearAnalyzer() {

    usernameInput.value = "";

    profileCard.classList.add(
        "hidden"
    );

    statsGrid.classList.add(
        "hidden"
    );
    reposCard.classList.add(
    "hidden"
);

reposContainer.innerHTML =
    "";
}

function formatDate(date) {

    return new Date(
        date
    ).toLocaleDateString();
}

function showError() {

    document
        .querySelector("#errorCard")
        .classList.remove(
            "hidden"
        );

    profileCard.classList.add(
        "hidden"
    );

    statsGrid.classList.add(
        "hidden"
    );
}
function calculateAccountAge(date) {

    const created =
        new Date(date);

    const today =
        new Date();

    return `${
        today.getFullYear() -
        created.getFullYear()
    } years`;
}
function calculateRatio(
    followers,
    following
) {

    if (!following) {
        return followers;
    }

    return (
        followers / following
    ).toFixed(2);
}
async function copyProfileUrl() {

    const url =
        document.querySelector(
            "#profileLink"
        ).href;

    await navigator.clipboard.writeText(
        url
    );
}

const reposCard =
    document.querySelector(
        "#reposCard"
    );

const reposContainer =
    document.querySelector(
        "#reposContainer"
    );

    async function loadRepositories(
    username
) {

    const response =
        await fetch(
            `https://api.github.com/users/${username}/repos`
        );

    const repos =
        await response.json();

    const sortedRepos =
        repos
            .sort(
                (
                    a,
                    b
                ) =>
                    b.stargazers_count -
                    a.stargazers_count
            )
            .slice(0, 6);

    renderRepositories(
        sortedRepos
    );
}

function renderRepositories(
    repos
) {

    reposCard.classList.remove(
        "hidden"
    );

    reposContainer.innerHTML =
        repos.map(repo => `

<div class="repo-card">

    <h3>
        ${repo.name}
    </h3>

    <p>
        ${
            repo.description ??
            "No description"
        }
    </p>

    <div class="repo-meta">

        <span class="repo-badge">
            ${repo.language ?? "Unknown"}
        </span>

        <span class="repo-badge">
            ⭐ ${repo.stargazers_count}
        </span>

        <span class="repo-badge">
            🍴 ${repo.forks_count}
        </span>

    </div>

    <a
        href="${repo.html_url}"
        target="_blank"
        class="repo-link"
    >
        Open Repository
    </a>

</div>

`).join("");
}