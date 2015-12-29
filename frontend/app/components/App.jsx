import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import update from 'react/lib/update';
import Card from './Card';
import history from '../libs/history.js'
import FullScreen from 'react-fullscreen';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PollActions from '../actions/PollActions.jsx';

const style = {
  width: 400
};

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
      cards: [{
        id: 1,
        text: 'Write a cool JS library'
      }, {
        id: 2,
        text: 'Make it generic enough'
      }, {
        id: 3,
        text: 'Write README'
      }, {
        id: 4,
        text: 'Create some examples'
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'
      }, {
        id: 6,
        text: '???'
      }, {
        id: 7,
        text: 'PROFIT'
      }]
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
      <div style={style}>
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
        };
    }

    componentDidMount() {
        PollActions.read(this.state.pollId, this.state.key);
    }

    render() {
        return (
            <div>
                pollId: {this.state.pollId}<br />
                question here...<br /><br />
                <PollChoices />
            </div>
        );
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
