import { getPool } from "../../connection.js";

const ifTradeFileImported = async(element) => {
    const pool = await getPool();
    const request = pool.request();
    const CompanyId = 'COR0000002';
    const ImportDate = element.createdTime.split(" ")[0]; 
    const FinYear = '2025-2026';
    const ExpectedUser = '111999';

    request.input('CompanyId', CompanyId);
    request.input('ImportDate', ImportDate);
    request.input('FinYear', FinYear);
    request.input('ExpectedUser', ExpectedUser);

    const result = await request.query(`
            EXEC [dbo].[FitAI_CheckImportStatus] 
                @CompanyId = @CompanyId,
                @ImportDate = @ImportDate,
                @FinYear = @FinYear,
                @ExpectedUser = @ExpectedUser
        `);
    if (!result.recordset || result.recordset.length === 0) {
        return;
    }
    const data = result.recordset;
    let finalData = {};
    let count = 0;
    data.forEach(row => {
        if(row.StoredProcedure == element.spName && row.Segment == element.segment){
            if(finalData.NoOfRecordsInserted !== 0) {
                if(element.spStatus === 404){
                    if(IsManualImport == true){
                      element.spStatus = "Manual"+row.ImportStatusMessage;
                  }
                  else {
                      element.spStatus ="AI"+row.ImportStatusMessage;
                    }
                }else {
                        if(element.spStatus.startsWith("Manual")){
                            element.spStatus = element.spStatus.substring("Manual".length).trim();
                        } else if(element.spStatus.startsWith("AI")){
                            element.spStatus = element.spStatus.substring("AI".length).trim();
                        } else if(element.spStatus.startsWith("Duplicate")){
                            element.spStatus = element.spStatus.substring("Duplicate".length).trim();
                        }
                        element.spStatus = "Duplicate"+element.spStatus+"-"+row.ImportStatusMessage;
                }
            }
        }
    })
}

export default ifTradeFileImported;