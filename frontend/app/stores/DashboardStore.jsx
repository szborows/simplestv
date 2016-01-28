import alt from '../libs/alt';
import DashboardActions from '../actions/DashboardActions';

class DashboardStore {
    constructor() {
        this.bindActions(DashboardActions);
        this.state = {};
    }

    getData(data) {
        this.setState(data);
    }
};

export default alt.createStore(ResultsStore, 'DashboardStore');

