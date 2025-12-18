import { getPool } from "../../connection.js";

async function getImportFileStatus(){
    try {
        const pool = await getPool();
        const query = `EXEC FitAi_FitOffice_Import_Files_Status`;
        const result = await pool.request().query(query);
        //console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        console.error("Error in getImportFileStatus:", error);
    }
}

export default getImportFileStatus;