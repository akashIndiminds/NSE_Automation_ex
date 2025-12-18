import { loginService } from "../services/login.service.js";
import userInstance from "../models/User.model.js";
export const loginController = async (obj) => {
  try {


    const loginCredentials = await loginService(obj);
    if(loginCredentials){
      if( loginCredentials.status == 'success' ){
        console.log('Logging Successfull');
        userInstance.setUserData({ memberCode: loginCredentials.memberCode, loginId: loginCredentials.loginId, token: loginCredentials.token });
        
      }
      else{
        console.log({ success: false, msg: loginCredentials , responseCode: loginCredentials.responseCode  });
      }
    }
    // res.status(200).json({ success: true, data: loginCredentials });
  } catch (error) {
    next(error); // Forward to an error handler
  }
};