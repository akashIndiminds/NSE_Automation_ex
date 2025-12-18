export default class LoginPayload {
    constructor( loginId, memberCode , password) {
      // Validate required fields
      if (!loginId || !memberCode || !password) {
        throw new Error(
          "All fields (loginId, memberCode, password) are required."
        );
      }
  
      // Assign fields using camelCase convention
      this.loginId = loginId;
      this.memberCode = memberCode;
      this.password = password;
    }
  }

//   {
//     "memberCode":"06000",
//     "loginId":"ApiUser06000",
//     "password":"0CxUgThnqlK6gaKU2HnL2A=="
//     }
    