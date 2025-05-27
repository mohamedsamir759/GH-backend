import * as axiosHelper from "./api_helper";

export const registerLiveAPI = async (params) => {
  try {
    const { user } = params;
    const url = "/register/live";
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerDemoAPI = async(params) =>{
  try {
    const { user } = params;
    const url = "/register/demo";
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const checkUserEmailApi = async (payload)=>{
  const {payload:{email}} = payload ;
  const result = await axiosHelper.get(`/customer/check-email?email=${email}`);
  if (result.isError)
    throw new Error(result.message);
  else return result;
};