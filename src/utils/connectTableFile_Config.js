import { getPool } from '../../connection.js';

export default async function getFileConfigData() {
    try {
        // Connect to DB
        let pool = await getPool();
        
        // Run query
        let result = await pool.request()
            .query('SELECT * FROM File_Config');
        
        // Log results
        // console.log(result.recordset);

        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
}
