import React, { Component } from 'react';
import { Link } from 'react-router';
import FullScreen from 'react-fullscreen';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FullScreen>
                <div className="slight-background-gradient">
                <div className="logo-wrapper">
                    <img className="logo" src="./app/img/logo.png" />
                </div>
                <div className="main-page-wrapper">
                    <h1>Welcome to SimpleSTV!</h1>
                    <p>SimpleSTV is a platform for conducting Single Transferable Vote (STV) polls in as easy as possible manner. You can read more about STV <a href="https://en.wikipedia.org/wiki/Single_transferable_vote">here</a>.</p>
                    <p>SimpleSTV is open source software. Source is available at <a href="https://github.com/szborows/simplestv">GitHub</a>.</p>
                    <br />
                    <Link to={'/p/create'} className="submit-button">Create new poll!</Link>
                </div>
                </div>
            </FullScreen>
        );
    }
};
