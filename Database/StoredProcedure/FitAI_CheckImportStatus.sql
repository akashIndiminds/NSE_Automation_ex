
CREATE PROCEDURE [dbo].[FitAI_CheckImportStatus]
    @CompanyId VARCHAR(10) = 'COR0000002',
    @ImportDate DATETIME = NULL,
    @FinYear VARCHAR(10) = '2025-2026',
    @ExpectedUser VARCHAR(10) = '9999'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Set default import date if not provided
    IF @ImportDate IS NULL
        SET @ImportDate = CAST(GETDATE() AS DATE);
    
    -- Declare variables
    DECLARE @Segment_Fo INT, @Segment_Cm INT;
    
  -- Get FO segment ID
    SELECT @Segment_Fo = SegmentID
    FROM (
        SELECT DISTINCT Exchange_ShortName, exch_segmentId SegmentName, exch_internalId SegmentID, Company
        FROM (
            SELECT Exchange_ID, Exchange_Name, Exchange_ShortName, Exchange_CountryID, Exchange_IsCommodity,
                   Exchange_CurrencyID, LTRIM(RTRIM(Exchange_Name)) + ' [' + LTRIM(RTRIM(Exchange_ShortName)) + ']' AS FullName
            FROM Master_Exchange
        ) T1
        INNER JOIN (
            SELECT Exh_ShortName, exch_segmentId, exh_id, exh_name, exch_internalId, Exch_CompID Company
            FROM Tbl_Master_Exchange, Tbl_Master_CompanyExchange
            WHERE Exh_CntId = Exch_ExchID
        ) T2 ON LTRIM(RTRIM(Exchange_ShortName)) = LTRIM(RTRIM(Exh_ShortName))
    ) T3
    WHERE Exchange_ShortName = 'NSE' AND SegmentName = 'FO' AND Company = @CompanyID;
    
    -- Get CM segment ID
    SELECT @Segment_Cm = SegmentID
    FROM (
        SELECT DISTINCT Exchange_ShortName, exch_segmentId SegmentName, exch_internalId SegmentID, Company
        FROM (
            SELECT Exchange_ID, Exchange_Name, Exchange_ShortName, Exchange_CountryID, Exchange_IsCommodity,
                   Exchange_CurrencyID, LTRIM(RTRIM(Exchange_Name)) + ' [' + LTRIM(RTRIM(Exchange_ShortName)) + ']' AS FullName
            FROM Master_Exchange
        ) T1
        INNER JOIN (
            SELECT Exh_ShortName, exch_segmentId, exh_id, exch_internalId, Exch_CompID Company
            FROM Tbl_Master_Exchange, Tbl_Master_CompanyExchange
            WHERE Exh_CntId = Exch_ExchID
        ) T2 ON LTRIM(RTRIM(Exchange_ShortName)) = LTRIM(RTRIM(Exh_ShortName))
    ) T3
    WHERE Exchange_ShortName = 'NSE' AND SegmentName = 'CM' AND Company = @CompanyID;
    -- Final result set with import status for both segments
    SELECT 
        Segment,
        StoredProcedure,
        FileName,
        NoOfRecordsInserted,
        LastImportTime,
        ImportedByUserId,
        ImportedByUserName,
        IsManualImport,
        ImportStatusMessage
    FROM (
        -- CM Segment Results
        SELECT
            'CM' AS Segment,
            'UDIFF_NSECM_Trades' AS StoredProcedure,
            'Trade_NSE_CM_0_TM_*_#_F_0000.csv.gz' AS FileName,
            ISNULL(CM.NoOfRecords, 0) AS NoOfRecordsInserted,
            CM.LastImportTime,
            CM.ImportUserId AS ImportedByUserId,
            ISNULL(U1.user_name, ISNULL(U1.user_contactid, 'AI User')) AS ImportedByUserName,
            CASE 
                WHEN CM.NoOfRecords IS NULL OR CM.NoOfRecords = 0 THEN 'False'
                WHEN CM.ImportUserId = @ExpectedUser THEN 'False'  -- AI User = False (not manual)
                ELSE 'True'  -- All other users = True (manual)
            END AS IsManualImport,
            CASE 
                WHEN CM.NoOfRecords IS NULL OR CM.NoOfRecords = 0 THEN 'No records imported for CM segment on ' + CONVERT(VARCHAR(10), @ImportDate, 120)
                WHEN CM.ImportUserId = @ExpectedUser THEN 'Successfully imported by system on ' + CONVERT(VARCHAR(19), CM.LastImportTime, 120)
                ELSE 'Imported by ' + ISNULL(U1.user_name, ISNULL(U1.user_contactid, 'User ID: ' + CAST(CM.ImportUserId AS VARCHAR))) + ' [' + CAST(CM.ImportUserId AS VARCHAR) + '] on ' + CONVERT(VARCHAR(19), CM.LastImportTime, 120)
            END AS ImportStatusMessage
        FROM (
            SELECT      
                COUNT(1) AS NoOfRecords,
                MAX(ExchangeTrades_CreateDateTime) AS LastImportTime,
                MAX(ExchangeTrades_CreateUser) AS ImportUserId
            FROM Trans_ExchangeTrades
            WHERE ExchangeTrades_CompanyID = @CompanyId
                AND ExchangeTrades_FinYear = @FinYear
                AND ExchangeTrades_Segment = @Segment_Cm
                AND CAST(ExchangeTrades_CreateDateTime AS DATE) = @ImportDate  -- Changed to use CreateDateTime instead of TradeDate
        ) CM
        LEFT JOIN tbl_master_user U1 ON U1.user_id = CM.ImportUserId
        
        UNION ALL
        
        -- FO Segment Results
        SELECT
            'FO' AS Segment,
            'UDIFF_NSEFO_Trades' AS StoredProcedure,
            'Trade_NSE_FO_0_TM_*_#_F_0000.csv.gz' AS FileName,
            ISNULL(FO.NoOfRecords, 0) AS NoOfRecordsInserted,
            FO.LastImportTime,
            FO.ImportUserId AS ImportedByUserId,
            ISNULL(U2.user_name, ISNULL(U2.user_contactid, 'Unknown User')) AS ImportedByUserName,
            CASE 
                WHEN FO.NoOfRecords IS NULL OR FO.NoOfRecords = 0 THEN 'False'
                WHEN FO.ImportUserId = @ExpectedUser THEN 'False'  -- AI User = False (not manual)
                ELSE 'True'  -- All other users = True (manual)
            END AS IsManualImport,
            CASE 
                WHEN FO.NoOfRecords IS NULL OR FO.NoOfRecords = 0 THEN 'No records imported for FO segment on ' + CONVERT(VARCHAR(10), @ImportDate, 120)
                WHEN FO.ImportUserId = @ExpectedUser THEN 'Successfully imported by system on ' + CONVERT(VARCHAR(19), FO.LastImportTime, 120)
                ELSE 'Imported by ' + ISNULL(U2.user_name, ISNULL(U2.user_contactid, 'User ID: ' + CAST(FO.ImportUserId AS VARCHAR))) + ' [' + CAST(FO.ImportUserId AS VARCHAR) + '] on ' + CONVERT(VARCHAR(19), FO.LastImportTime, 120)
            END AS ImportStatusMessage
        FROM (
            SELECT
                COUNT(1) AS NoOfRecords,
                MAX(ExchangeTrades_CreateDateTime) AS LastImportTime,
                MAX(ExchangeTrades_CreateUser) AS ImportUserId
            FROM Trans_ExchangeTrades
            WHERE ExchangeTrades_CompanyID = @CompanyId
                AND ExchangeTrades_FinYear = @FinYear
                AND ExchangeTrades_Segment = @Segment_Fo
                AND CAST(ExchangeTrades_CreateDateTime AS DATE) = @ImportDate  -- Changed to use CreateDateTime instead of TradeDate
        ) FO
        LEFT JOIN tbl_master_user U2 ON U2.user_id = FO.ImportUserId
    ) FinalResults
    ORDER BY Segment;
    
END;
GO


