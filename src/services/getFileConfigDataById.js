import { getPool } from "../../connection.js";

const getFileConfigDataById = async (id) => {
    const pool = await getPool();
        // Run query
    let result = await pool.request().query('SELECT * FROM File_Config');
        
    const data = result.recordset.find(item => item.id === id);
    return data ? data : null;
}

export default getFileConfigDataById;   