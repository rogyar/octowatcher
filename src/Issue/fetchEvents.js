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
            events = events.slice(0, limit);

            return mapEventsData(events);
        });
};

/**
 * Converts the raw data into the formatted set of data
 *
 * @param {Array} events
 * @returns {Array}
 */
const mapEventsData = events => {
    let mappedEvents = [];

    events.forEach(event => {
        let mappedEvent = {
            type: "event",
            created_at: event.created_at,
            author: event.actor.login,
            event: event.event
        };

        if (event.label !== undefined) {
            mappedEvent.label = event.label.name;
        }

        mappedEvents.push(mappedEvent);
    });
    console.log(mappedEvents);
    return mappedEvents;
};