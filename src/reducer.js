import {ERROR_LOGIN, SUCCESS_LOGIN} from './actions';

const original_estate = {
  user: {id_usuario: ''},
  profiles: [],
  token: '',
  message: '',
  load: false,
  ruta: 'http://192.168.1.9:5000'
};

const reducer = (state = original_estate,action) => {
  switch (action.type) {
    case ERROR_LOGIN:
      return {...state, message: action.error};
    case SUCCESS_LOGIN:
      return {...state, user: action.user, profiles: action.profiles, token: action.token};
    default:
      return state;
  }
};
export default reducer;
