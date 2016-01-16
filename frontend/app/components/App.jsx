import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import history from '../libs/history.js'
import FullScreen from 'react-fullscreen';
import Poll from './Poll.jsx';
import Home from './Home.jsx';
import Create from './Create.jsx';
import Preview from './Preview.jsx';
import Results from './Results.jsx';
import Thanks from './Thanks.jsx';
import Error from './Error.jsx';
import About from './About.jsx';

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
                    <Route path="/p/results/:secret" component={Results} />
                    <Route path="/p/:pollId/:key" component={Poll} />
                    <Route path="/p/create" component={Create} />
                    <Route path="/p/preview" component={Preview} />
                    <Route path="/p/thanks" component={Thanks} />
                    <Route path="/p/error" component={Error} />
                    <Route path="/about" component={About} />
                </Route>
            </Router>
        );
    }
};
