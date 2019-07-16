/**
 * Fetches and groups timeline records (comments, events) for
 * the specified issue
 */

import { fetchComments } from "./fetchComments";
import { fetchEvents } from "./fetchEvents";

const recordsLimit = 4;

export const getIssueTimeline = async (issue) => {
    const records = await fetchRecords(issue);
    return buildTimeline(records);
};

/**
 * Fetches comments and events for the specified issue
 *
 * @param {class} issue
 * @returns {Promise<T[]>}
 */
const fetchRecords = async (issue) => {
    const comments = await fetchComments(issue, recordsLimit);
    const events = await fetchEvents(issue, recordsLimit);

    return Array.prototype.concat(comments).concat(events);
};

/**
 * Groups the comments and events of the specified issue
 *
 * @param {array} records
 * @returns {array}
 */
const buildTimeline = (records) => {
    if (records.length > 0) {
        records.forEach(record => {
            if (record.actor !== undefined) {
                record.type = 'event';
            } else {
                record.type = 'comment';
            }
        })
    }
    records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return records;
};