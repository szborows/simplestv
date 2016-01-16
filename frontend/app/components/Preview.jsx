import React, { Component } from 'react';
import { Link } from 'react-router';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';
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
        };
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
    }

    goBack = () => {
        history.pushState(null, "/p/create");
    }

    submit = () => {
    }

    render() {
        return (
            <div>
                {
                    this.state.loading &&
                    (<div className="loading-screen">
                        <Loader loaded={false}>
                        </Loader>
                    </div>)
                }
                <Header text="Review your poll" />
                <div className="content">
                    preview placeholder...

                    <br />
                    {this.state.question}
                    <br />

                    <div className="cancel-submit-bar">
                        <a className="submit-button" onClick={this.goBack}>&laquo;Go back</a>
                        <a className="submit-button" onClick={this.submit}>Submit!</a>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
};
