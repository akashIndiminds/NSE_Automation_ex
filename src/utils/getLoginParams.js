import LoginParams from "../models/loginParams.js";
import HttpError from "./HttpError.js";


 const getLoginParams = (data) => {
    try {
      return new LoginParams(data);
    } catch (error) {
      throw new HttpError(`Validation Error: ${error.message}`, 400);
    }
  };

  export default getLoginParams;