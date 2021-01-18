export const ERROR_LOGIN = 'ERROR_LOGIN';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';

export const success_login = (user, profiles, token) => {
  return {
    type: SUCCESS_LOGIN,
    user,
    profiles,
    token,
  };
};
export const error_login = error => {
  return {
    type: ERROR_LOGIN,
    error,
  };
};