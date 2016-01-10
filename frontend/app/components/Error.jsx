import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from './Header.jsx';

export default class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status_code: props.location.state.status_code,
            message: props.location.state.message,
            description: props.location.state.description
        };
    }

    render() {
        return (
            <div>
                <Header text={"Error " + this.state.status_code} />
                <div className="content">
                    <center>
                        <h1>{this.state.message}</h1>
                        <br />
                        <p>{this.state.description}</p>
                        <br />
                        <br />
                        <Link to={'/'}>&larr; back to home</Link>
                    </center>
                </div>
            </div>
        );
    }
};
