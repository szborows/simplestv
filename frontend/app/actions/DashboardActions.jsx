import alt from '../libs/alt';
import $ from 'jquery';

class DashboardActions {
    getData(secret) {
        return (dispatch) => {
            $.ajax({
                url: '/api/v1/poll/results/' + secret,
                cache: false,
                success: function(data) {
                    dispatch({'valid': true, 'data': data});
                }.bind(this),
                error: function(xhr, status, err) {
                    dispatch({'valid': false, 'status_code': xhr.status});
                }.bind(this)
            });
        }
    }
}

export default alt.createActions(DashboardActions);
