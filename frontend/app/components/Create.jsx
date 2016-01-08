import React, { Component } from 'react';
import { Link } from 'react-router';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import history from '../libs/history.js';
import Header from './Header.jsx';
import EmailValidator from 'email-validator';
import Calendar from 'rc-calendar';
import GregorianCalendar from 'gregorian-calendar';
import Loader from 'react-loader';

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            wantDescription: false,
            description: '',
            choices: [],
            numSeats: 1,
            recipients: [],
            deadline: null,
            loading: false,
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
        let state = this.state;
        state.loading = true;
        this.setState(state);
        PollActions.create(
                this.state.question,
                this.state.description,
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

    descriptionChanged = (event) => {
        let state = this.state;
        state.description = event.target.value;
        this.setState(state);
    }

    wantDescriptionChanged = (event) => {
        let state = this.state;
        state.wantDescription = event.target.checked;
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
                {
                    this.state.loading &&
                    (<div className="loading-screen">
                        <Loader loaded={false}>
                        </Loader>
                    </div>)
                }
                <Header text="Create a poll" />
                <div className="content">
                    <div className="poll-create-wrapper">
                    <div className="poll-create-column-1">
                        <label>question{!question.length && (<span className="error-message"> (required)</span>)}</label>
                        <input className="new-ballot-question" type="text" value={this.state.question} onChange={this.questionChanged} />
                        <label><input type="checkbox" value={this.state.wantDescription} onChange={this.wantDescriptionChanged} style={{"width": "auto"}} /> description</label>
                        {this.state.wantDescription && (<div><textarea rows="4" value={this.state.description} onChange={this.descriptionChanged}></textarea><br /></div>)}
                        <table className="poll-create-tbl"><tbody>
                            <tr>
                                <td>
                                {numberOfChoices ? (<span className="create-poll-counter">{numberOfChoices}<br /></span>) : ''}
                                candidate{numberOfChoices == 1 ? '' : 's'}
                                {(numberOfChoices < 2) && (<span className="error-message"><br />(too few candidates)</span>)}
                                </td>
                                <td>
                                <textarea rows="6" value={this.state.choices.join('\n')} onChange={this.choicesChanged}></textarea><br />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    seats
                                    {(numberOfChoices > 0 && (this.state.numSeats >= this.state.choices.length)) && (<span className="error-message">(too much seats)</span>)}
                                </td>
                                <td>
                                    <input type="number" value={this.state.numSeats} style={{"vertical-align": "bottom"}} onChange={this.numSeatsChanged} style={{"width": "40px", "textAlign": "left"}} />
                                    <br /><br />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {numberOfRecipients ? (<span className="create-poll-counter">{numberOfRecipients}</span>) : ''}
                                recipient{numberOfRecipients == 1 ? '' : 's'}
                                {(numberOfRecipients < 1) && (<span className="error-message"><br />(too few recipients)</span>)}
                                </td>
                                <td>
                                    <textarea rows="6" value={this.state.recipients.join('\n')} onChange={this.recipientsChanged}></textarea>
                                    {numberOfInvalidEmails > 0 ? (<span className="error-message">You entered {numberOfInvalidEmails} invalid recipient email addresses.</span>) : ''}
                                </td>
                            </tr>
                        </tbody></table>
                        <br style={{"clear": "left"}} />
                    </div>
                    <div className="poll-create-column-2">
                        deadline{this.state.deadline ? "" : (<span className="error-message"><br />(required)</span>)}<br />
                        <Calendar showToday={false} defaultValue={date} onSelect={this.onDeadlineChanged} />
                    </div>
                    </div>
                    <br style={{"clear": "left"}} />
                    {everythingOk ? <a className="submit-button" onClick={this.submit}>submit!</a> : <a className="submit-button-grey">submit!</a> }
                </div>
            </div>
        );
    }
};
