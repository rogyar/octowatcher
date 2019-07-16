const APP_PREFIX = 'octowatcher';

/**
 * Provides entry points for working with issues storage
 */
class StorageProcessor {
    // TODO: remove issues from storage if they are not exist

    /**
     * Stores issue data in the storage
     *
     * @param {array} issues
     */
    processIssues(issues) {
        const username = this.getUsername();
        issues.forEach(issue => {
            const storedItemPath = `${APP_PREFIX}_${username}_issue_${issue.id}`;
            const storedIssueData = localStorage.getItem(storedItemPath);

            if (storedIssueData !== null) {
                const storedIssue = JSON.parse(storedIssueData);
                if (storedIssue.updated_at === issue.updated_at) {
                    issue.updated = storedIssue.updated;
                    return; // Continue
                }
            }

            let newStoredIssueData = JSON.stringify({updated: true, updated_at: issue.updated_at});
            issue.updated = true;
            localStorage.setItem(storedItemPath, newStoredIssueData)
        })
    }

    /**
     * Toggles issue status (updated = true|false)
     *
     * @param {class} issue
     * @returns {boolean|*}
     */
    toggleIssueStatus(issue) {
        const username = this.getUsername();
        const storedItemPath = `${APP_PREFIX}_${username}_issue_${issue.id}`;
        const storedIssueData = localStorage.getItem(storedItemPath);
        if (storedIssueData !== null) {
            let storedIssue = JSON.parse(storedIssueData);
            storedIssue.updated = !storedIssue.updated;
            issue.updated = storedIssue.updated;
            localStorage.setItem(storedItemPath, JSON.stringify(storedIssue));

            return issue.updated;
        }
    }

    /**
     * Saves the specified username to the storage
     *
     * @param {string} username
     */
    setUsername(username) {
        const storedItemPath = `${APP_PREFIX}_username`;
        localStorage.setItem(storedItemPath, username)
    }

    /**
     * Returns username stored in the storage
     *
     * @returns {string}
     */
    getUsername() {
        const storedItemPath = `${APP_PREFIX}_username`;
        return localStorage.getItem(storedItemPath);
    }

    /**
     * Deletes user information from the storage
     */
    deleteUsername() {
        const storedItemPath = `${APP_PREFIX}_username`;
        localStorage.removeItem(storedItemPath);
    }
}

export default StorageProcessor;