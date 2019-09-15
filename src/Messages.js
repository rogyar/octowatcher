import React, {Component} from 'react';
import {connect} from "react-redux";
import {clearMessages} from "./action";
import Toast from "react-bootstrap/Toast";
import styles from './styles/message.module.css';

/**
 * Represents messages section
 */
class Messages extends Component {
    constructor(props) {
        super(props);

        this.clearMessages = this.clearMessages.bind(this);
    }

    /**
     * Removes all messages from stack
     * @returns {*}
     */
    clearMessages() {
        return this.props.clearMessages();
    }


    render() {
        const messages = this.props.messages.map((item, key) =>
            <Toast key={key} onClose={this.clearMessages}>
                <Toast.Header>
                    <strong className="mr-auto">Message</strong>
                </Toast.Header>
                <Toast.Body>{item}</Toast.Body>
            </Toast>
        );
        return (
                <div className={styles.message} style={{ position: 'fixed', top: 0, right: 0, padding: "1rem 1rem"}}>
                    {messages}
                </div>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.messages
});

const mapDispatchToProps = dispatch => ({
    clearMessages: () => dispatch(clearMessages())
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);