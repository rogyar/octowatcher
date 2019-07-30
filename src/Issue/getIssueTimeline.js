/**
 * Fetches and groups timeline records (comments, events) for
 * the specified issue
 */

import { fetchComments } from "./fetchComments";
import { fetchEvents } from "./fetchEvents";
import { fetchCommits } from "./fetchCommits";

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
    const commits = await fetchCommits(issue, recordsLimit);

    return Array.prototype.concat(comments).concat(events).concat(commits);
};

/**
 * Groups the comments and events of the specified issue
 *
 * @param {array} records
 * @returns {array}
 */
const buildTimeline = (records) => {
    records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return records;
};