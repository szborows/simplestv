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
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
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
                </div>
            </div>
        );
    }
};
