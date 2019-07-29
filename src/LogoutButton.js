import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

/**
 * Represents logout button
 */
class LogoutButton extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.logout();
    }

    render() {
        return (
            <Nav className="justify-content-end">
                <Button variant="info" onClick={this.logout}>Logout</Button>
            </Nav>
        );
    }
}

export default LogoutButton;