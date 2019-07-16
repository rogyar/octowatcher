/**
 * Fetches events for the specified issue from Github API
 *
 * @param {class} issue
 * @param {int} limit
 * @returns {Promise<any | never>}
 */

export const fetchEvents = (issue, limit = 4) => {
    return fetch(issue.events_url, {method: 'GET'})
        .then(response => response.json())
        .then(events => {
            events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return events.slice(0, limit);
        });
};