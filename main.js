import { buildTask, startDownload } from "./src/controllers/automation.controller.js";
import { loginController } from "./src/controllers/login.controller.js";
import getDetails from "./src/services/getDetails.js";

// Track last date when buildTask ran
let lastBuildDate = null;

async function automateDownload() {
    const LoginObj = getDetails();
    const LoginData = await loginController(LoginObj);

    console.log(LoginData);

    await startDownload();
}

async function checkDateAndRun() {
    const today = new Date();
    const todayStr = today.toDateString(); // e.g., "Mon Dec 15 2025"

    // If first run or date has changed, run buildTask
    if (!lastBuildDate || lastBuildDate !== todayStr) {
        console.log("Date changed or first run — building task...");
        console.log('hiting build');
        await buildTask();
        lastBuildDate = todayStr;
    }

    await automateDownload();
}

checkDateAndRun().catch(err => console.error("Error:", err));
// Run every 10 seconds (or adjust interval)
setInterval(() => {
    checkDateAndRun().catch(err => console.error("Error:", err));
}, 1800_000);
