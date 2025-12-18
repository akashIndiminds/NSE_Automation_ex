import fs from 'fs';
import path from 'path';

class User {
  static instance;
  static filePath = path.resolve('./src/config/userData.json'); // Ensure correct file path

  constructor() {
    if (User.instance) {
      return User.instance;
    }

    this.memberCode = null;
    this.loginId = null;
    this.token = null;
    this.tokenExpiry = null;
    const storedData = fs.readFileSync(User.filePath, 'utf8');
    const data = JSON.parse(storedData);
    this.password = data.password;
    this.secretKey = data.secretKey;

    this.loadUserDataSync(); // Load data synchronously in constructor
    User.instance = this;
  }

  async setUserData({ memberCode, loginId, token }) {
    this.memberCode = memberCode;
    this.loginId = loginId;
    this.token = token;
    this.tokenExpiry = this.generateExpiry();
    this.password = this.password || null; 
    this.secretKey = this.secretKey || null;


    await this.saveUserData();
  }

  getUserData() {
    return {
      memberCode: this.memberCode,
      loginId: this.loginId,
      token: this.token,
      tokenExpiry: this.tokenExpiry,
    };
  }

  async saveUserData() {
    const data = {
      memberCode: this.memberCode,
      loginId: this.loginId,
      token: this.token,
      tokenExpiry: this.tokenExpiry,
      password: this.password,
      secretKey:this.secretKey
    };

    try {
      await fs.promises.mkdir(path.dirname(User.filePath), { recursive: true }); // Ensure directory exists
      await fs.promises.writeFile(User.filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ User data saved successfully.');
    } catch (error) {
      console.error('❌ Error saving user data:', error);
    }
  }

  async loadUserData() {
    try {
      if (fs.existsSync(User.filePath)) {
        const rawData = await fs.promises.readFile(User.filePath, 'utf8');
        const data = JSON.parse(rawData);
        this.memberCode = data.memberCode || null;
        this.loginId = data.loginId || null;
        this.token = data.token || null;
        this.tokenExpiry = data.tokenExpiry || null;
        this.password = data.password || null;
        this.secretKey = data.secretKey || null;
      } else {
        console.warn('⚠️ User data file not found. Using default values.');
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      this.resetData(); // Reset to defaults on failure
    }
  }

  loadUserDataSync() {
    try {
      if (fs.existsSync(User.filePath)) {
        const rawData = fs.readFileSync(User.filePath, 'utf8');
        const data = JSON.parse(rawData);
        this.memberCode = data.memberCode || null;
        this.loginId = data.loginId || null;
        this.token = data.token || null;
        this.tokenExpiry = data.tokenExpiry || null;
        this.password = data.password || null;
        this.secretKey = data.secretKey || null;
      } else {
        console.warn('⚠️ User data file not found. Using default values.');
      }
    } catch (error) {
      console.error('❌ Error loading user data synchronously:', error);
      this.resetData();
    }
  }

 async resetData() {
    this.memberCode = null;
    this.loginId = null;
    this.token = null;
    this.tokenExpiry = null;
    await this.saveUserData();
  }

  generateExpiry(){
     return new Date(Date.now()+ 30 * 60 * 1000).toISOString(); // min * sec * ms
  }
  isExpired(){
    if(!this.tokenExpiry || new Date()> new Date(this.tokenExpiry)){
      return true;
    }
    else {
      return false;
    }
  }
}


// Export a single instance
const userInstance = new User();

export default userInstance;
