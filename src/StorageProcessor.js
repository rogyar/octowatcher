const APP_PREFIX = 'octowatcher';

class StorageProcessor {
    // TODO: remove issues from storage if they are not exist
    processIssues(issues) {
        const username = this.getUsername();
        issues.forEach(issue => {
            const storedItemPath = `${APP_PREFIX}_${username}_issue_${issue.id}`;
            const storedIssueData = sessionStorage.getItem(storedItemPath);

            if (storedIssueData !== null) {
                const storedIssue = JSON.parse(storedIssueData)
                if (storedIssue.updated_at === issue.updated_at) {
                    issue.updated = storedIssue.updated;
                    return; // Continue
                }
            }

            let newStoredIssueData = JSON.stringify({updated: true, updated_at: issue.updated_at});
            issue.updated = true;
            sessionStorage.setItem(storedItemPath, newStoredIssueData)
        })
    }

    toggleIssueStatus(issue) {
        const username = this.getUsername();
        const storedItemPath = `${APP_PREFIX}_${username}_issue_${issue.id}`;
        const storedIssueData = sessionStorage.getItem(storedItemPath);
        console.log(storedItemPath);
        if (storedIssueData !== null) {
            let storedIssue = JSON.parse(storedIssueData);
            storedIssue.updated = !storedIssue.updated;
            issue.updated = storedIssue.updated;
            sessionStorage.setItem(storedItemPath, JSON.stringify(storedIssue));

            return issue.updated;
        }
    }

    setUsername(username) {
        const storedItemPath = `${APP_PREFIX}_username`;
        sessionStorage.setItem(storedItemPath, username)
    }

    getUsername() {
        const storedItemPath = `${APP_PREFIX}_username`;
        return sessionStorage.getItem(storedItemPath);
    }

    deleteUsername() {
        const storedItemPath = `${APP_PREFIX}_username`;
        sessionStorage.removeItem(storedItemPath);
    }
}

export default StorageProcessor;