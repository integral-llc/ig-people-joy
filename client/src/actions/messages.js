import fetch from 'isomorphic-fetch';

export const ActionTypes = {
  GET_MESSAGES: "GET_MESSAGES",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  REMOTE_CALL_STARTED: "REMOTE_CALL_START",
  REMOTE_CALL_ENDED_SUCCESS: "REMOTE_CALL_ENDED_SUCCESS",
  REMOTE_CALL_ENDED_ERROR: "REMOTE_CALL_ENDED_ERROR",
  CLEAR_REMOTE_MESSAGE: "CLEAR_REMOTE_MESSAGES"
}

export function appendMessage() {
  return {
    type: ActionTypes.GET_MESSAGES
  }
}

export function clearMessages() {
  return {
    type: ActionTypes.CLEAR_MESSAGES
  }
}


export function makeRemoteCall(auth) {
  return dispatch => {
    dispatch({
      type: ActionTypes.REMOTE_CALL_STARTED
    });

    auth.getAccessToken()
      .then(token => fetch('/api/secure', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          if (response.status !== 200) {
            dispatch({
              type:ActionTypes.REMOTE_CALL_ENDED_ERROR
            })
            return ;
          }

          response.json()
            .then(json => {
              dispatch({
                type: ActionTypes.REMOTE_CALL_ENDED_SUCCESS,
                data: json
              })
            })
        }))
  }
}

export function clearRemoteMessages() {
  return {
    type: ActionTypes.CLEAR_REMOTE_MESSAGE
  }
}


