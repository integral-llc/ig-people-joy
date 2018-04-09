import {ActionTypes} from "../actions/messages";


const initialState = {
  local: [],
  remote: [],
  fetchingRemote: false,
  remoteCallError: false
}

export default function(state = initialState, action){
  switch (action.type) {
    case ActionTypes.GET_MESSAGES:
      state.local.push('Message ' + Math.random());
      return {...state, local: [...state.local]};
    case ActionTypes.CLEAR_MESSAGES:
      return {...state, local: []};
    case ActionTypes.REMOTE_CALL_STARTED:
      return {...state, fetchingRemote:true, remoteCallError:false};
    case ActionTypes.REMOTE_CALL_ENDED_ERROR:
      return {...state, fetchingRemote: false, remoteCallError: true};
    case ActionTypes.REMOTE_CALL_ENDED_SUCCESS:
      state.remote.push(action.data);
      return {...state, remote:[...state.remote], fetchingRemote: false, remoteCallError: false};
    case ActionTypes.CLEAR_REMOTE_MESSAGE:
      return {...state, remote:[]}
    default:
      return state;
  }
}


