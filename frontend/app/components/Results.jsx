import React, { Component } from 'react';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';

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
        // TODO: handle data correctly
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
                    <div className="header">
                        <h1 className="logo"><a href="#">SimpleSTV</a></h1>
                        <div className="separator">&nbsp;</div>
                        <h1>Viewing results</h1>
                    </div>
                    <div className="content">
                        <div className="ballot-wrapper">
                            ( * results placeholder * )
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
