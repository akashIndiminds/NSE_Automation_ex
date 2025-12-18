
import DownloadPayload from "../models/downloadPayload.js";
import HttpError from "./HttpError.js";


 const getdownloadPayload = (obj) => {
    try {
      const { token , dir , segment , folderPath , filename } = obj;
      return new DownloadPayload(token , dir , segment , folderPath , filename);
    } catch (error) {
      throw new HttpError(`Validation Error: ${error.message}`, 400);
    }
  };

  export default getdownloadPayload;

