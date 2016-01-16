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
import ReactTooltip from 'react-tooltip';

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
            authorEmail: '',
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
        history.pushState({
            question: this.state.question,
            description: this.state.description,
        }, "/p/preview");
        return;
        let state = this.state;
        state.loading = true;
        this.setState(state);
        PollActions.create(
                this.state.question,
                this.state.description,
                this.state.choices,
                this.state.numSeats,
                this.state.recipients,
                this.state.authorEmail,
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
        const everythingOk = (question.length > 1 && numberOfChoices > 1 && numberOfRecipients > 0 && this.state.deadline && authorEmail !== "" && EmailValidator.validate(authorEmail)) ? true : false;
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
                                    <input type="checkbox" value={this.state.wantDescription} onChange={this.wantDescriptionChanged} style={{"float": "left"}} /> description
                                    <br />
                                    <br />
                                </td>
                                <td>
                                    {this.state.wantDescription && (<div><textarea rows="4" value={this.state.description} onChange={this.descriptionChanged}></textarea><br /></div>)}
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                {numberOfChoices ? (<span className="create-poll-counter">{numberOfChoices}<br /></span>) : ''}
                                candidate{numberOfChoices == 1 ? '' : 's'}
                                {(numberOfChoices < 2) && (<span className="error-message"><br />(too few candidates)</span>)}
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
                                recipient{numberOfRecipients == 1 ? '' : 's'}
                                {(numberOfRecipients < 1) && (<span className="error-message"><br />(too few recipients)</span>)}
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
                        deadline{this.state.deadline ? "" : (<span className="error-message"> (required)</span>)}<br />
                        <Calendar showToday={false} defaultValue={date} onSelect={this.onDeadlineChanged} />
                    </div>
                    </div>
                    <br style={{"clear": "left"}} />
                    {everythingOk ? <a className="submit-button" onClick={this.preview}>preview</a> : <a className="submit-button-grey">preview</a> }
                    <a onClick={this.debugFill}>debug-fill</a>
                </div>
            </div>
        );
    }
};
