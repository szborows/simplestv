import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from './Header.jsx';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header text="Home" />
                <div className="content">
                    <Link to={'/p/create'}>+ new poll!</Link>
                </div>
            </div>
        );
    }
};
