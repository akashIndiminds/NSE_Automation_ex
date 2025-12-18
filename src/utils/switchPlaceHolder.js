import userInstance from "../models/User.model.js";

const switchPlaceHolder =(file_name,value,date)=>{
    if (file_name.includes("#")){
    
        file_name = file_name.replace("#", value); 
        
        if(file_name.includes("#")){
           const dateObj = new Date(date); // ensure it's a Date object
           const year = dateObj.getFullYear(); // e.g., 2025
           const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // months are 0-based
           const day = String(dateObj.getDate()).padStart(2, '0'); // e.g., 07
           const FormattedDate = `${year}|${month}|${day}`;
           file_name = file_name.replace("#", FormattedDate);
        }
            

        if (file_name.includes("*")){
            const user = userInstance.getUserData();
            file_name = file_name.replace("*", user.memberCode); 
        }
    }  

    return file_name;
}

export default switchPlaceHolder;

