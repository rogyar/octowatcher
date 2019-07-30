import React, { Component } from 'react';
import StorageProcessor from './Storage/StorageProcessor'
import {Card, Spinner} from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import { getIssueTimeline } from "./Issue/getIssueTimeline"

/**
 * Represents Github issue card
 */
class GithubCard extends Component
{
    state = {
        updated: true,
        isLoading: false,
        timelineExpanded: false,
        timelineRecords: [],
    };

    /**
     * @type {null|StorageProcessor}
     */
    storageProcessor = null;

    constructor(props) {
        super(props);

        this.toggleTimeline = this.toggleTimeline.bind(this);
        this.toggleIssueUpdateStatus = this.toggleIssueUpdateStatus.bind(this);
        this.storageProcessor = new StorageProcessor();
    }

    /**
     * Opens/closes the issue timeline.
     * If the timeline has not been previously loaded,
     * fetches the records from remote system
     */
    toggleTimeline() {
        let self = this;
        if (this.state.timelineExpanded === false) {
            if (this.state.timelineRecords.length === 0) { // Timeline records were not loaded previously
                this.setState({ isLoading: true });
                getIssueTimeline(this.props.issue).then((timelineRecords) => {
                    self.setState({ timelineRecords: timelineRecords, isLoading: false });
                    self.setState({ timelineExpanded: true });
                });
            }
        } else {
            this.setState({timelineExpanded: false});
        }
    }

    /**
     * Assigns "updated" status for the issue according to the
     * saved value in the issue
     *
     * @param {boolean} isIssueUpdated
     */
    assignUpdatedStatus(isIssueUpdated) {
        if (isIssueUpdated !== this.state.updated) {
            this.setState({updated: isIssueUpdated})
        }
    }

    /**
     * Toggles "updated" status of the issue
     */
    toggleIssueUpdateStatus() {
        this.setState({updated: this.storageProcessor.toggleIssueStatus(this.props.issue)});
    }

    render() {
        let updatedIcon = this.state.updated === true ? '✅' : '☑️';

        this.assignUpdatedStatus(this.props.issue.updated);
        const timelineRecords = this.state.timelineRecords.map((item, key) =>
            <ul key={key}>
                <li><b>Author: </b>{item.author}</li>
                <li><b>Date: </b>
                    {new Intl.DateTimeFormat('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(item.created_at))}
                </li>
                <li><b>Type: </b>{item.type}</li>
                { item.body ? <li>{item.body}</li> : null }
                { item.event ? <li><b>Event: </b>{item.event}</li> : null }
                { item.label ? <li><b>Label: </b>{item.label}</li> : null }
            </ul>
        );

        const assignees = this.props.issue.assignees.length > 0 ?
            this.props.issue.assignees.map(assignee => assignee.login) : [];

        return (
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>{this.props.issue.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            <p>Project: {this.props.issue.repository_url.substring(this.props.issue.repository_url.lastIndexOf('/') + 1)}</p>
                            <p>Author: {this.props.issue.user.login}</p>
                        </Card.Subtitle>
                        <ListGroup variant="flush">
                            <ListGroup.Item><b>Updated:</b> <span style={{cursor: "pointer"}} onClick={this.toggleIssueUpdateStatus}>{updatedIcon}</span></ListGroup.Item>
                            <ListGroup.Item><b>Updated at: </b>
                                {
                                    new Intl.DateTimeFormat('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.issue.updated_at))
                                }
                            </ListGroup.Item>
                            <ListGroup.Item><a target="_blank" href={this.props.issue.html_url}>{this.props.issue.html_url}</a></ListGroup.Item>
                            <ListGroup.Item><b>Assignees:</b> {assignees.join(', ')}</ListGroup.Item>
                        </ListGroup>
                        <div>
                            <Button variant="dark" onClick={this.toggleTimeline}>Toggle timeline</Button>
                            <Spinner style={{display: this.state.isLoading === true ? 'inline-block' : 'none'}} animation="border"/>
                            <div style={{display: this.state.timelineExpanded === true ? 'block' : 'none'}}>
                                {timelineRecords}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}

export default GithubCard