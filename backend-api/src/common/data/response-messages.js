module.exports = {

  LOGIN_FAIL: { code: 403, message: 'Invalid username or password' },
  INVALID_EXPIRED_TOKEN: { code: 403, message: 'Token Expired/Incorrect' },
  LOGIN_SUCCESS: { code: 200, message: 'Login successfull' },

  RECORD_FETCH_SUCCESS: { code: 200, message: 'Data fetched  succesfull' },
  RECORD_CREATE_SUCCESS: { code: 200, message: 'Data created  succesfull' },
  RECORD_UPDATE_SUCCESS: { code: 200, message: 'Data updated  succesfull' },
  RECORD_DELETE_SUCCESS: { code: 200, message: 'Data deleted  succesfull' },
  TRANSACTION_CREATE_SUCCESS: { code: 200, message: 'Transaction created  succesfull' },

  ACCESS_DENIED: { code: 403, message: 'Access denied' },
  INVALID_TOKEN: { code: 401, message: 'Access denied, Invalid Token Provided' },
  MISSING_TOKEN: { code: 401, message: 'Access denied, Invalid Token Provided' },

  JOI_VALIDATION_ERROR: { code: 422, message: 'Parameters missing or Invalid values passed...!' },
};
