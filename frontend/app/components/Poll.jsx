import React, { Component } from 'react';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import PollChoices from './PollChoices.jsx';

export default class Poll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pollId: props.routeParams.pollId,
            key: props.routeParams.key,
            pollData: null,
        };
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
        PollActions.read(this.state.pollId, this.state.key);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
        let state = this.state;
        state.pollData = data;
        this.setState(state);
    }

    render() {
        if (!this.state.pollData) {
            return (<div>Loading...</div>);
        }

        if (this.state.pollData.valid) {
            return (
                <div>
                    <div className="header">
                        <h1 className="logo"><a href="#">SimpleSTV</a></h1>
                        <div className="separator">&nbsp;</div>
                        <h1>Viewing poll: {this.state.pollData.poll_data.id}</h1>
                    </div>
                    <div className="content">
                        <div className="ballot-wrapper">
                            <h1>{this.state.pollData.poll_data.ballot.question}</h1>
                            <PollChoices choices={this.state.pollData.poll_data.ballot.choices} />
                            <br />
                            <a href="#"><div className="submit-button">submit</div></a>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            console.warn(JSON.stringify(this.state.pollData));
            return <div>Error {this.state.pollData.status_code}</div>;
        }
    }
};
