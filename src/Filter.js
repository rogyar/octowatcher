import React, {Component} from 'react';
import {Button, ButtonGroup} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";

/**
 * Represents Github issues filter
 */
class Filter extends Component {

    filters = {
        pr : {title: 'PRs', selected: true},
        issues: {title: 'Issues', selected: true},
        created: {title: 'Created', selected: true},
        assigned: {title: 'Assigned', selected: false}
    };

    constructor(props) {
        super(props);

        this.toggleFilter = this.toggleFilter.bind(this);
    }

    /**
     * Collects selected filters, convert to params for passing to API
     */
    mapFiltersToParams() {
        /* The problem is Github does not support OR conditions for the time being
           that's why we need such workarounds.
         */
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

        if (this.filters.assigned.selected) {
            params.push(`assignee:${this.props.username}`);
        }

        if (this.filters.created.selected && !this.filters.assigned.selected) {
            params.push(`author:${this.props.username}`);
        }

        return params;
    }

    /**
     * Validates filter selection and toggles the corresponding filter
     *
     * @param {string} filterType
     * @param {class} filter
     */
    toggleFilter(filterType, filter) {
        let changed = false;

        if (filter.selected === true) { // Process unselect operation
            if (filterType === 'pr') { // Allow unselect PR only when issues filter is selected
                if (this.filters.pr.selected && this.filters.issues.selected) {
                    this.filters.pr.selected = !filter.selected
                    changed = true;
                }
            } else if (filterType === 'issues') { // Allow unselect Issues only when PR filter is selected
                if (this.filters.issues.selected && this.filters.pr.selected) {
                    this.filters.issues.selected = !filter.selected
                    changed = true;
                }
            } else if (filterType === 'created') { // Allow unselect Created only when Assignee filter is selected
                if (this.filters.created.selected && this.filters.assigned.selected) {
                    this.filters.created.selected = !filter.selected
                    changed = true;
                }
            } else if (filterType === 'assigned') { // The Assigned filter has no dependency on other filters
                this.filters.assigned.selected = !filter.selected
                changed = true;
            }
        } else { // Process select operations
            filter.selected = !filter.selected
            changed = true;
        }

        if (changed) {
            const params = this.mapFiltersToParams();
            this.props.updateParent(params); // Update search query in parent component
        }
    }

    render() {
        const filterButtons = Object.entries(this.filters).map(([key, filter]) =>
            <Button key={key} variant={filter.selected === true ? 'primary' : 'secondary'} onClick={() => this.toggleFilter(key, filter)}>{filter.title}</Button>
        );
        const navbarFilter = <Nav className="mr-auto"><ButtonGroup>{filterButtons}</ButtonGroup></Nav>;

        return (navbarFilter);
    }
}

export default Filter;