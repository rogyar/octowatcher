import React, {Component} from 'react';
import { fetchIssues } from './Issue/fetchIssues';
import StorageProcessor from './Storage/StorageProcessor';
import { Container } from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { connect } from 'react-redux';
import { setLoading, unsetLoading, addMessage } from "./action";
import GithubCard from "./GithubCard";
import Navbar from "react-bootstrap/Navbar";
import Filter from './Filter';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import Messages from "./Messages";

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
        this.setState({ username: username});
        this.storageProcessor.setUsername(username);

        // FIXME: should not be called within scope of current function
        this.getGithubIssues(Array.prototype.concat(this.defaultQueryParams, [`author:${username}`]));
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
            }).catch((error) => {
                this.props.addMessage(error.message);
                this.props.unsetLoading();
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
        const githubEntries = this.state.issues.map((item, key) =>
            <GithubCard key={key} issue={item}/>
        );

        return (
            <Container>
                <Messages/>
                <Navbar>
                    { !this.getUsername() ? <LoginForm setUsername={this.setUsername}/> : null }
                    { this.getUsername() ? <Filter updateParent={this.getGithubIssues} username={this.getUsername()}/> : null }
                    { this.getUsername() ? <LogoutButton logout={this.logout}/> : null }
                </Navbar>
                <Spinner style={{display: this.props.isLoading === true ? 'inline-block' : 'none'}} animation="border"/>
                <Container className="justify-content-md-center">
                    {githubEntries}
                </Container>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.isLoading
});

const mapDispatchToProps = dispatch => ({
    setLoading: () => dispatch(setLoading()),
    unsetLoading: () => dispatch(unsetLoading()),
    addMessage: message => dispatch(addMessage(message))
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;