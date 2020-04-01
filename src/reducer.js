import {ERROR_LOGIN, SUCCESS_LOGIN} from './actions';

const original_estate = {
  user: {id_usuario: ''},
  message: '',
  load: false,
};

const reducer = (state = original_estate,action) => {
  switch (action.type) {
    case ERROR_LOGIN:
      return {...state, message: action.error};
    case SUCCESS_LOGIN:
      return {...state, user: action.usuario};
    default:
      return state;
  }
};
export default reducer;
