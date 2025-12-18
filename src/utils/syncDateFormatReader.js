import checkChar from "./checkChar.js";

function syncDateFormatReader(dateObj,formats) {
    const value = formats.split('-');
    var str='';
    value.forEach(element => {
    str += checkChar(dateObj,element);
    });
    return str;
 }

export default syncDateFormatReader;