import alt from '../libs/alt';
import $ from 'jquery';
import GregorianCalendarFormat from 'gregorian-calendar-format';

class PollActions {
    read(pollId, key) {
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/' + pollId + '?key=' + key,
                dataType: 'json',
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

    create(question, choices, numSeats, recipients) {
        const data = {'question': question, 'choices': choices, 'num_seats': numSeats, 'recipients': recipients};
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/create',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                cache: false,
                success: function(data) {
                    dispatch({'valid': true, 'result': data});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'valid': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }

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

    submit(pollId, key, choices, deadline) {
        const deadlineDate = (new GregorianCalendarFormat('yyyy-MM-dd')).format(deadline);
        const data = {
            'id': pollId,
            'key': key,
            'choices': choices,
            'deadline': deadlineDate
        };
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/' + pollId + '/vote',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                cache: false,
                success: function(data) {
                    dispatch({'voteResult': true, 'result': data});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'voteResult': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }

    runElection(pollId, secret) {
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/dev/run_election/' + pollId + '/' + secret,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    //dispatch({'valid': true, 'poll_data': data});
                    console.warn("result: " + JSON.stringify(data));
                }.bind(this),
                error: function(xhr, status, err) {
                    //dispatch({'valid': false, 'status_code': xhr.status});
                    console.error("error " + xhr.status + "!");
                }.bind(this)
            });
        }
    }
}

export default alt.createActions(PollActions);
