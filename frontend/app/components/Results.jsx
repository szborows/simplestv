import React, { Component } from 'react';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import Header from './Header.jsx';

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: props.routeParams.secret,
            pollResultsData: null,
        };
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
        // TODO: read results from the server
        PollActions.getResults(this.state.secret);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
        let state = this.state;
        state.pollResultsData = data;
        this.setState(state);
    }

    render() {
        if (!this.state.pollResultsData) {
            return (<div>Loading...</div>);
        }

        if (this.state.pollResultsData.valid) {
            return (
                <div>
                    <Header text={"Results for poll #" + this.state.pollResultsData.poll_data.poll.id} />
                    <div className="content">
                        <div className="ballot-wrapper">
                            poll {this.state.pollResultsData.poll_data.poll.id}<br />
                            question: {this.state.pollResultsData.poll_data.poll.ballot.question}<br />

                            # recipients: {this.state.pollResultsData.poll_data.results.num_recipients}<br />
                            total votes: {this.state.pollResultsData.poll_data.results.total_votes}<br />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            console.warn(JSON.stringify(this.state.pollResultsData));
            return <div>Error {this.state.pollResultsData.status_code}</div>;
        }
    }
};
