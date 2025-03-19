import {checkProp} from './guards';

export const getErrorMessage = (error: unknown): string => {
  if (checkProp(error, 'message')) {
    return String(error.message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Some error occurred, please try again later';
};

export const getErrorMessageForToast = (
  error: unknown,
): 'No internet' | 'Looks like something went wrong.' | string => {
  if (checkProp(error, 'message')) {
    return String(error.message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Some error occurred, please try again later';
};
