import HttpError from "./HttpError.js";
// console.log("hello world");
const checkChar = (dateObj,temp)=>{
    const l = temp.length;
    // console.log(l);
    const t = temp.charAt(l-1);
    const c = temp.charAt(0);
     switch (c) {
         case 'D':
            let Day = dateObj.day;
            if(t == '|'){Day += '-' }
             return Day;
         case 'M':
                if (l >= 3) {
                // Return short month name (e.g., "Jul")
                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                let Month = monthNames[dateObj.month - 1];
                if(t == '|'){Month += '-' }
                return Month;
            } else {
                let Month = String(dateObj.month).padStart(2, '0');
                if(t == '|'){Month += '-' }
                return Month;
            }
         case 'Y':
             let Year = (l>2)? dateObj.year : dateObj.year.slice(2) ;
             if(t == '|'){Year += '-' }
             return Year;
         default:
             throw new HttpError("Unexpected charecter Token encounterd in Format String", 500);
     }
 };
 export default checkChar;
// const dateObj = {
//     day : 12,
//     month : 12,
//     year : 25
//     }
// console.log(checkChar(dateObj,"YYYY"));