import checkChar from "./checkChar.js";
import getPrevNextWorkingDay from "./prevNextWorkingDay.js";

async function dateFormatReader(dateObj,formats,file_type) {
    if (file_type === 'T'){
        const res =  await getPrevNextWorkingDay(dateObj,'N');
        dateObj = res;
    }
    else if (file_type === 'Y'){
        const res =  await getPrevNextWorkingDay(dateObj,'P');
        dateObj = res;
    }
        
    //console.log(dateObj, typeof dateObj.day,file_type);
    const value = formats.split('-');
    var str='';
    value.forEach(element => {
    str += checkChar(dateObj,element);
    });
    return str;
 }

export default dateFormatReader;