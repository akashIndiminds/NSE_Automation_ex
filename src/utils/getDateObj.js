function getDateObj(date){
    const obj = {
    day : pad(date.getDate()), 
    month : pad(date.getMonth() + 1),  
    year : String(date.getFullYear())
    }
    return obj;
} 
const pad = (num) => String(num).padStart(2, '0');

export default getDateObj;
