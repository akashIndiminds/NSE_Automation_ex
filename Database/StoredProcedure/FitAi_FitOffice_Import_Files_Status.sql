
Create PROC [dbo].[FitAi_FitOffice_Import_Files_Status]
AS
BEGIN
   DECLARE @CompanyId VARCHAR(10)='COR0000002', @ImportDate DATETIME=CAST(GETDATE() AS DATE), @FinYear Varchar(10)='2025-2026'
	-- Margin Files Import Status Query - Both CM and FO
	DECLARE @Segment_Fo INT, @Segment_Cm INT
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



-- SP1: UDIFF_NSECM_MarginP (CM Margin Files)
SELECT
    'CM' AS Segment,
    'UDIFF_NSECM_MarginP' AS StoredProcedure,
    ft.FileType,
    ft.FileNamePattern,
    ISNULL(id.NoOfRecords, 0) AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS Status,
    id.LastImportTime,
    ts.filename,
    ts.spStatus,
    ts.spTime
FROM (
    VALUES
        ('i01', 'Margin_NCL_CM_0_CM_%_P_1100.csv.gz'),
        ('i02', 'Margin_NCL_CM_0_CM_%_P_1230.csv.gz'),
        ('i03', 'Margin_NCL_CM_0_CM_%_P_1430.csv.gz'),
        ('i04', 'Margin_NCL_CM_0_CM_%_P_1530.csv.gz'),
        ('i05', 'Margin_NCL_CM_0_CM_%_P_0000.csv.gz')
) AS ft(FileType, FileNamePattern)
LEFT JOIN (
    SELECT
        CMMarginSummaryID_FileType AS FileType,
        COUNT(1) AS NoOfRecords,
        MAX(CMMarginSummaryID_CreateDateTime) AS LastImportTime
    FROM Trans_CMMarginSummary_ID
    WHERE CMMarginSummaryID_CompanyID = @CompanyId
	    AND CMMarginSummaryID_FinYear=@FinYear
        AND CMMarginSummaryID_ExchangeSegmentID = CAST(@Segment_Cm AS VARCHAR(10))
        AND CMMarginSummaryID_CreateUser = 111999
        AND CAST(CMMarginSummaryID_CreateDateTime AS DATE) = @ImportDate
    GROUP BY CMMarginSummaryID_FileType
) AS id ON ft.FileType = id.FileType
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSECM_MarginP'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
) AS ts ON ts.filename LIKE ft.FileNamePattern

UNION ALL

---- SP2: UDIFF_NSEFO_Margin (FO Margin Files)
SELECT
    'FO' AS Segment,
    'UDIFF_NSEFO_Margin' AS StoredProcedure,
    ft.FileType,
    ft.FileNamePattern AS FilePattern,
    ISNULL(id.NoOfRecords, 0) AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    id.LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    VALUES
        ('i01', 'Margin_NCL_FO_0_CM_*_#_P_1100.csv.gz'),
        ('i02', 'Margin_NCL_FO_0_CM_*_#_P_1230.csv.gz'),
        ('i03', 'Margin_NCL_FO_0_CM_*_#_P_1430.csv.gz'),
        ('i04', 'Margin_NCL_FO_0_CM_*_#_P_1530.csv.gz'),
        ('i05', 'Margin_NCL_FO_0_CM_*_#_F_0000.csv.gz')
) AS ft(FileType, FileNamePattern)
LEFT JOIN (
    SELECT
        DailyFOMarginID_FileType AS FileType,
        COUNT(1) AS NoOfRecords,
        MAX(DailyFOMarginID_CreateDateTime) AS LastImportTime
    FROM Trans_DailyFOMargin_ID
    WHERE DailyFOMarginID_CompanyID = @CompanyID
	    AND DailyFOMarginID_FinYear = @FinYear
        AND DailyFOMarginID_ExchangeSegmentID = CAST(@Segment_Fo AS VARCHAR(10))
        AND DailyFOMarginID_CreateUser = 111999
        AND CAST(DailyFOMarginID_CreateDateTime AS DATE) = @ImportDate
    GROUP BY DailyFOMarginID_FileType
	Union
   SELECT
        DailyFOMargin_FileType AS FileType,
        COUNT(1) AS NoOfRecords,
        MAX(DailyFOMargin_CreateDateTime) AS LastImportTime
    FROM Trans_DailyFOMargin
    WHERE DailyFOMargin_CompanyID = @CompanyID
	    AND DailyFOMargin_FinYear = @FinYear
        AND DailyFOMargin_ExchangeSegmentID = CAST(@Segment_Fo AS VARCHAR(10))
        AND DailyFOMargin_CreateUser = 111999
        AND CAST(DailyFOMargin_CreateDateTime AS DATE) = @ImportDate
    GROUP BY DailyFOMargin_FileType
) id ON ft.FileType = id.FileType
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSEFO_Margin'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
) ts ON ts.filename LIKE REPLACE(REPLACE(ft.FileNamePattern, '*', '%'), '#', '%')

UNION ALL

-- SP3: UDIFF_NSE_DeliveryDpo (Delivery DPO Files)
 SELECT
    'CM' AS Segment,
    'UDIFF_NSE_DeliveryDpo' AS StoredProcedure,
    'DeliveryDpo Files' AS FileType,
    'DeliveryDpo_NCL_CM_EquityT1_CM_*_#_*.csv.gz' AS FileNamePattern,
    CASE
        WHEN ts.spStatus = 'Imported' AND id.NoOfRecords > 0 THEN id.NoOfRecords
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN ts.spStatus = 'Imported' AND id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    CASE 
        WHEN id.NoOfRecords > 0 THEN id.LastImportTime
        ELSE COALESCE(ts.spTime, '1900-01-01 00:00:00.000')
    END AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(DematTransactions_CreateDateTime) AS LastImportTime
    FROM Trans_DematTransactions
    WHERE DematTransactions_CompanyID = @CompanyId
        AND DematTransactions_FinYear = @FinYear
        AND DematTransactions_SegmentID = CAST(@Segment_Cm AS VARCHAR(10))
        AND DematTransactions_CreateUser = '111999'
        AND CAST(DematTransactions_CreateDateTime AS DATE) = @ImportDate
        AND DematTransactions_SourceFile LIKE 'DeliveryDpo_NCL_CM_EquityT1_CM_%'
) id
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSE_DeliveryDpo'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'DeliveryDpo_NCL_CM_%'
) ts ON 1 = 1

      

UNION ALL

---- SP4: NSESettCalender_CSV23 (Settlement Calendar Files)


SELECT
    'CM' AS Segment,
    'NSESettCalender_CSV23' AS StoredProcedure,
    'SETTLEMENT' AS FileType,
    'SettlementMaster_NCL_CM_0_0_0_#00_0_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    CASE 
        WHEN ts.spTime IS NOT NULL AND ts.spTime > '1900-01-01' THEN ts.spTime 
        WHEN id.LastImportTime IS NOT NULL AND id.LastImportTime > '1900-01-01' THEN id.LastImportTime 
        ELSE NULL 
    END AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(Settlements_CreateDateTime) AS LastImportTime
    FROM Master_Settlements
    WHERE Settlements_FinYear =@FinYear
        AND CAST(Settlements_StartDateTime AS DATE) = @ImportDate
        ) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'NSESettCalender_CSV23'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'SettlementMaster_NCL_CM_%'
) ts ON 1 = 1

UNION ALL

---- SP5: SP_INSUP_Trans_DailyVar (Daily VAR Files)
SELECT
    'CM' AS Segment,
    'SP_INSUP_Trans_DailyVar' AS StoredProcedure,
    'VAR_RATES' AS FileType,
    'C_VAR1_#_6.DAT' AS FileNamePattern,
    CASE
        WHEN  id.NoOfRecords > 0 THEN id.NoOfRecords
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(DailyVar_CreateDateTime) AS LastImportTime
    FROM Trans_DailyVar
    WHERE DailyVar_CompanyID= @CompanyId
	    AND DailyVar_FinYear = @FinYear
        AND DailyVar_Date = @ImportDate
        AND DailyVar_CreateUser = 111999
) id
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'SP_INSUP_Trans_DailyVar'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_VAR1_%'
) ts ON 1 = 1

UNION ALL

---- SP6: Import_NSE_SA04 (Short Allocation Files)
SELECT
    'CM' AS Segment,
    'Import_NSE_SA04' AS StoredProcedure,
    'SHORT_ALLOC' AS FileType,
    'C_SA04_*_#.lis.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(ShortAlloc_CreateTime) AS LastImportTime
    FROM Trans_ShortAlloc
    WHERE ShortAlloc_CompanyID = @CompanyId
	    AND ShortAlloc_FinYear=@FinYear
        AND ShortAlloc_Segment = CAST(@Segment_Cm AS INT)
        AND CAST(ShortAlloc_Date AS DATE) = @ImportDate
        AND ShortAlloc_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSE_SA04'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_SA04_%'
) ts ON 1 = 1

UNION ALL

---- SP7: Import_NSECM_MWST (STT Files)
SELECT
    'CM' AS Segment,
    'Import_NSECM_MWST' AS StoredProcedure,
    'STT_FILES' AS FileType,
    'STT_NCL_CM_0_CM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    CASE 
        WHEN ts.spTime IS NOT NULL THEN ts.spTime 
        WHEN id.LastImportTime IS NOT NULL THEN id.LastImportTime 
        ELSE NULL 
    END AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(Sttax_CreateDateTime) AS LastImportTime
    FROM Trans_Sttax
    WHERE Sttax_CompanyID = @CompanyId
        AND Sttax_FinYear = @FinYear
        AND Sttax_SegmentID = CAST(@Segment_Cm AS INT)
        AND CAST(Sttax_STTDate AS DATE) = @ImportDate
        AND Sttax_CreateUser = 111999
) id
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSECM_MWST'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'STT_NCL_CM_%'
) ts ON 1 = 1

UNION ALL

---- SP8: Import_NSECM_MG13 (Margin Files)

SELECT
    'CM' AS Segment,
    'Import_NSECM_MG13' AS StoredProcedure,
    'MG13_MARGIN' AS FileType,
    'C_MG13_*_#.lis.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(CMMarginSummary_CreateDateTime) AS LastImportTime
    FROM Trans_CMMarginSummary
    WHERE CMMarginSummary_CompanyID = @CompanyId
	    AND CMMarginSummary_FinYear	=@FinYear
        AND CMMarginSummary_ExchangeSegmentID = CAST(@Segment_Cm AS INT)
        AND CAST(CMMarginSummary_Date AS DATE) = @ImportDate
        AND CMMarginSummary_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSECM_MG13'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_MG13_%'
) ts ON 1 = 1

UNION ALL

---- SP9: Import_NSCCL_MarginReport (Member Margin Report Files)

SELECT
    'CM' AS Segment,
    'Import_NSCCL_MarginReport' AS StoredProcedure,
    'MEMBER_MARGIN' AS FileType,
    'C_MG01_*_#.lis' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(MemberMargin_CreateDateTime) AS LastImportTime
    FROM Trans_MemberMargin
    WHERE MemberMargin_CompanyID = @CompanyId
	    AND MemberMargin_FinYear = @FinYear
        AND MemberMargin_SegmentID = CAST(@Segment_Cm AS INT)
        AND CAST(MemberMargin_TradeDate AS DATE) = @ImportDate
        AND MemberMargin_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSCCL_MarginReport'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_MG01_%'
) ts ON 1 = 1


UNION ALL

---- SP10: Import_NSE_Scrips (NSE Scrip Files)
SELECT
    'CM' AS Segment,
    'Import_NSE_Scrips' AS StoredProcedure,
    'NSE_SCRIPS' AS FileType,
    'C_SEC_#_NSE.csv' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(ImportLog_ImportDate) AS LastImportTime
    FROM Trans_ImportLog
    WHERE ImportLog_Module = 'NSE_SCRIPS'
         AND CAST(ImportLog_FileDate AS DATE) = @ImportDate
		AND ImportLog_User =111999
) id
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSE_Scrips'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_SEC_%'
) ts ON 1 = 1


UNION ALL

---- SP11: Update_NCL_Scrips (NCL Applicable Symbol Files)

SELECT
    'CM' AS Segment,
    'Update_NCL_Scrips' AS StoredProcedure,
    'NCL_SYMBOLS' AS FileType,
    'NCL_APPLICABLE_SYMBOL_#.csv' AS FileNamePattern,
    CASE
        WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN
            CASE WHEN id.NoOfRecords > 0 THEN id.NoOfRecords ELSE 1 END
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(ImportLog_ImportDate) AS LastImportTime
    FROM Trans_ImportLog
    WHERE ImportLog_Module = 'NCL_SCRIPS'
        AND CAST(ImportLog_FileDate AS DATE) = @ImportDate
		AND ImportLog_User =111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Update_NCL_Scrips'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'NCL_APPLICABLE_SYMBOL_%'
) ts ON 1 = 1

UNION ALL

---- SP12: Update_NSECL_ScripCodes (BSE Scrip Mapping Files)
SELECT
   'CM' AS Segment,
   'Update_NSECL_ScripCodes' AS StoredProcedure,
   'BSE_MAPPING' AS FileType,
   'BSE_Scrip_Series_Mapping_#.csv' AS FileNamePattern,
   CASE
       WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN
           CASE WHEN id.NoOfRecords > 0 THEN id.NoOfRecords ELSE 1 END
       ELSE 0
   END AS NoOfRecordsInserted,
   CASE
       WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN 'Imported'
       ELSE 'Not Imported'
   END AS ImportStatus,
   COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
   ts.filename AS ActualFileName,
   ts.spStatus AS TaskStatus,
   ts.spTime AS TaskTime
FROM (
   SELECT
       COUNT(1) AS NoOfRecords,
       MAX(ImportLog_ImportDate) AS LastImportTime
   FROM Trans_ImportLog
   WHERE ImportLog_Module = 'NSECL_CODES'
      AND CAST(ImportLog_FileDate AS DATE) = @ImportDate
	  AND ImportLog_User =111999
) id 
LEFT JOIN (
   SELECT
       filename,
       spStatus,
       spTime
   FROM FitAi_LiveTaskStatus
   WHERE spName = 'Update_NSECL_ScripCodes'
       AND segment = 'CM'
       AND CAST(createdTime AS DATE) = @ImportDate
       AND filename LIKE 'BSE_Scrip_Series_Mapping_%'
) ts ON 1 = 1

UNION ALL

---- SP13: Import_NSECL_Price (MTM Price Files)
SELECT
    'CM' AS Segment,
    'Import_NSECL_Price' AS StoredProcedure,
    'MTM_PRICE' AS FileType,
    'CM_MTM_Prices_#.csv' AS FileNamePattern,
    CASE
        WHEN  id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(DailyStat_UpdateDateTime) AS LastImportTime
    FROM Trans_DailyStatistics
    WHERE CAST(DailyStat_DateTime AS DATE) = @ImportDate
        AND DailyStat_Type = 'Final'
) id
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSECL_Price'
        AND segment = 'CM'  
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'CM_MTM_Prices_%'
) ts ON 1 = 1

UNION ALL

---- SP14: UDIFF_CMBhavcopy (Bhavcopy Files)
SELECT
    'CM' AS Segment,
    'UDIFF_CMBhavcopy' AS StoredProcedure,
    'F_0000' AS FileType,
    'BhavCopy_NSE_CM_0_0_0_#_F_0000.csv' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(DailyStat_UpdateDateTime) AS LastImportTime
    FROM Trans_DailyStatistics
    WHERE
        CAST(DailyStat_DateTime AS DATE) = @ImportDate
        AND DailyStat_Type = 'Final'
        AND DailyStat_ExchangeSegmentID = 1  -- NSE CM segment
        AND ISNULL(DailyStat_Group, 'NSE') IN ('NSE', 'BSE')  -- Based on SP logic
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_CMBhavcopy'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate  -- Changed from createdTime to date
        AND (filename LIKE 'BhavCopy_NSE_CM_%' OR filename LIKE 'BhavCopy_BSE_CM_%')  -- Support both NSE and BSE
) ts ON 1 = 1



UNION ALL

---- SP15: Reco_NCLPledgeSecurities (Pledge Security Files)

SELECT
    ft.Segment AS Segment,
    'Reco_NCLPledgeSecurities' AS StoredProcedure,
    ft.FileType AS FileType,
    ft.FileName AS FileNamePattern,
    CASE
        WHEN id.RecordCount > 0 THEN id.RecordCount
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.RecordCount > 0 AND ts.spStatus NOT IN ('404', '401', '500') THEN 'Imported'
        WHEN ts.spStatus IN ('404', '401', '500') THEN 'Failed'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastUpdateTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    CASE 
        WHEN ts.spStatus IN ('404', '401', '500') THEN CONCAT('Error: ', ts.spStatus)
        WHEN ts.spStatus IS NOT NULL AND ts.spStatus NOT IN ('404', '401', '500') THEN 'Success'
        ELSE ts.spStatus
    END AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    VALUES
        ('CM', 'SEC_PLEDGE_01', 'C_*_SEC_PLEDGE_#_01.csv.gz'),
        ('CM', 'SEC_PLEDGE_02', 'C_*_SEC_PLEDGE_#_02.csv.gz'),
        ('FO', 'SEC_PLEDGE_01', 'F_*_SEC_PLEDGE_#_01.csv.gz'),
        ('FO', 'SEC_PLEDGE_02', 'F_*_SEC_PLEDGE_#_02.csv.gz')
) AS ft(Segment, FileType, FileName)
LEFT JOIN (
    SELECT
        filename,
        spName,
        spStatus,
        spTime,
        segment
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Reco_NCLPledgeSecurities'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND (
            (filename LIKE 'C_%_SEC_PLEDGE_%_01.csv.gz' AND segment = 'CM') OR
            (filename LIKE 'C_%_SEC_PLEDGE_%_02.csv.gz' AND segment = 'CM') OR
            (filename LIKE 'F_%_SEC_PLEDGE_%_01.csv.gz' AND segment = 'FO') OR
            (filename LIKE 'F_%_SEC_PLEDGE_%_02.csv.gz' AND segment = 'FO')
        )
) ts ON ft.Segment = ts.segment
    AND (
        (ft.FileType = 'SEC_PLEDGE_01' AND ts.filename LIKE '%_01.csv.gz') OR
        (ft.FileType = 'SEC_PLEDGE_02' AND ts.filename LIKE '%_02.csv.gz')
    )
LEFT JOIN (
    SELECT
        CASE 
            WHEN NCLPldgSec_Segment = @Segment_Cm THEN 'CM'
            WHEN NCLPldgSec_Segment = @Segment_Fo THEN 'FO'
            ELSE 'Unknown'
        END AS Segment,
        COUNT(*) AS RecordCount,
        MAX(NCLPldgSec_UpdateTime) AS LastUpdateTime
    FROM Trans_NCLPldgSec
    WHERE NCLPldgSec_FinYear = @FinYear
        AND NCLPldgSec_Company = @CompanyId
        AND NCLPldgSec_Date = @ImportDate
        AND (NCLPldgSec_Segment = @Segment_Cm OR NCLPldgSec_Segment = @Segment_Fo)
    GROUP BY NCLPldgSec_Segment
) id ON ft.Segment = id.Segment


UNION ALL

---- SP16: Import_NSCCL_MemberCapital (Member Capital/Collateral Files)

SELECT
    'CM' AS Segment,
    'Import_NSCCL_MemberCapital' AS StoredProcedure,
    'COLLDTLS' AS FileType,
    'COLLDTLS_*_#_01.CSV.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(MemberCapital_CreateDateTime) AS LastImportTime
    FROM Trans_MemberCapital
    WHERE MemberCapital_CompanyID = @CompanyId
	    AND MemberCapital_FinYear=@FinYear
        AND MemberCapital_SegmentID = CAST(@Segment_Cm AS INT)
        AND CAST(MemberCapital_Date AS DATE) = @ImportDate
        AND MemberCapital_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSCCL_MemberCapital'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'COLLDTLS_%'
) ts ON 1 = 1

UNION ALL

---- SP17: Import_NSE_CC02 (Client Collateral Files)

SELECT
    'CM' AS Segment,
    'Import_NSE_CC02' AS StoredProcedure,
    'CC02' AS FileType,
    'C_CC02_*_#.csv.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(ClientCollat_CreateTime) AS LastImportTime
    FROM Trans_ClientCollat
    WHERE ClientCollat_CompanyID = @CompanyId
	    AND ClientCollat_FinYear= @FinYear
        AND ClientCollat_Segment = CAST(@Segment_Cm AS INT)
        AND CAST(ClientCollat_Date AS DATE) = @ImportDate
        AND ClientCollat_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSE_CC02'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_CC02_%'
) ts ON 1 = 1

UNION ALL

---- SP18: Import_NSECM_SD0n (Stamp Duty Files)

SELECT
    'CM' AS Segment,
    'Import_NSECM_SD0n' AS StoredProcedure,
    'STAMP_DUTY' AS FileType,
    'StampDuty_NCL_CM_0_CM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords  
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(Stamp_CreateDateTime) AS LastImportTime
    FROM Trans_Stamp
    WHERE Stamp_CompanyID = @CompanyId
	    AND Stamp_FinYear=@FinYear
        AND Stamp_SegmentID = CAST(@Segment_Cm AS INT)
        AND CAST(Stamp_StampDate AS DATE) = @ImportDate
        AND Stamp_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSECM_SD0n'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'StampDuty_NCL_CM_%'
) ts ON 1 = 1

UNION ALL

---- SP19: UDIFF_NSECM_Margin (CM Margin Files - Final)
SELECT
    'CM' AS Segment,
    'UDIFF_NSECM_Margin' AS StoredProcedure,
    'MARGIN_FINAL' AS FileType,
    'Margin_NCL_CM_0_CM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN
            CASE WHEN id.NoOfRecords > 0 THEN id.NoOfRecords ELSE 1 END
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(CMMarginSummary_CreateDateTime) AS LastImportTime
    FROM Trans_CMMarginSummary
    WHERE CMMarginSummary_CompanyID = @CompanyId
	    AND CMMarginSummary_FinYear=@FinYear
        AND CMMarginSummary_ExchangeSegmentID = CAST(@Segment_Cm AS INT)
        AND CAST(CMMarginSummary_Date AS DATE) = @ImportDate
        AND CMMarginSummary_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSECM_Margin'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'Margin_NCL_CM_%'
) ts ON 1 = 1

UNION ALL

---- SP20: Import_NSECM_EPI_CEP (Early Payin Credit Files)
SELECT
    'CM' AS Segment,
    'Import_NSECM_EPI_CEP' AS StoredProcedure,
    'EPI_CEP' AS FileType,
    '*_CEP#.D^' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        COUNT(1) AS NoOfRecords,
        MAX(EPI_CreateTime) AS LastImportTime
    FROM Trans_EPI
    WHERE EPI_CompanyID = @CompanyId
        AND EPI_Segment = CAST(@Segment_Cm AS INT)
        AND CAST(EPI_Date AS DATE) = @ImportDate
        AND EPI_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSECM_EPI_CEP'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE '%_CEP%'
) ts ON 1 = 1

UNION ALL

---- SP21: Import_NSECM_Orders (Order Log Files)
SELECT
    'CM' AS Segment,
    'Import_NSECM_Orders' AS StoredProcedure,
    'ORDER_LOG' AS FileType,
    'CM_ORD_LOG_#_*.CSV.gz' AS FileNamePattern,
    CASE
        WHEN  id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
       
        COUNT(1) AS NoOfRecords,
        MAX(ExchangeOrders_CreateDateTime) AS LastImportTime
    FROM Trans_ExchangeOrders
    WHERE ExchangeOrders_CompanyID = @CompanyId
	    AND ExchangeOrders_FinYear=@FinYear
        AND ExchangeOrders_Segment = CAST(@Segment_Cm AS INT)
        AND CAST(ExchangeOrders_OrderDate AS DATE) = @ImportDate
        AND ExchangeOrders_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'Import_NSECM_Orders'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'CM_ORD_LOG_%'
) ts ON 1 = 1

UNION ALL 

---- SP22: UDIFF_NSECM_Trades (Trade Files)

SELECT
    'CM' AS Segment,
    'UDIFF_NSECM_Trades' AS StoredProcedure,
    'TRADE_FILES' AS FileType,
    'Trade_NSE_CM_0_TM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT      
        COUNT(1) AS NoOfRecords,
        MAX(ExchangeTrades_CreateDateTime) AS LastImportTime
    FROM Trans_ExchangeTrades
    WHERE ExchangeTrades_CompanyID = @CompanyId
	    AND ExchangeTrades_FinYear=@FinYear
        AND ExchangeTrades_Segment = CAST(@Segment_Cm AS INT)
        AND CAST(ExchangeTrades_TradeDate AS DATE) = @ImportDate
        AND ExchangeTrades_CreateUser = 111999
) id 
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSECM_Trades'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'Trade_NSE_CM_%'
) ts ON 1 = 1


UNION ALL

---- SP23: InsertFODataForSelectLOT (FO Closing Rates Files)

SELECT
    'FO' AS Segment,
    'InsertFODataForSelectLOT' AS StoredProcedure,
    'F_CN01' AS FileType,
    'F_CN01_NSE_#.CSV.gz' AS FileNamePattern,
    CASE
        WHEN dt.RecordCount > 0 THEN dt.RecordCount 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN dt.RecordCount > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, dt.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'InsertFODataForSelectLOT'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'F_CN01_NSE_%'
) ts 
LEFT JOIN (
    SELECT
        COUNT(1) AS RecordCount,
        MAX(DailyStat_UpdateDateTime) AS LastImportTime
    FROM Trans_DailyStatistics
    WHERE CAST(DailyStat_DateTime AS DATE) = @ImportDate
        AND DailyStat_Type = 'Final'
) dt ON 1 = 1


UNION ALL

---- SP24: UDIFF_NSEFO_Trades (FO Trade Files)
	
SELECT
    'FO' AS Segment,
    'UDIFF_NSEFO_Trades' AS StoredProcedure,
    'F_0000' AS FileType,
    'Trade_NSE_FO_0_TM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN dt.RecordCount > 0 THEN dt.RecordCount
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN dt.RecordCount > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, dt.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSEFO_Trades'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'Trade_NSE_FO_0_TM_%'
) ts 
LEFT JOIN (
    SELECT
        COUNT(1) AS RecordCount,
        MAX(ExchangeTrades_CreateDateTime) AS LastImportTime
    FROM Trans_ExchangeTrades
    WHERE ExchangeTrades_CompanyID = @CompanyId
	    AND ExchangeTrades_FinYear=@FinYear
        AND ExchangeTrades_Segment = CAST(@Segment_Fo AS INT)
        AND ExchangeTrades_CreateUser = 111999
        AND CAST(ExchangeTrades_TradeDate AS DATE) = @ImportDate
) dt ON 1 = 1

UNION ALL

---- SP25: UDIFF_NSEFO_Position (FO Position Files)

SELECT
    'FO' AS Segment,
    'UDIFF_NSEFO_Position' AS StoredProcedure,
    'F_0000' AS FileType,
    'Position_NCL_FO_0_CM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN dt.RecordCount > 0 THEN dt.RecordCount 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN dt.RecordCount > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, dt.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSEFO_Position'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'Position_NCL_FO_0_CM_%'
) ts 
LEFT JOIN (
    SELECT
        COUNT(1) AS RecordCount,
        MAX(ExchangeTrades_CreateDateTime) AS LastImportTime
    FROM Trans_ExchangeTrades
    WHERE ExchangeTrades_CompanyID = @CompanyId
	    AND ExchangeTrades_FinYear=@FinYear
        AND ExchangeTrades_Segment = CAST(@Segment_Fo AS INT)
        AND ExchangeTrades_CreateUser = 111999
        AND CAST(ExchangeTrades_TradeDate AS DATE) = @ImportDate
) dt ON 1 = 1

UNION ALL

---- SP26: SP_INSUP_FUNDFILES (Fund Files - DFNS)
SELECT
    'CM' AS Segment,
    'SP_INSUP_FUNDFILES' AS StoredProcedure,
    'DFNS' AS FileType,
    'C_*_DFNS_#.csv.gz' AS FileNamePattern,
   CASE
        WHEN cb.RecordCount > 0 THEN cb.RecordCount
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN cb.RecordCount > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, cb.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'SP_INSUP_FUNDFILES'
        AND segment = 'CM'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'C_%_DFNS_%'
) ts
LEFT JOIN (
    SELECT
        COUNT(1) AS RecordCount,
        MAX(CashBank_CreateDateTime) AS LastImportTime
    FROM Trans_CashBankVouchers
    WHERE CashBank_CompanyID = @CompanyId
	    AND CashBank_FinYear= @FinYear
        AND CashBank_ExchangeSegmentID = CAST(@Segment_Cm AS INT)
        AND CashBank_CreateUser = 111999
        AND CAST(CashBank_TransactionDate AS DATE) = @ImportDate
) cb ON 1 = 1

UNION ALL

---- SP27: SP_INSUP_MarginFOCSV_New2 (FO Margin Files)

SELECT
    'FO' AS Segment,
    'SP_INSUP_MarginFOCSV_New2' AS StoredProcedure,
    'MG13' AS FileType,
    'F_MG13_*_#.lis.gz' AS FileNamePattern,
    CASE
        WHEN  dm.RecordCount > 0 THEN dm.RecordCount 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN dm.RecordCount > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, dm.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT 1 AS DummyKey
) ft
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'SP_INSUP_MarginFOCSV_New2'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'F_MG13_%'
) ts ON 1 = 1
LEFT JOIN (
    SELECT
        COUNT(1) AS RecordCount,
        MAX(DailyFOMargin_CreateDateTime) AS LastImportTime
    FROM Trans_DailyFOMargin
    WHERE DailyFOMargin_CompanyID = @CompanyId
	    AND DailyFOMargin_FinYear=@FinYear
        AND DailyFOMargin_ExchangeSegmentID = CAST(@Segment_Fo AS INT)
        AND DailyFOMargin_CreateUser = 111999
        AND CAST(DailyFOMargin_Date AS DATE) = @ImportDate
) dm ON 1 = 1

UNION ALL

---- SP28: UDIFF_NSEFO_STT (FO STT Files)
SELECT
    'FO' AS Segment,
    'UDIFF_NSEFO_STT' AS StoredProcedure,
    'STT_FILES' AS FileType,
    'STT_NCL_FO_0_CM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN id.NoOfRecords > 0 THEN id.NoOfRecords 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN ts.spStatus = '200' OR id.NoOfRecords > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, id.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT 
        COUNT(1) AS NoOfRecords,
        MAX(Sttax_CreateDateTime) AS LastImportTime
    FROM Trans_Sttax
    WHERE Sttax_CompanyID = @CompanyId
	    AND Sttax_FinYear=@FinYear
        AND Sttax_SegmentID = CAST(@Segment_Fo AS INT)
        AND CAST(Sttax_STTDate AS DATE) = @ImportDate
        AND Sttax_CreateUser = 111999
) id
LEFT JOIN (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSEFO_STT'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'STT_NCL_FO_%'
) ts ON 1 = 1


UNION ALL

---- SP29: UDIFF_NSEFO_StampDuty (FO Stamp Duty Files)
SELECT
    'FO' AS Segment,
    'UDIFF_NSEFO_StampDuty' AS StoredProcedure,
    'F_0000' AS FileType,
    'StampDuty_NCL_FO_0_CM_*_#_F_0000.csv.gz' AS FileNamePattern,
    CASE
        WHEN dt.RecordCount > 0 THEN dt.RecordCount 
        ELSE 0
    END AS NoOfRecordsInserted,
    CASE
        WHEN dt.RecordCount > 0 THEN 'Imported'
        ELSE 'Not Imported'
    END AS ImportStatus,
    COALESCE(ts.spTime, dt.LastImportTime) AS LastImportTime,
    ts.filename AS ActualFileName,
    ts.spStatus AS TaskStatus,
    ts.spTime AS TaskTime
FROM (
    SELECT
        filename,
        spStatus,
        spTime
    FROM FitAi_LiveTaskStatus
    WHERE spName = 'UDIFF_NSEFO_StampDuty'
        AND segment = 'FO'
        AND CAST(createdTime AS DATE) = @ImportDate
        AND filename LIKE 'StampDuty_NCL_FO_0_CM_%'
) ts 
LEFT JOIN (
    SELECT
        COUNT(1) AS RecordCount,
        MAX(Stamp_CreateDateTime) AS LastImportTime
    FROM Trans_Stamp
    WHERE Stamp_CompanyID = @CompanyId
	    AND Stamp_FinYear =@FinYear
        AND Stamp_SegmentID = CAST(@Segment_Fo AS INT)
        AND CAST(Stamp_StampDate AS DATE) = @ImportDate
        AND Stamp_CreateUser = 111999
) dt ON 1 = 1


ORDER BY Segment, StoredProcedure, FileType;

END
