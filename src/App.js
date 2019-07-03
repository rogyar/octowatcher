import React, {Component} from 'react';
import GithubCards from "./GithubCards"
import searchIssues from './searchIssuesService';
import StorageProcessor from './StorageProcessor';
import { Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { connect } from 'react-redux';
import { setLoading, unsetLoading } from "./action";

class App extends Component {
    state = {
        username: null,
        issues: []
    };

    // filters = [
    //     {title: 'PRs', query: 'is:pr', selected: true},
    //     {title: 'Issues', query: 'is:issue', selected: true},
    //     {title: 'Created', query: 'is:issue', selected: true},
    //     {title: 'Assigned', query: 'is:issue', selected: true},
    // ];

    filters = {
        pr : {title: 'PRs', selected: true},
        issues: {title: 'Issues', selected: true},
        created: {title: 'Created', selected: true},
        assigned: {title: 'Assigned', selected: false}
    };

    /**
     * @type {StorageProcessor|null}
     */
    storageProcessor = null;

    constructor(props) {
        super(props);

        this.setUsername = this.setUsername.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.storageProcessor = new StorageProcessor();
        let storedUsername = this.storageProcessor.getUsername();

        if (storedUsername !== null) {
            this.getGithubIssues();
        }
    }

    setUsername(event) {
        event.preventDefault();
        let username = this.usernameInput.value;
        this.storageProcessor.setUsername(username);
        this.getGithubIssues()
    }

    /**
     * Collects selected filters, convert to params for passing to API
     */
    mapFiltersToParams() {
        let params = [
            'is:open',
            'archived:false'
        ];

        if (this.filters.pr.selected) {
            if (!this.filters.issues.selected) {
                params.push('is:pr')

            }
        }

        if (this.filters.issues.selected) {
            if (!this.filters.pr.selected) {
                params.push('is:issue')
            }
        }

        if (this.filters.created.selected) {
            params.push(`author:${this.getUsername()}`);
        }

        if (this.filters.assigned.selected) {
            params.push(`assignee:${this.getUsername()}`);
        }

        return params;
    }

    getUsername() {
        return this.storageProcessor.getUsername();
    }

    getGithubIssues() {
        const params = this.mapFiltersToParams();

        console.log(params);

        searchIssues(params, this.props.setLoading, this.props.unsetLoading)
            .then(issues => this.processIssues(issues));
    }

    processIssues(issues, username) {
        let renderedIssues = [];

        this.props.setLoading();

        if (issues.items.length > 0) {
            this.storageProcessor.processIssues(issues.items);
            issues.items.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            issues.items.forEach(issue => {
                let assignees = issue.assignees.length > 0 ? issue.assignees.map(assignee => assignee.login) : [];
                let issueInfo = {
                    id: issue.id,
                    title: issue.title,
                    url: issue.html_url,
                    author_name: issue.user.login,
                    author_avatar: issue.user.avatar_url,
                    assignees: assignees,
                    project: issue.repository_url.substring( issue.repository_url.lastIndexOf('/') + 1),
                    comments_url: issue.comments_url,
                    updated_at: new Intl.DateTimeFormat('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(issue.updated_at)),
                    updated: issue.updated
                };
                renderedIssues.push(issueInfo)
            });
            this.setState({issues: renderedIssues, username: username});
        }
        this.props.unsetLoading();
    }

    toggleFilter(filterType, filter) {

        if (filterType === 'pr') { // Allow unselect PR only when issues filter is selected
            if (!filter.selected && this.filters.issues.selected) {
                this.filters.pr.selected = !filter.selected
            }
        } else if (filterType === 'issues') { // Allow unselect Issues only when PR filter is selected
            if (!filter.selected && this.filters.pr.selected) {
                this.filters.issues.selected = !filter.selected
            }
        } else if (filterType === 'created') { // Allow unselect Created only when Assignee filter is selected
            if (!filter.selected && this.filters.assigned.selected) {
                this.filters.created.selected = !filter.selected
            }
        } else if (filterType === 'assigned') { // The Assigned filter has no dependency on other filters
            this.filters.assigned.selected = !filter.selected
        }

        this.getGithubIssues();
    }

    logout() {
        this.storageProcessor.deleteUsername(this.state.username);
        this.setState({username: null, issues: []});
    }

    render() {
        const filters = Object.entries(this.filters).map(([key, filter]) =>
            <Button key={key} variant={filter.selected === true ? 'primary' : 'secondary'} onClick={() => this.toggleFilter(key, filter)}>{filter.title}</Button>
        );
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs>
                        <header>
                            <form onSubmit={this.setUsername}
                                  style={{display: this.getUsername() !== null ? 'none' : 'inline'}}>
                                <label>
                                    GitHub Username: <input type="text" ref={el => this.usernameInput = el}/>
                                </label>
                                <button type="submit" value="Submit">Go!</button>
                            </form>
                            <Button variant="info" onClick={this.logout} style={{display: this.getUsername() !== null ? 'inline' : 'none'}}>Logout</Button>
                            <Spinner style={{display: this.props.isLoading === true ? 'inline-block' : 'none'}} animation="border"/>
                        </header>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs>
                        <div style={{display: this.getUsername() === null ? 'none' : 'inline'}}>
                            <ButtonGroup>
                                {filters}
                            </ButtonGroup>

                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs>
                        <GithubCards issues={this.state.issues}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.isLoading
});

const mapDispatchToProps = dispatch => ({
    setLoading: () => dispatch(setLoading()),
    unsetLoading: () => dispatch(unsetLoading())
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;