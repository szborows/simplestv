import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.text = props.text;
    }

    render() {
        return (
            <div className="header">
                <img className="logo" src="app/img/logo.png" />
                <div className="separator">&nbsp;</div>
                <h1>{this.text}</h1>
                <div className="about-button"><Link to={'/about'}>About</Link></div>
            </div>
        );
    }
};
