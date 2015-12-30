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
                    <table className="new-ballot-wrapper">
                        <tbody>
                        <tr>
                            <td>question</td>
                            <td><input type="text" /></td>
                        </tr>
                        <tr>
                            <td>choices</td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>invitations</td>
                            <td><textarea></textarea></td>
                        </tr>
                        </tbody>
                    </table>
                    <a href="#" className="submit-button">submit!</a>
                </div>
            </div>
        );
    }
};
