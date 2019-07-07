import React, { Component } from 'react';
import StorageProcessor from './StorageProcessor'
import {Card, Spinner} from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class GithubCard extends Component
{
    state = {
        updated: true,
        isLoading: false,
        commentsExpanded: false,
        comments: []
    };

    /**
     * @type {null|StorageProcessor}
     */
    storageProcessor = null;

    constructor(props) {
        super(props);

        this.toggleComments = this.toggleComments.bind(this);
        this.toggleIssueUpdateStatus = this.toggleIssueUpdateStatus.bind(this);
        this.storageProcessor = new StorageProcessor();
      }

    toggleComments() {
        if (this.state.commentsExpanded === false) {
            if (this.state.comments.length === 0) {
                this.loadComments();
            }
            this.setState({commentsExpanded: true});
        } else {
            this.setState({commentsExpanded: false});
        }
    }

    loadComments() {
        const recentCommentsNumber = 4;

        this.setState({ isLoading: true });

        fetch(this.props.issue.comments_url, {method: 'GET'})
        .then(response => response.json())
        .then(comments => {
            comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            comments = comments.slice(0, recentCommentsNumber);
            this.setState({
                comments: comments,
                isLoading: false,
            });
        });
    }

    assignUpdatedStatus(isIssueUpdated) {
        if (isIssueUpdated !== this.state.updated) {
            this.setState({updated: isIssueUpdated})
        }
    }

    toggleIssueUpdateStatus() {
        this.setState({updated: this.storageProcessor.toggleIssueStatus(this.props.issue)});
    }

    render() {
        this.assignUpdatedStatus(this.props.issue.updated);

        let updatedIcon;
        updatedIcon = this.state.updated === true ? '✅' : '☑️';

        const comments = this.state.comments.map((item, key) =>
            <ul key={key}>
                <li><b>Author:</b> {item.user.login}</li>
                <li>{item.body}</li>
            </ul>
        );

        return (
            <Card style={{width: '30rem'}}>
                <Card.Body>
                    <Card.Title>{this.props.issue.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        <p>Project: {this.props.issue.project}</p>
                        <p>Author: {this.props.issue.author_name}</p>
                    </Card.Subtitle>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Updated:</b> <a  onClick={this.toggleIssueUpdateStatus}>{updatedIcon}</a></ListGroup.Item>
                        <ListGroup.Item><b>Updated at: </b>{this.props.issue.updated_at}</ListGroup.Item>
                        <ListGroup.Item><a target="_blank" href={this.props.issue.url}>{this.props.issue.url}</a></ListGroup.Item>
                        <ListGroup.Item><b>Assignees:</b> {this.props.issue.assignees.join(', ')}</ListGroup.Item>
                    </ListGroup>
                    <div>
                        <Button variant="dark" onClick={this.toggleComments}>Comments</Button>
                        <Spinner style={{display: this.state.isLoading === true ? 'inline-block' : 'none'}} animation="border"/>
                        <div style={{display: this.state.commentsExpanded === true ? 'block' : 'none'}}>
                            {comments}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}

export default GithubCard