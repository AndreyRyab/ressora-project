import * as errors from './messages-constants';

const errorToMessageMap = {
  '400': errors.BAD_REQUEST,
  '401': errors.AUTH_ERROR,
  '404': errors.NOT_FOUND_USER,
  '409': errors.CONFLICT_ERROR,
  '500': errors.SERVER_ERR,
};

export const getErrorStatus = (error) => {
  return JSON.parse(JSON.stringify(error)).status;
};

export const showErrorMessage = (error) => {
  return errorToMessageMap[+getErrorStatus(error)];
};
