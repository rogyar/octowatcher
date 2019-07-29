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
import Filter from './Filter';
import LoginForm from './LoginForm';

class App extends Component {
    state = {
        username: null,
        issues: []
    };

    defaultQueryParams = ['is:open', 'archived:false'];

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
            this.getGithubIssues(Array.prototype.concat(this.defaultQueryParams, [`author:${storedUsername}`]));
        }
    }

    setUsername(username) {
        console.log("setting username");
        this.storageProcessor.setUsername(username);

        // FIXME: should not be called within scope of current function
        this.getGithubIssues(Array.prototype.concat(this.defaultQueryParams, [`author:${username}`]));
    }

    getUsername() {
        if (!this.storageProcessor.getUsername()) {
            console.log("no username");
        }
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

    processIssues(issues) {
        this.props.setLoading();

        if (issues.length > 0) {
            this.storageProcessor.processIssues(issues);
            this.setState( {issues: issues });
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

        const githubEntries = this.state.issues.map((item, key) =>
            <GithubCard key={key} issue={item}/>
        );

        return (
            <Container>
                <Navbar>
                    { !this.getUsername() ? <LoginForm setUsername={this.setUsername}/> : null }
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