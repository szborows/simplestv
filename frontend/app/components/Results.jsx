import React, { Component } from 'react';
import DashboardActions from '../actions/DashboardActions.jsx';
import DashboardStore from '../stores/DashboardStore.jsx';
import ElectionResultsActions from '../actions/ElectionResultsActions.jsx';
import ElectionResultsStore from '../stores/ElectionResultsStore.jsx';
import Header from './Header.jsx';
import history from '../libs/history';

var PieChart = require("react-chartjs").Pie;

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: props.routeParams.secret,
            info: null,
            winnerText: null,
            task_id: null,
            electionResultsTimer: null,
            openStvOutputShown: false,
            pollClosed: false
        };
        this.updateTimer = null;
    }

    componentDidMount() {
        DashboardStore.listen(this.onDashboardChange);
        ElectionResultsStore.listen(this.onElectionResultsChange);
        DashboardActions.getData(this.state.secret);
        this.updateTimer = setInterval(() => {
            DashboardActions.getData(this.state.secret);
        }, 5000);
    }

    componentWillUnmount() {
        DashboardStore.unlisten(this.onDashboardChange);
        ElectionResultsStore.unlisten(this.onElectionResultsChange);
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
    }

    getRunElectionStatus = (taskId) => {
        ElectionResultsActions.getRunElectionStatus(taskId);
    }

    onDashboardChange = (data) => {
        if (!data.valid) {
            console.warn("ERROR!!");
            return;
        }

        let state = this.state;
        state.info = data;
        if (data.data.poll.winners && data.data.poll.winners.length) {
            state.winnerText = this.getWinnersText(data.data.poll.winners);
            state.pollClosed = true;
        }
        this.setState(state);
    }

    onElectionResultsChange = (data) => {
        if (!data.valid) {
            console.warn("ERROR!!!");
            return;
        }

        if (data.task_id !== undefined) {
            let state = this.state;
            state.task_id = data.task_id;
            if (!state.electionResultsTimer) {
                state.electionResultsTimer = setInterval(() => { this.getRunElectionStatus(this.state.task_id) }, 1000);
            }
            this.setState(state);
            return;
        }

        if (data.ready !== undefined) {
            let state = this.state;
            if (data.ready === true) {
                if (state.electionResultsTimer) {
                    clearInterval(state.electionResultsTimer);
                    state.electionResultsTimer = null;
                    state.winnerText = this.getWinnersText(data.output.winners);
                    state.output = data.output.output;
                    console.warn(JSON.stringify(data, null, 2));
                }
            }
            else if (data.ready === false) {
                if (!state.electionResultsTimer) {
                    state.electionResultsTimer = setInterval(() => { this.getRunElectionStatus(this.state.task_id) }, 1000);
                }
            }
            else {
                console.warn("???");
            }
            this.setState(state);
            return;
        }

        console.warn("wtf?!");
    }

    getWinnersText = (winners) => {
        var winnerText = "Winner";
        if (winners.length === 1) {
            winnerText += " is " + winners[0].value;
        }
        else if (winners.length > 1) {
            winnerText += " are ";
            for (var i = 0; i < winners.length - 1; i++) {
                winnerText += winners[i].value;
                winnerText += ((i + 2) === winners.length) ? "" : ", ";
            }
            winnerText += " and ";
            winnerText += winners[winners.length - 1].value;
        }
        else {
            winnerText = "Error during election :("
        }
        return winnerText + ".";
    }

    runElection = () => {
        let state = this.state;
        state.task_id = undefined;
        state.output = undefined;
        this.setState(state);
        ElectionResultsActions.runElection(this.state.info.data.poll.id, this.state.secret);
    }

    toggleOpenStvOutput = () => {
        let state = this.state;
        state.openStvOutputShown = !state.openStvOutputShown;
        this.setState(state);
    }


    render() {
        if (!this.state.info) {
            return (<div>Loading...</div>);
        }

        if (this.state.info.valid) {
            const numRecipients = this.state.info.data.results.num_recipients;
            const totalVotes = this.state.info.data.results.total_votes;

            const chartData = [
                {
                    value: totalVotes,
                    color: "#16BF7D",
                    label: "Voted"
                },
                {
                    value: numRecipients - totalVotes,
                    color: "#F7464A",
                    label: "Didn't vote"
                },
            ];
            const chartOptions = {animation: false};

            const poll = this.state.info.data.poll;
            return (
                <div>
                    <Header text={"Results for poll #" + poll.id} />
                    <div className="content">
                        <div className="pie-chart-container">
                            <PieChart data={chartData} options={chartOptions}/>
                            <p className="pie-chart-label">voter turnout: {totalVotes == 0 ? 0 : (totalVotes / numRecipients) * 100}%</p>
                        </div>
                        <div className="ballot-wrapper">
                            <table className="results-info">
                                <tbody>
                                    <tr>
                                        <td>question:</td>
                                        <td>{poll.ballot.question}</td>
                                    </tr>
                                    <tr>
                                        <td>description:</td>
                                        <td>{poll.description}</td>
                                    </tr>
                                    <tr>
                                        <td>choices:</td>
                                        <td>
                                            <div>
                                                {poll.ballot.choices.map((e) => { return (<div key={e.id}>{e.text}</div>); })}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>number of recipients:</td>
                                        <td>{numRecipients}</td>
                                    </tr>
                                    <tr>
                                        <td>seats:</td>
                                        <td>{poll.num_seats}</td>
                                    </tr>
                                    <tr>
                                        <td>deadline:</td>
                                        <td>{poll.deadline}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br style={{clear: "left"}} />
                            <div className="results-run-election-box">
                                {!this.state.pollClosed && (
                                    <a className={totalVotes > 0 ? "submit-button" : "submit-button-grey"} onClick={this.runElection}>run DRY election</a>
                                )}
                                {(this.state.task_id && !this.state.output) && (
                                    <div>
                                        task in queue: {this.state.task_id}
                                    </div>
                                )}
                                <span className="results-winner-text">{this.state.winnerText}</span>
                                {this.state.output && (
                                    <div>
                                        <a style={{"color": "blue"}} onClick={this.toggleOpenStvOutput}>{this.state.openStvOutputShown ? "▲ Hide" : "▼ Show"} OpenSTV output</a><br />
                                        {this.state.openStvOutputShown && (<pre className="openstv-output"><br />{this.state.output}</pre>)}
                                    </div>
                                )}
                            </div>
                            <br style={{"clear": "left"}} />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            const status_code = this.state.status_code;
            var message = "Unknown error";
            var description = "";
            switch (status_code) {
                case 401:
                    message = "You're not author of this poll.";
                    description = "Sorry, but it seems that you're not author of this poll.";
                    break;
                case 404:
                    message = "Poll doesn't exist";
                    description = "Sorry, but it seems that poll you requested doesn't exist.";
                    break;
            }
            setTimeout(() => {
                history.replaceState({
                    status_code: status_code,
                    message: message,
                    description: description
                }, "/p/error"); 
            }, 0);
            return <div>Error {this.state.status_code}</div>;
        }
    }
};
