import fs from 'fs';
import path from 'path';
import getDateObj from '../utils/getDateObj.js';
import syncDateFormatReader from '../utils/syncDateFormatReader.js'
class taskArray {
    static instance;
    constructor() {
      if (taskArray.instance) {
        return taskArray.instance;
      }
      this.logDate = this.updateLogDate();
      // console.log(this.logDate);
      this.array = [];
      this.filePath= path.resolve(`./src/ActivityLog/${this.logDate}.json`);
      this.loadTaskDataSync();
      taskArray.instance = this;
    }
  
  async saveTaskData() {
    const data = this.array;

    try {
      await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true }); // Ensure directory exists
      await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Task data saved successfully.');
    } catch (error) {
      console.error('❌ Error saving Task data:', error);
    }
  }

  loadTaskDataSync() {
    try {
      console.log("loading task data");
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, 'utf8');
        const data = JSON.parse(rawData);
        this.array = data || [];
      } else {
        console.warn('⚠️ Task data file not found. Using default array.');
        this.saveTaskData();
      }
    } catch (error) {
      console.error('❌ Error loading Task data synchronously:', error);
    }
  }

  updateLogDate() {
    const dateObj = getDateObj(new Date());
    const str = syncDateFormatReader(dateObj ,'DD-MM-YYYY');
    taskArray.logDate = str;
     return str;
   }
    // Method to get the array
    getArray() {
      // this.saveTaskData();
      return this.array;
    }

    resetTask(){
      this.array = [];
      this.saveTaskData();
    }

    syncActivityLog(){
      const currentDate = this.updateLogDate();
      if(taskArray.instance.logDate != currentDate){
        console.log("📅 Detected date change! Rotating activity log...");
        this.logDate = this.updateLogDate();
        console.log(this.logDate);
        this.array = [];
        this.filePath= path.resolve(`./src/ActivityLog/${this.logDate}.json`);
        this.loadTaskDataSync();
      }
    }
    // // Method to update an object by ID
    // updateById(id, key, value) {
    //   const obj = this.array.find(item => item.id === id);
    //   if (obj) {
    //     obj[key] = value;
    //     return true; // Indicate successful update
    //   }
    //   return false; // Indicate failure
    // }
  }
  

  // function updateLogDate() {
  //   const dateObj = getDateObj(new Date());
  //   const str = dateFormatReader(dateObj ,'DD-MM-YYYY');
  //   taskArray.logDate = str;
  //    return str;
  //  }

  // const logDate = updateLogDate();
  const taskInstance = new taskArray();
  
  export default taskInstance;
  