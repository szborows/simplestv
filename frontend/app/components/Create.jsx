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
        state.choices = event.target.value.split('\n');
        this.setState(state);
    }

    recipientsChanged = (event) => {
        let state = this.state;
        state.recipients = event.target.value.split(/[\s,\n]+/);
        this.setState(state);
    }

    submit = () => {
        PollActions.create(this.state.question, this.state.choices, this.state.recipients);
    }

    render() {
        return (
            <div>
                <Header text="Create poll" />
                <div className="content">
                    <table className="new-ballot-wrapper">
                        <tbody>
                        <tr>
                            <td>question</td>
                            <td><input className="new-ballot-question" type="text" value={this.state.question} onChange={this.questionChanged} /></td>
                        </tr>
                        <tr>
                            <td>choices<br />{this.state.choices.length}</td>
                            <td><textarea value={this.state.choices.join('\n')} onChange={this.choicesChanged}></textarea></td>
                        </tr>
                        <tr>
                            <td>recipients<br />{this.state.recipients.length}</td>
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
