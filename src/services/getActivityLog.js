import fs from 'fs';

export default function getActivityLog(date) {
    const path = `src/ActivityLog/${date}.json`
    if(fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8');
        return data;
    }
    else {
        console.log("Activity log not found for the date: ", date);
    }
}