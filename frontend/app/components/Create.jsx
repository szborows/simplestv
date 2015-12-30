import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            choices: [],
            recipients: [],
        };
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

    render() {
        return (
            <div>
                <div className="header">
                    <h1 className="logo"><Link to={'/'}>SimpleSTV</Link></h1>
                    <div className="separator">&nbsp;</div>
                </div>
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
                    <a href="#" className="submit-button">submit!</a>
                </div>
            </div>
        );
    }
};
