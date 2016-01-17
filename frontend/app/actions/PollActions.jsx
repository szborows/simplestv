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

    save(question, description, choices, numSeats, recipients, authorEmail, deadline) {
        return (dispatch) => {
            dispatch({
                'question': question,
                'description': description,
                'choices': choices,
                'numSeats': numSeats,
                'recipients': recipients,
                'authorEmail': authorEmail,
                'deadline': deadline
            });
        };
    }

    create(question, description, choices, numSeats, recipients, authorEmail, deadline) {
        const deadlineDate = (new GregorianCalendarFormat('yyyy-MM-dd')).format(deadline);
        const data = {
            'question': question,
            'description': description,
            'choices': choices,
            'num_seats': numSeats,
            'recipients': recipients,
            'author_email': authorEmail,
            'deadline': deadlineDate
        };
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

    submit(pollId, key, choices) {
        const data = {
            'id': pollId,
            'key': key,
            'choices': choices,
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
}

export default alt.createActions(PollActions);
