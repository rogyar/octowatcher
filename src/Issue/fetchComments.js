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
            return comments.slice(0, limit);
        });
};