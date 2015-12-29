import alt from '../libs/alt';
import $ from 'jquery';

class PollActions {
    read(pollId, key) {
        return (dispatch) => {
            $.ajax({
                url: 'http://localhost:8099/api/v1/poll/' + pollId + '?key=' + key,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    console.warn(JSON.stringify(data));
                    //dispatch(data);
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    }
}

export default alt.createActions(PollActions);
