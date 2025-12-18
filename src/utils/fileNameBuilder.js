import switchPlaceHolder from "./switchPlaceHolder.js";
// import checkChar from "./checkChar.js";
import getDateObj from "./getDateObj.js"; 
import dateFormatReader from "./dateFormatReader.js";

async function fileNameBuilder(date,file_name,format,spName,spParam , spParamValue, childPath , file_type,reserved,id){
   const _dateObj = getDateObj(date);
   const file_names=file_name.split(',');
   const formats=format.split(',');
   const spNames=spName.split(',');
   const spParams=spParam.split(',');
   const spParamValues = spParamValue.split(',');
   const childPaths = childPath.split(',');
   const file_types = file_type.split(',');
   const reserveds = reserved.split(',');
   const ids = id.split(',');

   if (
  file_names.length !== formats.length ||
  file_names.length !== spNames.length ||
  file_names.length !== spParams.length ||
  file_names.length !== spParamValues.length ||
  file_names.length !== childPaths.length ||
  file_names.length !== file_types.length ||
  file_names.length !== reserveds.length||
  file_names.length !== ids.length
) {
  throw new Error("Mismatch in config lengths. Check input configuration.");
}
   // console.log(file_types);
   let fileName =[];
   for (let index = 0; index < file_names.length; index++) {      
      const temp =await dateFormatReader(_dateObj,formats[index],file_types[index]);
      const newFileName =switchPlaceHolder(file_names[index]+`~${spNames[index]}~${spParams[index]}~${spParamValues[index]}~${childPaths[index]}~${file_types[index]}~${reserveds[index]}~${ids[index]}~${date}`, temp,date);
      // console.log(newFileName);
      fileName.push(newFileName);      
   }

   return fileName;
}


// function dateFormatReader(dateObj,formats){
//    const value = formats.split('-');
//    var str='';
//    value.forEach(element => {
//    str += checkChar(dateObj,element);
//    });
//    return str;
// }

export default fileNameBuilder;