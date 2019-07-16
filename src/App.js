import React, {Component} from 'react';
import { fetchIssues } from './Issue/fetchIssues';
import StorageProcessor from './Storage/StorageProcessor';
import { Button } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { connect } from 'react-redux';
import { setLoading, unsetLoading } from "./action";
import GithubCard from "./GithubCard";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Filter from './Filter';

class App extends Component {
    state = {
        username: null,
        queryParams: [],
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
        this.getGithubIssues = this.getGithubIssues.bind(this);
        this.storageProcessor = new StorageProcessor();
        let storedUsername = this.storageProcessor.getUsername();

        if (storedUsername !== null) {
            this.getGithubIssues([`author:${storedUsername}`]);
        }
    }

    setUsername(event) {
        event.preventDefault();
        let username = this.usernameInput.value;
        this.storageProcessor.setUsername(username);

        // FIXME: should not be called within scope of current function
        this.getGithubIssues([`author:${username}`]);
    }

    getUsername() {
        return this.storageProcessor.getUsername();
    }

    getGithubIssues(params) {
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

    logout() {
        this.storageProcessor.deleteUsername(this.state.username);
        this.setState({username: null, issues: []});
    }

    render() {
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
                    { this.getUsername() ? <Filter updateParent={this.getGithubIssues} username={this.getUsername()}/> : null }
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