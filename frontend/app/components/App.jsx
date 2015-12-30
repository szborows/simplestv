import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import update from 'react/lib/update';
import Card from './Card';
import history from '../libs/history.js'
import FullScreen from 'react-fullscreen';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PollActions from '../actions/PollActions.jsx';
import PollStore from '../stores/PollStore.jsx';

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

@DragDropContext(HTML5Backend)
class PollChoices extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: props.choices.map((e, i) => { return {id: i, text: e}; }),
    };
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    const { cards } = this.state;

    return (
      <div className="ballot-entry">
        {cards.map((card, i) => {
          return (
            <Card key={card.id}
                  index={i}
                  id={card.id}
                  text={card.text}
                  moveCard={this.moveCard} />
          );
        })}
      </div>
    );
  }
}


class Poll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pollId: props.routeParams.pollId,
            key: props.routeParams.key,
            pollData: null,
        };
    }

    componentDidMount() {
        PollStore.listen(this.onChange);
        PollActions.read(this.state.pollId, this.state.key);
    }

    componentWillUnmount() {
        PollStore.unlisten(this.onChange);
    }

    onChange = (data) => {
        let state = this.state;
        state.pollData = data;
        this.setState(state);
    }

    render() {
        if (!this.state.pollData) {
            return (<div>Loading...</div>);
        }

        if (this.state.pollData.valid) {
            return (
                <div>
                    <div className="header">
                        <h1>Viewing poll: {this.state.pollData.poll_data.id}</h1>
                    </div>
                    <div className="content">
                        <div className="ballot-wrapper">
                            <h1>{this.state.pollData.poll_data.ballot.question}</h1>
                            <PollChoices choices={this.state.pollData.poll_data.ballot.choices} />
                            <br />
                            <a href="#"><div className="submit-button">submit</div></a>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            console.warn(JSON.stringify(this.state.pollData));
            return <div>Error {this.state.pollData.status_code}</div>;
        }
    }
};

export default class Main extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Route path="/" component={App}>
                    <Route path="/p/:pollId/:key" component={Poll} />
                </Route>
            </Router>
        );
    }
};
