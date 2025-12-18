
CREATE PROCEDURE [dbo].[FitAi_Dbhelper]
    @TableName VARCHAR(100),
    @xmlData NVARCHAR(MAX),
    @Date VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Error handling
    BEGIN TRY
        -- Validate input parameters
        IF @TableName IS NULL OR @xmlData IS NULL OR @Date IS NULL
        BEGIN
            RAISERROR('All parameters (@TableName, @xmlData, @Date) are required', 16, 1);
            RETURN;
        END

        -- Check if table exists
        IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = @TableName)
        BEGIN
            RAISERROR('Table %s does not exist', 16, 1, @TableName);
            RETURN;
        END

        -- Parse XML directly without cleaning
        DECLARE @xmlDoc XML;
        
        -- Try to parse the XML
        BEGIN TRY
            SET @xmlDoc = CAST(@xmlData AS XML);
        END TRY
        BEGIN CATCH
            -- If direct casting fails, try cleaning
            DECLARE @cleanXmlData NVARCHAR(MAX);
            SET @cleanXmlData = REPLACE(@xmlData, CHAR(65279), ''); -- Remove BOM
            SET @cleanXmlData = REPLACE(@cleanXmlData, '<?xml version="1.0" encoding="UTF-8"?>', '');
            SET @cleanXmlData = REPLACE(@cleanXmlData, '<?xml version="1.0" encoding="utf-8"?>', '');
            SET @cleanXmlData = LTRIM(RTRIM(@cleanXmlData));
            
            SET @xmlDoc = CAST(@cleanXmlData AS XML);
        END CATCH

        -- Debug: Check what the XML contains
        DECLARE @DebugInfo NVARCHAR(MAX) = '';
        
        -- Check for different possible root elements
        DECLARE @HasDataRecord BIT = @xmlDoc.exist('/Data/Record');
        DECLARE @HasRecordsRecord BIT = @xmlDoc.exist('/Records/Record');
        DECLARE @HasRecord BIT = @xmlDoc.exist('/Record');
        
        SET @DebugInfo = 'HasDataRecord: ' + CAST(@HasDataRecord AS VARCHAR(1)) + 
                        ', HasRecordsRecord: ' + CAST(@HasRecordsRecord AS VARCHAR(1)) + 
                        ', HasRecord: ' + CAST(@HasRecord AS VARCHAR(1));

        -- Determine XML structure and count records
        DECLARE @RecordPath NVARCHAR(50);
        DECLARE @TotalRecords INT = 0;

        IF @HasDataRecord = 1
        BEGIN
            SET @RecordPath = '/Data/Record';
            SELECT @TotalRecords = @xmlDoc.value('count(/Data/Record)', 'INT');
        END
        ELSE IF @HasRecordsRecord = 1
        BEGIN
            SET @RecordPath = '/Records/Record';
            SELECT @TotalRecords = @xmlDoc.value('count(/Records/Record)', 'INT');
        END
        ELSE IF @HasRecord = 1
        BEGIN
            SET @RecordPath = '/Record';
            SELECT @TotalRecords = @xmlDoc.value('count(/Record)', 'INT');
        END
        ELSE
        BEGIN
            -- More detailed error message
            DECLARE @RootElement NVARCHAR(100) = @xmlDoc.value('local-name(/*[1])', 'NVARCHAR(100)');
            RAISERROR('Invalid XML structure. Root element is: %s. Debug: %s', 16, 1, @RootElement, @DebugInfo);
            RETURN;
        END

        -- Begin transaction
        BEGIN TRANSACTION;
		
        -- Delete existing records for the date
        Delete from FitAi_LiveTaskStatus where  Cast(createdTime as Date)=Cast(@Date as Date)

        -- Insert new records using dynamic SQL
        DECLARE @sql NVARCHAR(MAX);
        SET @sql = N'
        INSERT INTO FitAi_LiveTaskStatus (
             dir, segment, folderPath, filename, filepath, filetype,
            spName, spParam, spParamValue, spPath, spStatus, dlStatus,
            ePath, reserved, lastModified, spTime, dlTime, createdTime,
            taskId, date
        )
        SELECT
            LTRIM(RTRIM(ISNULL(Record.value(''(dir)[1]'', ''VARCHAR(50)''), ''''))) AS dir,
            LTRIM(RTRIM(ISNULL(Record.value(''(segment)[1]'', ''VARCHAR(10)''), ''''))) AS segment,
            LTRIM(RTRIM(ISNULL(Record.value(''(folderPath)[1]'', ''VARCHAR(255)''), ''''))) AS folderPath,
            LTRIM(RTRIM(ISNULL(Record.value(''(filename)[1]'', ''VARCHAR(255)''), ''''))) AS filename,
            LTRIM(RTRIM(ISNULL(Record.value(''(filepath)[1]'', ''VARCHAR(255)''), ''''))) AS filepath,
            LTRIM(RTRIM(ISNULL(Record.value(''(filetype)[1]'', ''VARCHAR(10)''), ''''))) AS filetype,
            LTRIM(RTRIM(ISNULL(Record.value(''(spName)[1]'', ''VARCHAR(100)''), ''''))) AS spName,
            LTRIM(RTRIM(ISNULL(Record.value(''(spParam)[1]'', ''VARCHAR(255)''), ''''))) AS spParam,
            LTRIM(RTRIM(ISNULL(Record.value(''(spParamValue)[1]'', ''VARCHAR(500)''), ''''))) AS spParamValue,
            LTRIM(RTRIM(ISNULL(Record.value(''(spPath)[1]'', ''VARCHAR(255)''), ''''))) AS spPath,
            LTRIM(RTRIM(ISNULL(Record.value(''(spStatus)[1]'', ''VARCHAR(250)''), ''''))) AS spStatus,
            LTRIM(RTRIM(ISNULL(Record.value(''(dlStatus)[1]'', ''VARCHAR(250)''), ''''))) AS dlStatus,
            LTRIM(RTRIM(ISNULL(Record.value(''(ePath)[1]'', ''VARCHAR(255)''), ''''))) AS ePath,
            LTRIM(RTRIM(ISNULL(Record.value(''(reserved)[1]'', ''VARCHAR(500)''), ''''))) AS reserved,
            CASE 
                WHEN Record.value(''(lastModified)[1]'', ''VARCHAR(100)'') IS NOT NULL 
                     AND Record.value(''(lastModified)[1]'', ''VARCHAR(100)'') != ''''
                THEN TRY_CAST(Record.value(''(lastModified)[1]'', ''VARCHAR(100)'') AS DATETIME)
                ELSE NULL 
            END AS lastModified,
            LTRIM(RTRIM(ISNULL(Record.value(''(spTime)[1]'', ''VARCHAR(100)''), ''''))) AS spTime,
            LTRIM(RTRIM(ISNULL(Record.value(''(dlTime)[1]'', ''VARCHAR(100)''), ''''))) AS dlTime,
            LTRIM(RTRIM(ISNULL(Record.value(''(createdTime)[1]'', ''VARCHAR(50)''), ''''))) AS createdTime,
            LTRIM(RTRIM(ISNULL(Record.value(''(taskId)[1]'', ''VARCHAR(250)''), ''''))) AS taskId,
            @Date AS date
        FROM @xmlDoc.nodes(''' + @RecordPath + ''') AS T(Record)
        WHERE Record.value(''(id)[1]'', ''VARCHAR(50)'') IS NOT NULL 
          AND LTRIM(RTRIM(Record.value(''(id)[1]'', ''VARCHAR(50)''))) != '''';';

        -- Execute the dynamic SQL with parameters
        EXEC sp_executesql @sql, N'@xmlDoc XML, @Date VARCHAR(20)', @xmlDoc, @Date;

        -- Capture inserted rows
        DECLARE @InsertedRows INT = @@ROWCOUNT;

        -- Commit transaction
        COMMIT TRANSACTION;

        -- Return success message
        SELECT 'SUCCESS' AS Status, 
               'Data processed successfully for date: ' + @Date AS Message,
               @InsertedRows AS RecordsProcessed,
               @TotalRecords AS TotalRecordsInXML;

    END TRY
    BEGIN CATCH
        -- Rollback transaction if error occurs
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Return error information
        SELECT 'ERROR' AS Status,
               ERROR_MESSAGE() AS Message,
               ERROR_NUMBER() AS ErrorNumber,
               ERROR_SEVERITY() AS ErrorSeverity,
               ERROR_STATE() AS ErrorState;
    END CATCH
END
GO


