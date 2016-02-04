import React, { Component } from 'react';
import { Link } from 'react-router';
import history from '../libs/history.js';
import Header from './Header.jsx';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import EmailValidator from 'email-validator';
import Calendar from 'rc-calendar';
import GregorianCalendar from 'gregorian-calendar';
import TimePicker from 'rc-time-picker';
import ReactTooltip from 'react-tooltip';

export default class Create extends Component {
    constructor(props) {
        super(props);
        if (PollStore.getState().deadline) {
            this.state = PollStore.getState();
        }
        else {
            this.state = {
                question: '',
                description: '',
                choices: [],
                numSeats: 1,
                recipients: [],
                authorEmail: '',
                deadlineDate: null,
                deadlineTime: null,
            };
        }
        this.state.wantDescription = false;
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

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        recipients = recipients.filter(onlyUnique);

        if (lines[lines.length - 1].length === 0 && lines.length !== 1) {
            recipients.push("");
        }

        state.recipients = recipients.length > 0 ? recipients: [];
        this.setState(state);
    }

    authorEmailChanged = (event) => {
        let state = this.state;
        state.authorEmail = event.target.value;
        this.setState(state);
    }

    numSeatsChanged = (event) => {
        let state = this.state;
        state.numSeats = event.target.value;
        this.setState(state);
    }

    preview = () => {
        PollActions.save(
                this.state.question,
                this.state.description,
                this.state.choices,
                this.state.numSeats,
                this.state.recipients,
                this.state.authorEmail,
                this.state.deadlineDate,
                this.state.deadlineTime
        );
        history.pushState(null, "/p/preview");
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

    onDeadlineDateChanged = (deadline) => {
        let state = this.state;
        state.deadlineDate = deadline;
        this.setState(state);
    }

    onDeadlineTimeChanged = (deadline) => {
        let state = this.state;
        state.deadlineTime = deadline;
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

    debugFill = () => {
        let state = this.state;
        state.question = "aaa";
        state.choices = ["a", "b"];
        state.recipients = ['a@a.pl', 'b@b.pl'];
        state.authorEmail = "a@a.pl";
        this.setState(state);
    }

    render() {
        const numberOfInvalidEmails = this.numberOfInvalidEmails();
        const question = this.state.question;
        const numberOfChoices = this.numberOfCandidates();
        const numberOfRecipients = this.numberOfRecipients() - numberOfInvalidEmails;
        const authorEmail = this.state.authorEmail;
        var date = new GregorianCalendar();
        var d = new Date();
        date.setTime(d);
        const everythingOk = (question.length > 1 && numberOfChoices > 1 && numberOfRecipients > 0 && this.state.deadlineDate && this.state.deadlineTime && authorEmail !== "" && EmailValidator.validate(authorEmail)) ? true : false;
        return (
            <div>
                <Header text="Create a poll" />
                <div className="content">
                    <div className="poll-create-wrapper">
                    <div className="poll-create-column-1">
                        <ReactTooltip effect="solid" class="tooltip" type="info" offset={{left: '-10px'}} />
                        <table className="poll-create-tbl"><tbody>
                            <tr>
                                <td>
                                    question{!question.length && (<span className="error-message"><br />(required)</span>)}
                                </td>
                                <td>
                                    <input className="new-ballot-question" type="text" value={this.state.question} onChange={this.questionChanged} />
                                </td>
                                <td>
                                    <span data-tip="An meaningful question that will be presented to the voters.">ⓘ</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <br />
                                    <input type="checkbox" value={this.state.wantDescription} onChange={this.wantDescriptionChanged} style={{"float": "left"}} /> further explanation
                                    <br />
                                    <br />
                                </td>
                                <td>
                                    {this.state.wantDescription && (<div><textarea rows="4" value={this.state.description} onChange={this.descriptionChanged}></textarea><br /></div>)}
                                </td>
                                <td>
                                    <span data-tip="Explanation (description) that will be showed to the voters, in case question is not enough.">ⓘ</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {numberOfChoices ? (<span className="create-poll-counter">{numberOfChoices}<br /></span>) : ''}
                                answer{numberOfChoices == 1 ? '' : 's'}
                                {(numberOfChoices < 2) && (<span className="error-message"><br />(too few answers)</span>)}
                                </td>
                                <td>
                                <textarea rows="6" value={this.state.choices.join('\n')} onChange={this.choicesChanged}></textarea><br />
                                </td>
                                <td>
                                    <span data-tip="Candidates that voters will prioritize. Please put each candidate in new line.">ⓘ</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    number of winners
                                    {(numberOfChoices > 0 && (this.state.numSeats >= this.state.choices.length)) && (<span className="error-message">(too much seats)</span>)}
                                </td>
                                <td>
                                    <input type="number" value={this.state.numSeats} style={{"vertical-align": "bottom"}} onChange={this.numSeatsChanged} style={{"width": "40px", "textAlign": "left"}} />
                                    <br /><br />
                                </td>
                                <td>
                                    <span data-tip="Number of winners (seats). Min = 1, Max = number of candidates - 1">ⓘ</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {numberOfRecipients ? (<span className="create-poll-counter">{numberOfRecipients}</span>) : ''}
                                recipient emails (one per line)
                                {(numberOfRecipients < 1) && (<span className="error-message"><br />(too few emails)</span>)}
                                </td>
                                <td>
                                    <textarea rows="6" value={this.state.recipients.join('\n')} onChange={this.recipientsChanged}></textarea>
                                    {numberOfInvalidEmails > 0 ? (<span className="error-message">You entered {numberOfInvalidEmails} invalid recipient email addresses.</span>) : ''}
                                </td>
                                <td>
                                    <span data-tip="Email addresses of people that will be invited to this poll. Please put each email address in new line.">ⓘ</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    your email
                                    {(authorEmail === "") && (<span className="error-message"> (required)</span>)}
                                </td>
                                <td>
                                    <br />
                                    <input type="text" value={authorEmail} onChange={this.authorEmailChanged} />
                                    {(authorEmail !== "" && !EmailValidator.validate(authorEmail)) && <span className="error-message">invalid email address</span>}
                                </td>
                                <td>
                                    <span data-tip="Your email adress. We will send you confirmation email to this address.">ⓘ</span>
                                </td>
                            </tr>

                        </tbody></table>
                        <br style={{"clear": "left"}} />
                    </div>
                    <div className="poll-create-column-2">
                        <table className="poll-create-tbl-2">
                            <tr>
                                <td>
                                    deadline{this.state.deadlineDate ? "" : (<span className="error-message"> (required)</span>)}<br />
                                    <Calendar showToday={false} defaultValue={date} onSelect={this.onDeadlineDateChanged} />
                                </td>
                                <td className="info-icon-tbl-cell">
                                    <span data-tip="Deadline date after which voters won't be able to vote anymore.">ⓘ</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <br />
                                    deadline time{this.state.deadlineTime ? "" : (<span className="error-message"> (required)</span>)}<br />
                                    <TimePicker style={{"width": "100%"}} showSecond={false} onChange={this.onDeadlineTimeChanged} />
                                </td>
                                <td className="info-icon-tbl-cell">
                                    <span data-tip="Exact time after which voters won't be able to vote.">ⓘ</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    </div>
                    <br style={{"clear": "left"}} />
                    {everythingOk ? <a className="submit-button" onClick={this.preview}>preview</a> : <a className="submit-button-grey">preview</a> }
                    <a onClick={this.debugFill} style={{"color": "white"}}>debug-fill</a>
                </div>
            </div>
        );
    }
};
