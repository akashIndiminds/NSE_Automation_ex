import { ExtranetPath } from '../config/environment.config.js';
import HttpError from './HttpError.js';
import getLocalSQLDateTime from './toLocalISOString.js';

export async function downloadFile(payload,element) {
  let now = new Date();
  element.lastModified = getLocalSQLDateTime(now);
  try {
    // console.log(payload);
    // console.log(payload.segment);
    const baseUrl = ExtranetPath.Prod;
    const version = ExtranetPath.Version;
    const dir = payload.dir;
    const params = {segment: payload.segment, folderPath: payload.folderPath, filename: payload.filename};
    const queryString = new URLSearchParams(params).toString();
    const URL = `${baseUrl}${dir}/file/download/${version}?${queryString}`;
    // console.log(URL);

    const response = await fetch(`${URL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${payload.token}`, // Set the token as a Bearer token
        'Content-Type': 'application/json', // Specify the content type
      },
    });
    if(response.status == 200){
      now = new Date();
      element.dlTime = getLocalSQLDateTime(now);
      element.lastModified =getLocalSQLDateTime(now);
    }
    
    if (response.status != 200) {
      // console.log(payload.filename);
      throw new HttpError(`Unable To Download File: ${payload.filename} `, response.status);

    }
    
    const data = await response.arrayBuffer();
    return data;
    
  } catch (error) {
    return error;
  }
}

// https://www.connect2nse.com/extranet-api/common/file/download/2.0