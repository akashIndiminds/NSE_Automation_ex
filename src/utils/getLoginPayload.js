import LoginPayload from "../models/loginPayload.js";
import HttpError from "./HttpError.js";


 const getLoginPayload = (loginId , memberCode , Pwd) => {
    try {
      return new LoginPayload(loginId , memberCode , Pwd);
    } catch (error) {
      throw new HttpError(`Validation Error: ${error.message}`, 400);
    }
  };

  export default getLoginPayload;