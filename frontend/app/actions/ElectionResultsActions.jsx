import alt from '../libs/alt';
import $ from 'jquery';

class ElectionResultsActions {
    runElection(pollId, secret) {
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/run_election/' + pollId + '/' + secret,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    dispatch({'valid': true, 'task_id': data.task_id});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'valid': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }

    getRunElectionStatus(taskId) {
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/run_election_queue/' + taskId,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    if (data.output === undefined) {
                        dispatch({'valid': true, 'ready': false, task_id: undefined});
                        return;
                    }
                    dispatch({'valid': true, 'ready': true, 'output': data, 'finishedTaskId': taskId, task_id: undefined});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'valid': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }
}

export default alt.createActions(ElectionResultsActions);
