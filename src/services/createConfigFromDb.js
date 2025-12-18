import getFileConfigData from "../utils/connectTableFile_Config.js";
import fs from "fs";


async function createConfigFromDb(ids) {
  let numberArray = ids.map(Number);
  console.log("Number Array", numberArray);
    try {
        
        const fileConfigData = await getFileConfigData();
        //console.log("File Config Data", fileConfigData); 
        const finalConfig = {};
        for (const row of fileConfigData) {

          if(numberArray.includes(row.id)) {
          //console.log("Row", row);
            const dirName = row.dirName;
            const segment = row.segment;
            const folderName = row.folderName;
      
            // Ensure valid data for dirName, segment, and folderName
            if (dirName && segment && folderName) {
              // If the dirName doesn't exist in finalConfig, create it
              if (!finalConfig[dirName]) {
                finalConfig[dirName] = {};  // Initialize dirName as an object
              }
      
              // If the segment doesn't exist in the dir, create it
              if (!finalConfig[dirName][segment]) {
                finalConfig[dirName][segment] = {};  // Initialize segment as an object
              }
      
              // Add the folder data under the correct segment
              if (!finalConfig[dirName][segment][folderName]) {
              finalConfig[dirName][segment][folderName] = {
                file_name: row.file_name,
                file_type: row.file_type,
                format: row.format,
                spName: row.spName,
                spParam:  row.spParam,
                spParamValue: row.spParamValue,
                childPath: row.childPath,
                reserved: row.reserved,
                id:`${row.id}`
              };
            }
            else{
              const target = finalConfig[dirName][segment][folderName];
                 //these lines will append the values to the existing ones seperated by comma
                target.file_name = target.file_name
                ?`${target.file_name},${row.file_name}`: row.file_name;
                  

                target.file_type = target.file_type
                  ? `${target.file_type},${row.file_type}`: row.file_type;

                target.format = target.format
                  ? `${target.format},${row.format}`: row.format;

                target.spName = target.spName
                  ? `${target.spName},${row.spName}`: row.spName;

                target.spParam = target.spParam
                  ? `${target.spParam},${row.spParam}`: row.spParam;

                target.spParamValue = target.spParamValue
                  ? `${target.spParamValue},${row.spParamValue}`: row.spParamValue;

                target.childPath = `${target.childPath},${row.childPath}`;

                if (target.reserved !== undefined && target.reserved !== null) {
                    target.reserved += `,${row.reserved}`;
                } else {
                    target.reserved = row.reserved;
                }

                target.id=target.id
                ? `${target.id},${row.id}`:`${row.id}`

            }
          }
        
          }
        }

        for (const dir in finalConfig) {
          for (const segment in finalConfig[dir]) {
            for (const folder in finalConfig[dir][segment]) {
              const configItem = finalConfig[dir][segment][folder];
        
              // Wrap all string values in backticks
              for (const key in configItem) {
                if (typeof configItem[key] === "string") {
                  configItem[key] = `\`${configItem[key].replace(/`/g, '')}\``; // avoid nested backticks
                }
              }
            }
          }
        }
        
        // Now write to a .js file with no quotes around backtick values
        const fileContent = 
        `import segid from '../config/createSegid.js';
      const { CM, FO } = segid;
      
      const finalConfig = ${JSON.stringify(finalConfig, null, 2)
        .replace(/"(`[^`]*?`)"/g, (_, backtickString) => backtickString)};
      
      export default finalConfig;
      `;
      
        
        fs.writeFileSync("src/customConfig/config.js", fileContent, "utf8");
        
        console.log("config.js written successfully");
          // fs.writeFileSync(
          //   "src/customConfig/config.json", 
          //   JSON.stringify(finalConfig, null, 2), // Add formatting with 2-space indentation
          //   "utf8"
          // );
          // console.log("File written successfully");
          return true;
        
          
  }
  

catch(e){
    console.log("Error in createConfig",e);
    return false;
}
}

export default createConfigFromDb;
