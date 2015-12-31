import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
export default class PollChoices extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
        cards: props.choices.map((e, i) => { return {index: i, id: e.id, text: e.text}; }),
    };
    this.reportOrderCb = props.reportOrderCb;
    this.reportOrder();
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

    this.reportOrder();
  }

  reportOrder = () => {
    this.reportOrderCb(this.state.cards.map((e) => { return e.id; }));
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
