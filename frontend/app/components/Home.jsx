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
                <a href="https://github.com/szborows/simplestv"><img style={{"position": "absolute", "top": 0, "right": 0, "border": 0}} src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" /></a>
                <div className="logo-wrapper">
                    <img className="logo" src="./app/img/logo.png" />
                </div>
                <div className="main-page-wrapper">
                    <h1>Welcome to SimpleSTV!</h1>
                    <p>SimpleSTV is a platform for conducting Single Transferable Vote (STV) polls in as easy as possible manner. You can read more about STV <a href="https://en.wikipedia.org/wiki/Single_transferable_vote">here</a>.</p>
                    <br />
                    <Link to={'/p/create'} className="submit-button">Create new poll!</Link>
                </div>
                </div>
            </FullScreen>
        );
    }
};
