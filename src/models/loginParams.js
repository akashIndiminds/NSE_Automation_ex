
export default class LoginParams {
  constructor({ loginId, memberCode, password, secretKey }) {
    // Validate required fields
    if (!loginId || !memberCode || !password || !secretKey) {
      throw new Error(
        "All fields (loginId, memberCode, password, secretKey) are required."
      );
    }

    // Assign fields using camelCase convention
    this.loginId = loginId;
    this.memberCode = memberCode;
    this.password = password;
    this.secretKey = secretKey;
  }
}
