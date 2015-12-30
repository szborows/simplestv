import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import history from '../libs/history.js'
import FullScreen from 'react-fullscreen';
import Poll from './Poll.jsx';
import Home from './Home.jsx';
import Create from './Create.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FullScreen>
                {this.props.children}
            </FullScreen>
        );
    }
};

export default class Main extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home} />
                    <Route path="/p/:pollId/:key" component={Poll} />
                    <Route path="/p/create" component={Create} />
                </Route>
            </Router>
        );
    }
};
