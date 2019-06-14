import React, { Component } from 'react';
import GithubCard from './GithubCard';

class GithubCards extends Component
{
    state = {
        issues: []
    }

    render() {
        const issues = this.props.issues.map((item, key) =>
            <GithubCard key={key} issue={item}/>
        );
        return (
            <div>{issues}</div>
        )
    }
}

export default GithubCards