import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from './Header.jsx';

export default class Thanks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header text="Thanks" />
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
