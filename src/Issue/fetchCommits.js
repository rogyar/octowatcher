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
        .then(response => response.json())
        .then(commits => {
            let mappedCommits =  mapCommitsData(commits);
            mappedCommits.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return mappedCommits.slice(0, limit);
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
            user: { login: commit.author.login },
            body: commit.commit.message
        };
        mappedCommits.push(mappedCommit);
    });

    return mappedCommits;
};