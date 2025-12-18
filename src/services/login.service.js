
import { authenticateLogin } from "../utils/authenticateLogin.js";
import getEncryptPwd from "../utils/encrypt.js";
import getLoginParams from "../utils/getLoginParams.js";
import getLoginPayload from "../utils/getLoginPayload.js";

export const loginService = async (loginData) => {
  // Validate and structure login data
  const loginParams = getLoginParams(loginData);

  const encryptedPwd =  getEncryptPwd( loginParams.password , loginParams.secretKey );


const messagePayload = getLoginPayload(loginParams.loginId , loginParams.memberCode , encryptedPwd);
console.log(messagePayload.password);
// return messagePayload;
  const response = await authenticateLogin(messagePayload);
  // Pass structured data to the model layer

  return response;
};


// const obj = {
//   "memberCode": "08565",
//   "loginId": "binay",
//   "token": "eyJhbGciOiJSUzI1NiJ9.eyJtZW1iZXJDZCI6IjA4NTY1Iiwic3ViIjoiMDg1NjUiLCJsb2dpbklkIjoiYmluYXkiLCJpc3MiOiJiaW5heSIsImV4cCI6MTc1NzU3NjAwNiwiaWF0IjoxNzU3NTcyNDA2LCJqdGkiOiJhZmQ4YWU4Zi1iNmNkLTQyODMtYmVhNi1lMzE0Y2MzMTc0MGUifQ.COnBtAb4o-f0czVFy62OfatpKLCVRhONBobKvnq9IVVWXfpBOpToVHOFTxkvjyVToLwDiv85YcVK0UtgHSvY5Q",
//   "tokenExpiry": "2025-09-11T07:03:27.288Z",
//   "password": "Okasha@123456",
//   "secretKey": "1z2qd07L2j139PWoZ85coeYM74qksgDuueRLabRtywc="
// } ;

// loginService(obj);