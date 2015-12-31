import alt from '../libs/alt';
import $ from 'jquery';
import PollActions from '../actions/PollActions';

class PollStore {
    constructor() {
        this.bindActions(PollActions);
        this.state = {};
    }

    read(data) {
        this.setState(data);
    }

    create(data) {
        this.setState(data);
    }

    getResults(data) {
        this.setState(data);
    }

    submit(data) {
        this.setState(data);
    }
};

export default alt.createStore(PollStore, 'PollStore');

