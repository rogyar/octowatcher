/**
 * Fetches commits for the specified pull request from Github API
 *
 * @param {class} issue
 * @param {int} limit
 * @returns {Promise<any | never>}
 */

export const fetchCommits = (issue, limit = 4) => {
    if (issue.pull_request === undefined) {
        return new Promise(resolve => []);
    }

    const commitsUrl = getCommitsUrl(issue.pull_request.url);
    return fetch(commitsUrl, {method: 'GET'})
        .then(response => {
            if (response.status === 403) {
                throw new Error("Too many requests, try again later");
            }

            return response.json()
        })
        .then(commits => {
            commits.sort(
                (a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
            );
            commits = commits.slice(0, limit);

            return mapCommitsData(commits);
        });
};

const getCommitsUrl = pullRequestUrl => {
    return `${pullRequestUrl}/commits`
};

/**
 * Converts the raw data into the formatted set of data
 *
 * @param {Array} commits
 * @returns {Array}
 */
const mapCommitsData = commits => {
    let mappedCommits = [];

    commits.forEach(commit => {
        let mappedCommit = {
            type: "commit",
            created_at: commit.commit.author.date,
            author: commit.author.login,
            avatar: commit.author.avatar_url,
            body: commit.commit.message
        };
        mappedCommits.push(mappedCommit);
    });

    return mappedCommits;
};