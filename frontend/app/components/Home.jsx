import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Home extends Component {
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
                    <Link to={'/p/create'}>+ new poll!</Link>
                </div>
            </div>
        );
    }
};
