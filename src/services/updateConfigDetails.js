import { getPool } from "../../connection.js";

async function updateFileConfig(id, fileData) {
  const pool = await getPool();

  console.log(fileData);
  // Get keys and values from fileData
  const keys = Object.keys(fileData);

  if (keys.length === 0) {
    throw new Error("No fields provided to update");
  }

  // Build SET clause dynamically -> "spName = @spName, spParam = @spParam"
  const setClause = keys.map((key) => `${key} = @${key}`).join(", ");

  // Build the query
  const query = `UPDATE File_Config SET ${setClause} WHERE id = @id`;
  console.log(query);

  // Prepare request
  const request = pool.request();
  request.input("id", id);

  keys.forEach((key) => {
    request.input(key, fileData[key]);
  });

  // Execute
  const result = await request.query(query);
  console.log(result);

  return result.rowsAffected[0]; // number of rows updated
}

export default updateFileConfig;