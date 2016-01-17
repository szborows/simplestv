import React, { Component } from 'react';
import { Link } from 'react-router';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import PollChoices from './PollChoices.jsx';
import history from '../libs/history.js';
import Header from './Header.jsx';
import Loader from 'react-loader';

export default class Preview extends Component {
    constructor(props) {
        super(props);
        // TODO: _.extend ?
        this.state = {
            loading: false,
            question: props.location.state.question,
            description: props.location.state.description,
            choices: props.location.state.choices,
            numSeats: props.location.state.numSeats,
            recipients: props.location.state.recipients,
            authorEmail: props.location.state.authorEmail,
            deadline: props.location.state.deadline
        };
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
        if (data.valid) {
            history.pushState(null, "/p/results/" + data.result.secret);
        }
        else {
            console.err("Bad error code received: " + data.status_code);
        }
    }

    goBack = () => {
        history.pushState(null, "/p/create");
    }

    submit = () => {
        PollActions.create(
                this.state.question,
                this.state.description,
                this.state.choices,
                this.state.numSeats,
                this.state.recipients,
                this.state.authorEmail,
                this.state.deadline);
        let state = this.state;
        state.loading = true;
        this.setState(state);
    }

    render() {
        const choices = this.state.choices.map((value, index) => {
            return {text: value, id: index}
        });

        return (
            <div>
                {
                    this.state.loading &&
                    (<div className="loading-screen">
                        <Loader loaded={false}>
                        </Loader>
                    </div>)
                }
                <Header text="Poll preview" />
                <div className="content">
                    <div className="ballot-wrapper" style={{"width": "40%"}}>
                        <h1>{this.state.question}</h1>
                        <p className="description">{this.state.description}</p><br />
                        <PollChoices choices={choices} active={false} />
                    </div>
                    <br /><br />
                    <div className="cancel-submit-bar">
                        <a className="submit-button-grey" onClick={this.goBack}>&laquo;Go back</a>
                        <a className="submit-button" onClick={this.submit}>Submit!</a>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
};
