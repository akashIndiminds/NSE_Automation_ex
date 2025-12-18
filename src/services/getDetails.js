import fs from 'fs';

export default function getDetails() {
    try {
        // Read the user details from a JSON file
        const data = fs.readFileSync('src/config/userData.json', 'utf8');
        
        // Parse the JSON data
        const userDetails = JSON.parse(data);
        
        // Return the user details
        return userDetails;
    } catch (error) {
        console.error("Error in getDetails:", error);
        throw error; // Re-throw the error for further handling
    }
}