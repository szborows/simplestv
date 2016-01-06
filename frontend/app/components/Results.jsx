import React, { Component } from 'react';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
import Header from './Header.jsx';

var PieChart = require("react-chartjs").Pie;

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secret: props.routeParams.secret,
            pollResultsData: null,
        };
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
        // TODO: read results from the server
        PollActions.getResults(this.state.secret);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
        let state = this.state;
        state.pollResultsData = data;
        this.setState(state);
    }

    runElection = () => {
        PollActions.runElection(this.state.pollResultsData.poll_data.poll.id, this.state.secret);
    }

    render() {
        if (!this.state.pollResultsData) {
            return (<div>Loading...</div>);
        }

        const numRecipients = this.state.pollResultsData.poll_data.results.num_recipients;
        const totalVotes = this.state.pollResultsData.poll_data.results.total_votes;

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

        if (this.state.pollResultsData.valid) {
            return (
                <div>
                    <Header text={"Results for poll #" + this.state.pollResultsData.poll_data.poll.id} />
                    <div className="content">
                        <div className="pie-chart-container">
                            <PieChart data={chartData} options={chartOptions}/>
                            <p className="pie-chart-label">voter turnout: {totalVotes == 0 ? 0 : (totalVotes / numRecipients) * 100}%</p>
                        </div>
                        <div className="ballot-wrapper">
                            question: {this.state.pollResultsData.poll_data.poll.ballot.question}<br />
                            number of recipients: {numRecipients}<br />
                            seats: {this.state.pollResultsData.poll_data.poll.num_seats}<br />
                            <br />
                            <br />
                            <input type="button" onClick={this.runElection} value="run election" />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            console.warn(JSON.stringify(this.state.pollResultsData));
            return <div>Error {this.state.pollResultsData.status_code}</div>;
        }
    }
};
