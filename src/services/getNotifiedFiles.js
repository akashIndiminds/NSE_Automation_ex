import sql from 'mssql';
import dbConfig from '../config/db.config.js';

const getNotifiedFilesList = async (id) => {
  try {
    id = String(id).trim(); // Ensure id is a clean string

    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM File_Config');
    const files = result.recordset;
    const ids = [];

    for (const file of files) {
      //console.log(`Checking file.id=${file.id}, notifyMe="${file.notifyMe}"`);

      if (file.notifyMe) {
        const userIds = file.notifyMe.split(',').map(x => x.trim());
        //console.log(`Parsed userIds:`, userIds);

        if (userIds.includes(id)) {
          console.log(`✅ Match found! Adding file.id=${file.id}`);
          ids.push(file.id);
        }
      }
    }

    return ids;

  } catch (error) {
    console.error("Error in getNotifiedFiles service:", error);
    return [];
  }
};

export default getNotifiedFilesList;
