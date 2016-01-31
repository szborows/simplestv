import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from './Header.jsx';

export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header text="About" />
                <div className="content" style={{"width": "40%", "margin": "0 auto"}}>
                    <center>
                        <br />
                        <h1>About SimpleSTV</h1>
                        <br />
                        <h2>What is it?</h2>
                        <p>
                            SimpleSTV is open-source project allowing to conduct STV polls in the internet. Thanks to the fact it's browser-based, you can access it regardless where you are.
                        </p>
                        <br />
                        <h2>But what is STV?</h2>
                        <p>
                            I believe quote from Wikipedia will do the job well ;)
                            <blockquote>
                                The single transferable vote (STV) is a voting system designed to achieve proportional representation through ranked voting in multi-seat constituencies (voting districts).[1] Under STV, an elector (voter) has a single vote that is initially allocated to their most preferred candidate and, as the count proceeds and candidates are either elected or eliminated, is transferred to other candidates according to the voter's stated preferences, in proportion to any surplus or discarded votes. The exact method of reapportioning votes can vary (see Counting methods).
                            </blockquote>
                        </p>
                        <br />
                        <h2>How it all started?</h2>
                        <p>
                            While working at Nokia I did some side-project: intranet search enine. But ater making it actually work I had literally no time to develop it further in all dimensions. I wanted to know which features are the ones that would satisfy users most. I started looking for some open-source poll system supporting STV and found nothing... so I decided to create the first one ;)
                        </p>
                        <br />
                        <h2>About the author</h2>
                        <p>
                            My blog: <a href="http://szborows.blogspot.com">http://szborows.blogspot.com</a>
                        </p>
                    </center>
                </div>
            </div>
        );
    }
};
