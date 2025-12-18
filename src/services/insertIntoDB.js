import { getPool } from "../../connection.js";
import toXML2 from "../utils/toXML2.js";
import TaskInstance from "../models/taskArray.js";
import sql from 'mssql';

async function insertIntoDB() {
    try {
        // Get database connection
        const pool = await getPool();
        const request = pool.request();

        // Get data and validate
        const data = TaskInstance.getArray();
        //console.log('Data from weekTaskInstance:', JSON.stringify(data, null, 2));
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error("Invalid or empty data from weekTaskInstance");
        }

        // Convert to XML and validate
        const xmlData = toXML2(data);
        //console.log('Generated XML:', xmlData);
        if (!xmlData) {
            throw new Error("No XML data generated");
        }

        // Set input parameters
        const date = new Date();
        const formattedDate = formatDate(date);
        console.log('Formatted Date:', formattedDate);

        request.input('TableName', sql.VarChar, 'FitAi_LiveTaskStatus');
        request.input('xmlData', sql.NVarChar, xmlData);
        request.input('Date', sql.VarChar, formattedDate);

        // Execute stored procedure
        const result = await request.execute('FitAi_DbHelper');
        console.log('Stored procedure result:', JSON.stringify(result, null, 2));

        // Check result
        if (result.recordset && result.recordset[0]?.Status === 'ERROR') {
            throw new Error(`Stored procedure failed: ${result.recordset[0].Message}`);
        }

        return result;
    } catch (error) {
        console.error(`Error inserting data into the database: ${error.message}`);
        throw error;
    }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default insertIntoDB;