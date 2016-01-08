import React, { Component } from 'react';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import PollChoices from './PollChoices.jsx';
import history from '../libs/history.js';
import Header from './Header.jsx';
import Loader from 'react-loader';

export default class Poll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pollId: props.routeParams.pollId,
            key: props.routeParams.key,
            pollData: null,
            order: null,
            loading: false,
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
        if (data.voteResult !== undefined) {
            if (data.voteResult) {
                history.pushState(null, "/p/thanks");
            }
            else {
                console.error("vote failed!");
            }
            return;
        }

        let state = this.state;
        state.pollData = data;
        this.setState(state);
    }

    orderChanged = (order) => {
        let state = this.state;
        state.order = order;
        this.setState(state);
    }

    submit = () => {
        let state = this.state;
        state.loading = true;
        this.setState(state);
        PollActions.submit(this.state.pollId, this.state.key, this.state.order)
    }

    render() {
        if (!this.state.pollData) {
            return (<div>Loading...</div>);
        }

        if (this.state.pollData.valid) {
            return (
                <div>
                    {
                        this.state.loading &&
                        (<div className="loading-screen">
                            <Loader loaded={false}>
                            </Loader>
                        </div>)
                    }
                    <Header text={"Poll #" + this.state.pollData.poll_data.id} />
                    <div className="content">
                        <div className="ballot-wrapper" style={{"width": "40%"}}>
                            <h1>{this.state.pollData.poll_data.ballot.question}</h1>
                            <p className="description">{this.state.pollData.poll_data.description}</p><br />
                            <div className="voting-instructions">
                                Please prioritize candidates according to your preference:
                            </div>
                            <PollChoices choices={this.state.pollData.poll_data.ballot.choices} reportOrderCb={this.orderChanged} />
                            <br />
                            <a><div className="submit-button" onClick={this.submit}>submit</div></a>
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
