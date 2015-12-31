import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Thanks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1 className="logo"><a href="#">SimpleSTV</a></h1>
                    <div className="separator">&nbsp;</div>
                </div>
                <div className="content">
                    <center>
                        <h1>Thanks for voting!</h1>
                        <br />
                        <Link to={'/'}>&larr; back to home</Link>
                    </center>
                </div>
            </div>
        );
    }
};
