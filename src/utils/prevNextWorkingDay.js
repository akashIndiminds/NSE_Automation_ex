import sql from 'mssql';
import dbConfig from '../config/db.config.js';
import getDateObj from './getDateObj.js';

const getPrevNextWorkingDay = async (dateObj,type) => {
    const dateString = `${dateObj.year}-${dateObj.month}-${dateObj.day}`
    //console.log(dateString,typeof dateString);
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
      .input('TrDate', sql.DateTime, dateString)
      .input('Exchange', sql.VarChar, '1')
      .input('Type', sql.Char, type)
      .input('Days', sql.Int, 1)
      .query(`
        SELECT dbo.udf_NextWorkingDay(@TrDate, @Exchange, @Type, @Days) AS NextWorkingDay
      `);
      //console.log(result.recordset[0].NextWorkingDay, typeof result.recordset[0].NextWorkingDay);
      //console.log(result.recordset[0].NextWorkingDay);
      console.log(result.recordset[0].NextWorkingDay,typeof result.recordset[0].NextWorkingDay);
      dateObj = getDateObj(result.recordset[0].NextWorkingDay);
      //console.log(dateObj, typeof dateObj.day);
      return dateObj;
    }
    catch (error) {
        console.error("Error executing query:", error);
        throw error; // Rethrow the error for further handling
    }
}

// const d = {
//     day: '01',
//     month: '12',
//     year: '2023'
// }
// const ans = await getPrevNextWorkingDay(d,'P');
// console.log(ans);
export default getPrevNextWorkingDay;