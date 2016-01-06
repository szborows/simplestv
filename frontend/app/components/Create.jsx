import React, { Component } from 'react';
import { Link } from 'react-router';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import history from '../libs/history.js';
import Header from './Header.jsx';
import EmailValidator from 'email-validator';
import Calendar from 'rc-calendar';
import GregorianCalendar from 'gregorian-calendar';

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            choices: [],
            numSeats: 1,
            recipients: [],
            deadline: null,
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

    numSeatsChanged = (event) => {
        let state = this.state;
        state.numSeats = event.target.value;
        this.setState(state);
    }

    submit = () => {
        PollActions.create(
                this.state.question,
                this.state.choices,
                this.state.numSeats,
                this.state.recipients,
                this.state.deadline);
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

    numberOfInvalidEmails = () => {
        var count = 0;
        for (var i = 0; i < this.state.recipients.length; i++) {
            if (this.state.recipients[i] !== "" && !EmailValidator.validate(this.state.recipients[i])) {
                count++;
            }
        }
        return count;
    }

    onDeadlineChanged = (deadline) => {
        let state = this.state;
        state.deadline = deadline;
        this.setState(state);
    }

    render() {
        const numberOfInvalidEmails = this.numberOfInvalidEmails();
        const question = this.state.question;
        const numberOfChoices = this.numberOfCandidates();
        const numberOfRecipients = this.numberOfRecipients() - numberOfInvalidEmails;
        var date = new GregorianCalendar();
        var d = new Date();
        date.setTime(d);
        const everythingOk = (question.length > 1 && numberOfChoices > 1 && numberOfRecipients > 0 && this.state.deadline) ? true : false;
        return (
            <div>
                <Header text="Create a poll" />
                <div className="content">
                    <table className="new-ballot-wrapper">
                        <tbody>
                        <tr>
                            <td className="create-poll-label">question</td>
                            <td className="create-poll-input"><input className="new-ballot-question" type="text" value={this.state.question} onChange={this.questionChanged} /></td>
                        </tr>
                        <tr>
                            <td>
                                {numberOfChoices ? (<span className="create-poll-counter">{numberOfChoices}</span>) : ''}
                                candidate{numberOfChoices == 1 ? '' : 's'}
                            </td>
                            <td><textarea value={this.state.choices.join('\n')} onChange={this.choicesChanged}></textarea></td>
                        </tr>
                        <tr>
                            <td>seats</td>
                            <td><input type="number" value={this.state.numSeats} onChange={this.numSeatsChanged} style={{"width": "40px", "textAlign": "left"}} /></td>
                        </tr>
                        <tr>
                            <td>
                                {numberOfRecipients ? (<span className="create-poll-counter">{numberOfRecipients}</span>) : ''}
                                recipient{numberOfRecipients == 1 ? '' : 's'}
                                <br />
                                (emails)
                            </td>
                            <td>
                                <textarea value={this.state.recipients.join('\n')} onChange={this.recipientsChanged}></textarea>
                                {numberOfInvalidEmails > 0 ? (<span className="error-message">You entered {numberOfInvalidEmails} invalid recipient email addresses.</span>) : ''}
                            </td>
                        </tr>
                        <tr>
                            <td>deadline{this.state.deadline ? "" : (<span className="error-message"><br />(required)</span>)}</td>
                            <td><Calendar showToday={false} defaultValue={date} onSelect={this.onDeadlineChanged} /></td>
                        </tr>
                        </tbody>
                    </table><br />
                    {everythingOk ? <a className="submit-button" onClick={this.submit}>submit!</a> : <a className="submit-button-grey">submit!</a> }
                </div>
            </div>
        );
    }
};
