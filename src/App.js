import React, {Component} from 'react';
import { fetchIssues } from './Issue/fetchIssues';
import StorageProcessor from './Storage/StorageProcessor';
import { Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { connect } from 'react-redux';
import { setLoading, unsetLoading } from "./action";
import GithubCard from "./GithubCard";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";

class App extends Component {
    state = {
        username: null,
        issues: []
    };

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
        this.props.setLoading();
        fetchIssues(params)
            .then(issues => {
                this.props.unsetLoading();
                this.processIssues(issues);
            });
    }

    processIssues(issues, username) {
        let renderedIssues = [];

        this.props.setLoading();

        if (issues.length > 0) {
            this.storageProcessor.processIssues(issues);
            issues.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            console.log(issues);
            issues.forEach(issue => {
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
                    events_url: issue.events_url,
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

        if (filter.selected === true) { // Process unselect operation
            if (filterType === 'pr') { // Allow unselect PR only when issues filter is selected
                if (this.filters.pr.selected && this.filters.issues.selected) {
                    this.filters.pr.selected = !filter.selected
                }
            } else if (filterType === 'issues') { // Allow unselect Issues only when PR filter is selected
                if (this.filters.issues.selected && this.filters.pr.selected) {
                    this.filters.issues.selected = !filter.selected
                }
            } else if (filterType === 'created') { // Allow unselect Created only when Assignee filter is selected
                if (this.filters.created.selected && this.filters.assigned.selected) {
                    this.filters.created.selected = !filter.selected
                }
            } else if (filterType === 'assigned') { // The Assigned filter has no dependency on other filters
                this.filters.assigned.selected = !filter.selected
            }
        } else { // Process select operations
            filter.selected = !filter.selected
        }

        this.getGithubIssues();
    }

    logout() {
        this.storageProcessor.deleteUsername(this.state.username);
        this.setState({username: null, issues: []});
    }

    render() {
        const filterButtons = Object.entries(this.filters).map(([key, filter]) =>
            <Button key={key} variant={filter.selected === true ? 'primary' : 'secondary'} onClick={() => this.toggleFilter(key, filter)}>{filter.title}</Button>
        );
        const navbarFilter = <Nav className="mr-auto"><ButtonGroup>{filterButtons}</ButtonGroup></Nav>;
        const logoutButton = <Nav className="justify-content-end">
            <Button variant="info" onClick={this.logout}>Logout</Button>
        </Nav>;
        const loginForm =  <Nav className="justify-content-center mr-auto">
            <Form onSubmit={this.setUsername} className="justify-content-center">
                <Form.Group>
                    <Form.Label>GitHub Username:</Form.Label>
                    <Form.Control ref={el => this.usernameInput = el} placeholder="Username"/>
                </Form.Group>
                <Button variant="primary" type="submit">Go</Button>
            </Form>
        </Nav>;

        const githubEntries = this.state.issues.map((item, key) =>
            <GithubCard key={key} issue={item}/>
        );

        return (
            <Container>
                <Navbar>
                    { !this.getUsername() ? loginForm : null }
                    { this.getUsername() ? navbarFilter : null }
                    { this.getUsername() ? logoutButton : null }
                </Navbar>
                <Spinner style={{display: this.props.isLoading === true ? 'inline-block' : 'none'}} animation="border"/>
                <Row className="justify-content-md-center">
                    {githubEntries}
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