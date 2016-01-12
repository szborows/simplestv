import alt from '../libs/alt';
import ResultsActions from '../actions/ResultsActions';

class ResultsStore {
    constructor() {
        this.bindActions(ResultsActions);
        this.state = {};
    }

};

export default alt.createStore(ResultsStore, 'ResultsStore');

