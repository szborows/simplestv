import alt from '../libs/alt';
import $ from 'jquery';

class ResultsActions {
    getResults(secret) {
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/results/' + secret,
                cache: false,
                success: function(data) {
                    dispatch({'valid': true, 'poll_data': data});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'valid': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }

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
                        console.warn("result for task " + taskId + " not ready yet");
                        return;
                    }
                    dispatch({'valid': true, 'output': data, 'finishedTaskId': taskId});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'valid': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }
}

export default alt.createActions(ResultsActions);
