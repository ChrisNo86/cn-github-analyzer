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
    const languagesCard =
    document.querySelector(
        "#languagesCard"
    );

const languagesContainer =
    document.querySelector(
        "#languagesContainer"
    );
    const featuredRepoCard =
    document.querySelector(
        "#featuredRepoCard"
    );

const featuredRepo =
    document.querySelector(
        "#featuredRepo"
    );

    const scoreCard =
    document.querySelector(
        "#scoreCard"
    );

const scoreValue =
    document.querySelector(
        "#scoreValue"
    );

const scoreFill =
    document.querySelector(
        "#scoreFill"
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

    } catch (error) {

    console.error(
        "GitHub Analyzer Error:",
        error
    );

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
    renderDeveloperScore(
    data
);
}

function loadExample() {

    usernameInput.value =
        "ChrisNo86";

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

    reposCard?.classList.add(
        "hidden"
    );

    languagesCard?.classList.add(
        "hidden"
    );

    featuredRepoCard?.classList.add(
        "hidden"
    );
    scoreCard?.classList.add(
    "hidden"
);
document.querySelector(
    "#name"
).textContent = "-";

document.querySelector(
    "#login"
).textContent = "-";

document.querySelector(
    "#bio"
).textContent = "-";

document.querySelector(
    "#location"
).textContent = "-";

document.querySelector(
    "#avatar"
).src = "";

scoreValue &&
(
    scoreValue.textContent = "0"
);

scoreFill &&
(
    scoreFill.style.width = "0%"
);
document
    .querySelector("#errorCard")
    ?.classList.add(
        "hidden"
    );

    resetStatistics();
}

function resetStatistics() {

    const ids = [

        "repos",
        "followers",
        "following",
        "created",
        "accountAge",
        "ratio",
        "statusBadge"

    ];

    ids.forEach(id => {

        document.querySelector(
            `#${id}`
        ).textContent = "-";

    });
}

function formatDate(date) {

    return new Date(
        date
    ).toLocaleDateString();
}

function showError() {

    document
        .querySelector("#errorCard")
        ?.classList.remove(
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
function calculateAccountYears(
    date
) {

    const created =
        new Date(date);

    const today =
        new Date();

    return Math.max(
        1,
        today.getFullYear() -
        created.getFullYear()
    );
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
    renderLanguages(
    repos
);
renderFeaturedRepository(
    repos
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

function renderLanguages(
    repos
) {

    const languages = {};

    repos.forEach(repo => {

        const language =
            repo.language;

        if (!language) {
            return;
        }

        languages[language] =
            (languages[language] || 0) + 1;
    });

    const total =
        Object.values(
            languages
        ).reduce(
            (
                sum,
                value
            ) => sum + value,
            0
        );

    languagesCard.classList.remove(
        "hidden"
    );

    languagesContainer.innerHTML =
        Object.entries(
            languages
        )
        .sort(
            (
                a,
                b
            ) =>
                b[1] - a[1]
        )
        .map(
            (
                [language, count]
            ) => {

                const percent =
                    Math.round(
                        count /
                        total *
                        100
                    );

                return `
<div class="language-row">

    <div class="language-header">

        <span>
            ${language}
        </span>

        <span>
            ${percent}%
        </span>

    </div>

    <div class="language-bar">

        <div
            class="language-fill"
            style="
                width:${percent}%;
                background:${getLanguageColor(language)}
            "
        ></div>

    </div>

</div>
`;
            }
        )
        .join("");
}

function getLanguageColor(
    language
) {

    const colors = {

        JavaScript:
            "#f7df1e",

        TypeScript:
            "#3178c6",

        HTML:
            "#e34f26",

        CSS:
            "#1572b6",

        Python:
            "#3776ab",

        "C#":
            "#68217a",

        Java:
            "#f89820",

        PHP:
            "#777bb4",

        C:
            "#a8b9cc",

        "C++":
            "#00599c"
    };

    return (
        colors[language] ??
        "#00d4ff"
    );
}

function renderFeaturedRepository(
    repos
) {

    if (!repos.length) {
        return;
    }

    const mostStarred =
        repos.reduce(
            (
                best,
                current
            ) => {

                return current
                    .stargazers_count >
                    best
                        .stargazers_count
                    ? current
                    : best;

            }
        );

    featuredRepoCard
        .classList.remove(
            "hidden"
        );

    featuredRepo.innerHTML = `
<div class="featured-repo">

    <h3>
        ${mostStarred.name}
    </h3>

    <p>
        ${
            mostStarred.description ??
            "No description"
        }
    </p>

    <div class="featured-stats">

        <span class="featured-badge">
            ⭐ ${mostStarred.stargazers_count}
        </span>

        <span class="featured-badge">
            🍴 ${mostStarred.forks_count}
        </span>

        <span class="featured-badge">
            ${
                mostStarred.language ??
                "Unknown"
            }
        </span>

    </div>

    <a
        href="${mostStarred.html_url}"
        target="_blank"
        class="featured-link"
    >
        Open Repository
    </a>

</div>
`;
}

function renderDeveloperScore(
    data
) {

    let score = 0;

    score += Math.min(
        data.public_repos,
        40
    );

    score += Math.min(
        data.followers,
        30
    );

    score += Math.min(
        calculateAccountYears(
            data.created_at
        ) * 5,
        20
    );

    score += Math.min(
        data.following,
        10
    );

    score =
        Math.min(
            score,
            100
        );

    scoreCard.classList.remove(
        "hidden"
    );

    scoreValue.textContent =
        score;

    scoreFill.style.width =
        `${score}%`;
}