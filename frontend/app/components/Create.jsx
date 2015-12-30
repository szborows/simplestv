import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Create extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1 className="logo"><Link to={'/'}>SimpleSTV</Link></h1>
                    <div className="separator">&nbsp;</div>
                </div>
                <div className="content">
                    ... new ...
                </div>
            </div>
        );
    }
};
