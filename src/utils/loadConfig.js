import { readFile } from 'fs/promises';

async function loadConfig() {
    try{
        const data = await readFile('src/customConfig/config.json', 'utf-8');
        const config = JSON.parse(data);   // Convert JSON string to JS object
    return config;
    }
    catch (error) {
        console.error("Error loading config file:", error.message);
        return null; // or throw error again if you want to handle it upstream
    }
}

export default loadConfig;
  
