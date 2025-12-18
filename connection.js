import dbConfig from "./src/config/db.config.js";
import sql from 'mssql';
import HttpError from "./src/utils/HttpError.js";
import saveExcel from "./src/utils/saveExcel.js";
import server_config from "./src/config/server.config.js";
import getLocalSQLDateTime from "./src/utils/toLocalISOString.js";
let pool = null;
let isConnecting = false;
const initializePool = async () => {
    try {
    if (pool && pool.connected) {
    return pool;
    }
    if (isConnecting) {
      // Wait for existing connection attempt
      while (isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return pool;
    }
    isConnecting = true;
    console.log('Initializing database connection pool...');
    pool = await sql.connect(dbConfig);
    console.log('Database connection pool initialized successfully');
    // Add error handlers
    pool.on('error', (err) => {
      console.error('Database pool error:', err);
      pool = null;
    });
    return pool;
  } catch (err) {
    console.error('Failed to initialize database connection pool:', err);
    pool = null;
    throw err;
  } finally {
    isConnecting = false;
  }
};
const getPool = async () => {
  try {
    // If pool exists and is connected, return it
    if (pool && pool.connected) {
      return pool;
    }
    // If pool doesn't exist or is not connected, initialize it
    return await initializePool();
  } catch (err) {
    console.error('Failed to get database connection pool:', err);
    throw err;
  }
};
const closePool = async () => {
  try {
    if (pool && pool.connected) {
      await pool.close();
      console.log('Database connection pool closed');
    }
    pool = null;
  } catch (err) {
    console.error('Error while closing the database connection pool:', err);
    pool = null;
  }
};
const callSP = async (filePath, spName, spParam, spParamValue, filetype, filename, element) => {
  try {
    const currentPool = await getPool();
    if (!currentPool) {
    throw new Error('Database connection pool is not initialized');
    }
    if (spName == '' || spName == null || spName == undefined || spName == '-') {
      return -1;
    }
    // Create the request
    const request = currentPool.request();
    const params = spParam.split('-');
    const values = spParamValue.split('-');
    if (params.includes("Date")) {
      const index = params.indexOf("Date");
      const temp = new Date(element.date);
      const formattedDate = `${temp.getFullYear()}-${(temp.getMonth() + 1).toString().padStart(2, '0')}-${temp.getDate().toString().padStart(2, '0')}`;
      console.log(values[index]);
      values[index] = formattedDate;
      console.log(values[index]);
    }
    if (params[0] == 'file_path') {
      values[0] = filePath;
    } else {
      request.input('FilePath', sql.VarChar, filePath);
    }
    // Add each parameter dynamically to the request
    for (let i = 0; i < params.length; i++) {
      if (values[i] !== '' && values[i] !== null && values[i] !== undefined) {
        if (values[i].includes('|')) {
          values[i] = values[i].replace(/\|/g, '-');
        }
        request.input(params[i], sql.VarChar, values[i]);
      }
    }
    // Execute the stored procedure
    const result = await request.execute(spName);
    console.log(result);
    console.log(result.recordset);
    if (result) {
      let now = new Date();
      element.spTime = getLocalSQLDateTime(now);
      element.lastModified = getLocalSQLDateTime(now);
    }
    if (!result.recordset || result.recordset.length === 0) {
      return 0;
    }
    if (filetype == "E") {
      const base = server_config.ePath;
      const fpath = `${base}/${filename}_report.xlsx`;
      saveExcel(result, fpath, element);
    }
    const columnName = Object.keys(result.recordset[0]);
    if (columnName) {
      const value = result.recordset[0][`${columnName[0]}`];
      element.spStatus = value;
    }
    return result;
  } catch (err) {
    console.log(spName + " : " + filePath);
    console.log(err);
    throw err;
  }
};
const callSPforxml = async (filePath, spName, spParam, spParamValue, filetype, filename, element, xml) => {
  try {
    const currentPool = await getPool();
    if (!currentPool) {
      throw new Error('Database connection pool is not initialized');
    }
    // Create the request
    const request = currentPool.request();
    const params = spParam.split('-');
    const values = spParamValue.split('-');
    // Add each parameter dynamically to the request
    if (xml != null && xml != undefined) {
      request.input('cashBankData', sql.NVarChar(sql.MAX), xml);
    }
    for (let i = 0; i < params.length; i++) {
      if (values[i] !== '' && values[i] !== null && values[i] !== undefined) {
        if (values[i].includes('|')) {
          values[i] = values[i].replace(/\|/g, '-');
        }
        request.input(params[i], sql.VarChar, values[i]);
      }
    }
    // Execute the stored procedure
    const result = await request.execute(spName);
    if (result) {
      console.log("SP for XML hit successfull");
      let now = new Date();
      element.spTime = getLocalSQLDateTime(now);
      element.lastModified = getLocalSQLDateTime(now);
    }
    if (!result.recordset) {
      return 0;
    } else {
      element.spStatus = "Second SP for XML hit successfull";
    }
    return result;
  } catch (err) {
    console.log(spName + " : " + filePath);
    console.log(err);
    throw err;
  }
};
// Initialize the pool when the application starts
// Call this once when your app starts
const initializeApp = async () => {
  try {
    await initializePool();
  } catch (err) {
    console.error('Failed to initialize app:', err);
  }
};
export { callSP, closePool, initializePool, getPool, callSPforxml, initializeApp };