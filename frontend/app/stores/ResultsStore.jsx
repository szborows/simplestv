import alt from '../libs/alt';
import ResultsActions from '../actions/ResultsActions';

class ResultsStore {
    constructor() {
        this.bindActions(ResultsActions);
        this.state = {};
    }

    getResults(data) {
        this.setState(data);
    }

    runElection(data) {
        this.setState(data);
    }

    getRunElectionStatus(data) {
        this.setState(data)
    }
};

export default alt.createStore(ResultsStore, 'ResultsStore');
