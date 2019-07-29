import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";

/**
 * Represents login form
 */
class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

    login(event) {
        event.preventDefault();
        const username = this.usernameInput.value;

        this.props.setUsername(username);
    }

    render() {
        return (
            <Nav className="justify-content-center mr-auto">
                <Form onSubmit={this.login} className="justify-content-center">
                    <Form.Group>
                        <Form.Label>GitHub Username:</Form.Label>
                        <Form.Control ref={el => this.usernameInput = el} placeholder="Username"/>
                    </Form.Group>
                    <Button variant="primary" type="submit">Go</Button>
                </Form>
            </Nav>
        );
    }
}

export default LoginForm;