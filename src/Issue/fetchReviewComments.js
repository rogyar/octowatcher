/**
 * Fetches review comments for the specified pull request from Github API
 *
 * @param {class} issue
 * @param {int} limit
 * @returns {Promise<any | never>}
 */

export const fetchReviewComments = (issue, limit = 4) => {
    if (issue.pull_request === undefined) {
        return new Promise(resolve => []);
    }

    const reviewCommentsUrl = getReviewCommentsUrl(issue.pull_request.url);

    return fetch(reviewCommentsUrl, {method: 'GET'})
        .then(response => response.json())
        .then(comments => {
            comments.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            comments = comments.slice(0, limit);

            return mapReviewCommentsData(comments);
        });
};

const getReviewCommentsUrl = pullRequestUrl => {
    return `${pullRequestUrl}/comments`
};

/**
 * Converts the raw data into the formatted set of data
 *
 * @param {Array} comments
 * @returns {Array}
 */
const mapReviewCommentsData = comments => {
    let mappedComments = [];

    comments.forEach(comment => {
        let mappedCommit = {
            type: "review comment",
            created_at: comment.created_at,
            author: comment.user.login,
            avatar: comment.user.avatar_url,
            body: comment.body
        };
        mappedComments.push(mappedCommit);
    });

    return mappedComments;
};