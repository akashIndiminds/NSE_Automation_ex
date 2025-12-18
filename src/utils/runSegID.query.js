import dbConfig from "../config/db.config.js";
import sql from "mssql";
import query from "../config/segID.query.js";

const runQuery = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(query);
        //console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        console.error("SQL error", error);
        throw error;
    } finally {
        sql.close();
    }
}

export default runQuery;






// const segmentID = {
//     CM:24,
//     FO:25
// };

// export default segmentID;

