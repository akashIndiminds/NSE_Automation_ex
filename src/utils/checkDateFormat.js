import HttpError from "./HttpError.js";

function checkDateFormat(date){
    
    const parsedDate = new Date(date);
    const temp = date.split('-');
    const currentDate =new Date();

    if (isNaN(parsedDate)) {
        return false;
    }
    
    else if(temp[0].length!=4 || parsedDate > currentDate)
        {
            throw new HttpError("Invalid Year or Date", 402);
        } 
    
    else return parsedDate;
}

export default checkDateFormat;