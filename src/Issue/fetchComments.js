/**
 * Fetches comments for the specified issue from Github API
 *
 * @param {class} issue
 * @param {int} limit
 * @returns {Promise<any | never>}
 */

export const fetchComments = (issue, limit = 4) => {
    return fetch(issue.comments_url, {method: 'GET'})
        .then(response => response.json())
        .then(comments => {
            comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            comments = comments.slice(0, limit);

            return mapCommentsData(comments);
        });
};

/**
 * Converts the raw data into the formatted set of data
 *
 * @param {Array} comments
 * @returns {Array}
 */
const mapCommentsData = comments => {
    let mappedComments = [];

    comments.forEach(comment => {
        let mappedComment = {
            type: "comment",
            created_at: comment.created_at,
            author: comment.user.login,
            avatar: comment.user.avatar_url,
            body: comment.body
        };
        mappedComments.push(mappedComment);
    });

    return mappedComments;
};