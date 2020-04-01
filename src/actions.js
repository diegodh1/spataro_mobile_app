export const ERROR_LOGIN = 'ERROR_LOGIN';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';

export const success_login = usuario => {
  return {
    type: SUCCESS_LOGIN,
    usuario,
  };
};
export const error_login = error => {
  return {
    type: ERROR_LOGIN,
    error,
  };
};