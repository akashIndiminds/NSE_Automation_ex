import fs from 'fs';
import * as XLSX from 'xlsx';
import getLocalSQLDateTime from './toLocalISOString.js';


function saveExcel(result,fpath,element) {

    const dirPath = fpath.substring(0, fpath.lastIndexOf('/'));
    try{
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!result.recordset) {
        console.log("No table found");
        return;
    }
    const workbook = XLSX.utils.book_new();

        result.recordsets.forEach((recordset, index) => {
            const worksheet = XLSX.utils.json_to_sheet(recordset);
            const sheetName = `Sheet${index + 1}`; // Sheet1, Sheet2, ...
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

    XLSX.writeFile(workbook, fpath);
    console.log(`Excel file saved to ${fpath}`);
    }
   catch(e){
    console.log("Error in saving the file",e);
    }
    finally{
        let now = new Date();
        element.lastModified =getLocalSQLDateTime(now);
    }
}


export default saveExcel;
