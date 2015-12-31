import React, { Component } from 'react';
import { Link } from 'react-router';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import history from '../libs/history.js';
import Header from './Header.jsx';

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            choices: [],
            recipients: [],
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
            console.log('id:' + data.result.id);
            console.log('secret:' + data.result.secret);
            history.pushState(null, "/p/results/" + data.result.secret);
        }
        else {
            console.err("Bad error code received: " + data.status_code);
        }
    }

    questionChanged = (event) => {
        let state = this.state;
        state.question = event.target.value;
        this.setState(state);
    }

    choicesChanged = (event) => {
        let state = this.state;
        const lines = event.target.value.split('\n');
        let choices = lines.filter((e) => { return e.trim() !== ""; });
        if (lines[lines.length - 1].length === 0 && lines.length !== 1) {
            choices.push("");
        }

        state.choices = choices.length > 0 ? choices: [];
        this.setState(state);
    }

    recipientsChanged = (event) => {
        let state = this.state;
        const lines = event.target.value.split(/[\s,;\n]+/);
        let recipients = lines.filter((e) => { return e.trim() !== ""; });
        if (lines[lines.length - 1].length === 0 && lines.length !== 1) {
            recipients.push("");
        }

        state.recipients = recipients.length > 0 ? recipients: [];
        this.setState(state);
    }

    submit = () => {
        PollActions.create(this.state.question, this.state.choices, this.state.recipients);
    }

    numberOfCandidates = () => {
        const count = this.state.choices.length;
        if (count && this.state.choices[count - 1].trim().length === 0) {
            return count - 1;
        }
        return count;
    }

    numberOfRecipients = () => {
        const count = this.state.recipients.length;
        if (count && this.state.recipients[count - 1].trim().length === 0) {
            return count - 1;
        }
        return count;
    }

    render() {
        return (
            <div>
                <Header text="Create poll" />
                <div className="content">
                    <table className="new-ballot-wrapper">
                        <tbody>
                        <tr>
                            <td className="create-poll-label">question</td>
                            <td className="create-poll-input"><input className="new-ballot-question" type="text" value={this.state.question} onChange={this.questionChanged} /></td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.choices.length ? (<span className="create-poll-counter">{this.numberOfCandidates()}</span>) : ''}
                                candidate{this.numberOfCandidates() == 1 ? '' : 's'}
                            </td>
                            <td><textarea value={this.state.choices.join('\n')} onChange={this.choicesChanged}></textarea></td>
                        </tr>
                        <tr>
                            <td>
                                {this.state.recipients.length ? (<span className="create-poll-counter">{this.numberOfRecipients()}</span>): ''}
                                recipient{this.numberOfRecipients() == 1 ? '' : 's'}
                            </td>
                            <td><textarea value={this.state.recipients.join('\n')} onChange={this.recipientsChanged}></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                    <a className="submit-button" onClick={this.submit}>submit!</a>
                </div>
            </div>
        );
    }
};
