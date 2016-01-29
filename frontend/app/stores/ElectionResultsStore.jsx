import alt from '../libs/alt';
import ElectionResultsActions from '../actions/ElectionResultsActions';

class ElectionResultsStore {
    constructor() {
        this.bindActions(ElectionResultsActions);
        this.state = {};
    }

    runElection(data) {
        this.setState(data);
    }

    getRunElectionStatus(data) {
        this.setState(data)
    }
};

export default alt.createStore(ElectionResultsStore, 'ElectionResultsStore');

