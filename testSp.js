import dbConfig from "./src/config/db.config.js";
import sql from 'mssql';
import HttpError from "./src/utils/HttpError.js";
import saveExcel from "./src/utils/saveExcel.js";


let pool;
const initializePool = async () => {
  try {
    pool = await sql.connect(dbConfig);
  } catch (err) {
    console.error('Failed to initialize database connection pool', err);
  }
};

const closePool = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('Database connection pool closed');
    }
  } catch (err) {
    console.error('Error while closing the database connection pool', err);
  }
};

const callSP = async (filePath, spName, spParam, spParamValue,fileType) => {
  if (!pool) {
    throw new Error('Database connection pool is not initialized');
  }
  try {
    // Create the request
    const request = pool.request();
    const params = spParam.split('-');
    const values = spParamValue.split('-');
    request.input('FilePath', sql.VarChar, filePath);

    // Add each parameter dynamically to the request
    
    for (let i = 0; i < params.length; i++) {
      if (values[i] !== '' && values[i] !== null && values[i] !== undefined){
        // console.log(params[i]);
        // console.log(values[i]);
        if (values[i].includes('|')) {
          values[i] = values[i].replace(/|/g, '-');
        }
        request.input(params[i], sql.VarChar, values[i]);
      }
    }
    
    // Execute the stored procedure
    const result = await request.execute(spName);
    if (!result.recordset) {
      return "No table found";
    }
    // console.log(result);
    
    //const fpath = '////FITMINDS//Work//Application_Release//CommonFolderInfluxCRM//AutoDocs//ExcelFolder//excel.xlsx';
    
    if(fileType == 'E'){
      const fpath = './src/excel/ExcelFile.xlsx';
      saveExcel(result,fpath);
    }

    const columnName = Object.keys(result.recordset[0]);

    const Result_keys = Object.keys(result);
    //console.log(result[Result_keys[0]][0]);


    if (columnName) {
      const value = result.recordset[0][`${columnName[0]}`];
      return value;
    }

  } catch (err) {
    // console.log(spName + " : " + filePath);
    throw new HttpError(err, 400);
  }
};


await initializePool();


const filePath = 'D:\\Work\\Application_Release\\CommonFolderInfluxCRM\\AutoDocs\\member\\CM\\Reports\\C_08565_SEC_PLEDGE_07042025_01.csv';
const sp = 'Reco_NCLPledgeSecurities';
const params = 'CreateUser';
const spParamValue = '9999';
const fileType = 'E';

callSP(filePath, sp, params, spParamValue,fileType);

// export {callSP ,closePool,initializePool} ;

// spName: "SP_INSUP_Trans_DailyVar",
// spParam: "Module-ModifyUser-FileDate-ExcSegmt-FilePath",
// spParamValue: "DailyVar-9999-2024/12/28-1",