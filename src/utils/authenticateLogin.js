import { ExtranetPath } from '../config/environment.config.js';
// import HttpError from './HttpError.js';

export async function authenticateLogin(payload) {

  try {
    const baseUrl = ExtranetPath.Prod
    const version = ExtranetPath.Version
    const response = await fetch(`${baseUrl}/login/${version}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({loginId: payload.loginId, memberCode: payload.memberCode, password: payload.password}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

