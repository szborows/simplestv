import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from './Header.jsx';

export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header text="About" />
                <div className="content">
                    <center>
                        <h1>not done yet :P</h1>
                    </center>
                </div>
            </div>
        );
    }
};
