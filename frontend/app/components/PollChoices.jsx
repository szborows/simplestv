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
            this.active = props.active;
            if (this.active) {
                this.reportOrderCb = props.reportOrderCb;
                setTimeout(this.reportOrder, 0);
            }
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
            if (this.active) {
                this.reportOrderCb(this.state.cards.map((e) => { return e.id; }));
            }
        }

        render() {
            const { cards } = this.state;

            // TODO: this style is in two places. Export it somewhere..
            const style = {
                border: '1px dashed gray',
                padding: '0.5rem 1rem',
                marginBottom: '.5rem',
                backgroundColor: 'white',
            };

            var cardNodes = null;
            if (this.active === true) {
                cardNodes = cards.map((card, i) => {
                    return (
                            <Card key={card.id}
                                index={i}
                                id={card.id}
                                text={card.text}
                                moveCard={this.moveCard} />
                           );
                });
            }
            else {
                cardNodes = cards.map((card) => {
                    return (
                        <div style={{ ...style }}>
                            <span style={{float: "left"}}>▲▼</span> {card.text}
                        </div>
                    );
                });
            }

            return (
                    <div className={"ballot-entry" + (this.active === true) ? " scaling" : ""}>
                        {cardNodes}
                    </div>
                   );
        }
    }
