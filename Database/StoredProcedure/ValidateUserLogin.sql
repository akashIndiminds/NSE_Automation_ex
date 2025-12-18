CREATE PROCEDURE [dbo].[sp_ValidateUserLogin]
    @loginId NVARCHAR(100),
    @password NVARCHAR(100),
    @nseResponseCode INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @currentDate DATE = CONVERT(DATE, GETDATE());
    DECLARE @localAttemptCount INT = 0;
    DECLARE @isValidCredential BIT = 0;
    DECLARE @userId INT = NULL;
    DECLARE @EntryProfile CHAR(1);
    DECLARE @systemBlocked BIT = 0;
    -- Debug: Log the input parameters
    PRINT 'Input Parameters:';
    PRINT 'LoginId: ' + ISNULL(@loginId, 'NULL');
    PRINT 'NSE Response Code: ' + ISNULL(CAST(@nseResponseCode AS NVARCHAR), 'NULL');
    -- Check if system is blocked due to any NSE blocked user today
    IF EXISTS (SELECT 1 FROM User_Activities_Log
               WHERE CONVERT(DATE, Date) = @currentDate
                 AND IsNseBlocked = 1)
    BEGIN
        SET @systemBlocked = 1;
        PRINT 'System is blocked due to existing NSE blocked user';
    END
    -- If system is blocked, reject all login attempts
    IF @systemBlocked = 1
    BEGIN
        SELECT 403 AS ResponseCode, 'System is locked due to NSE authentication failures. Please contact support.' AS ResponseMessage, NULL AS userId;
        RETURN;
    END
    -- Check if user exists in tbl_master_user
    IF EXISTS (SELECT 1 FROM tbl_master_user WHERE user_loginId = @loginId)
    BEGIN
        PRINT 'User exists in master table';
        -- Ensure log entry exists for today
        IF NOT EXISTS (SELECT 1 FROM User_Activities_Log WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate)
        BEGIN
            INSERT INTO User_Activities_Log (LoginId, Date, MaximumAttempt, IsNseBlocked)
            VALUES (@loginId, GETDATE(), 0, 0);
            PRINT 'Created new log entry for user';
        END
        -- Get current attempt count
        SELECT @localAttemptCount = MaximumAttempt
        FROM User_Activities_Log
        WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
        PRINT 'Current attempt count: ' + CAST(@localAttemptCount AS NVARCHAR);
        -- Validate credentials
        IF EXISTS (SELECT 1 FROM tbl_master_user
                   WHERE user_loginId = @loginId AND user_password = @password)
        BEGIN
            SET @isValidCredential = 1;
            SELECT @userId = user_id, @EntryProfile = user_EntryProfile
            FROM tbl_master_user WHERE user_loginId = @loginId;
            PRINT 'Credentials are valid. UserId: ' + CAST(@userId AS NVARCHAR);
        END
        ELSE
        BEGIN
            PRINT 'Invalid credentials provided';
        END
    END
    ELSE
    BEGIN
        PRINT 'User does not exist in master table';
    END
    -- Handle invalid credentials
    IF @isValidCredential = 0
    BEGIN
        PRINT 'Processing invalid credentials';
        IF EXISTS (SELECT 1 FROM tbl_master_user WHERE user_loginId = @loginId)
        BEGIN
            UPDATE User_Activities_Log
            SET MaximumAttempt = MaximumAttempt + 1
            WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
            SELECT @localAttemptCount = MaximumAttempt
            FROM User_Activities_Log
            WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
            PRINT 'Updated attempt count to: ' + CAST(@localAttemptCount AS NVARCHAR);
            IF @localAttemptCount > 0 AND @localAttemptCount % 3 = 0
            BEGIN
                WAITFOR DELAY '00:00:00.5';
                SELECT 401 AS ResponseCode, 'Invalid login credentials. Consider resetting your password if you forgot it.' AS ResponseMessage, NULL AS UserId;
                RETURN;
            END
        END
        WAITFOR DELAY '00:00:00.5';
        SELECT 401 AS ResponseCode, 'Invalid login credentials' AS ResponseMessage, NULL AS UserId;
        RETURN;
    END
    -- Handle valid credentials with NSE response
    IF @isValidCredential = 1
    BEGIN
        PRINT 'Processing valid credentials';
        -- Reset attempt counter on successful local login
        UPDATE User_Activities_Log
        SET MaximumAttempt = 0
        WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
        PRINT 'Reset attempt counter to 0';
        -- If no NSE response code provided
        IF @nseResponseCode IS NULL
        BEGIN
            PRINT 'No NSE response code provided, returning first-level validation';
            SELECT 200 AS ResponseCode, 'First-level validation successful' AS ResponseMessage,
                   @userId AS UserId, @EntryProfile AS User_EntryProfile;
            RETURN;
        END
        PRINT 'Processing NSE response code: ' + CAST(@nseResponseCode AS NVARCHAR);
        -- Handle NSE response codes
        IF @nseResponseCode = 601  -- NSE Success
        BEGIN
            PRINT 'NSE Success (601) - Login successful';
            SELECT 200 AS ResponseCode, 'Login successful' AS ResponseMessage, @userId AS UserId;
            RETURN;
        END
        ELSE IF @nseResponseCode = 701  -- NSE Authentication Failed
        BEGIN
            PRINT 'NSE Authentication Failed (701) - Blocking user';
            UPDATE User_Activities_Log
            SET IsNseBlocked = 1
            WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
            SELECT 403 AS ResponseCode, 'Your account is locked due to NSE authentication failure. Please contact support.' AS ResponseMessage, @userId AS UserId;
            RETURN;
        END
        ELSE IF @nseResponseCode = 702  -- NSE Account Disabled/Blocked
        BEGIN
            PRINT 'NSE Account Disabled/Blocked (702) - Blocking user';
            UPDATE User_Activities_Log
            SET IsNseBlocked = 1
            WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
            -- Verify the update was successful
            DECLARE @blockedStatus BIT;
            SELECT @blockedStatus = IsNseBlocked
            FROM User_Activities_Log
            WHERE LoginId = @loginId AND CONVERT(DATE, Date) = @currentDate;
            PRINT 'Updated IsNseBlocked status to: ' + CAST(@blockedStatus AS NVARCHAR);
            SELECT 403 AS ResponseCode, 'Your NSE account has been disabled or blocked. Please contact your administrator.' AS ResponseMessage, @userId AS UserId;
            RETURN;
        END
        ELSE IF @nseResponseCode = 703  -- Invalid Member Code/Login ID
        BEGIN
            PRINT 'Invalid Member Code/Login ID (703)';
            SELECT 401 AS ResponseCode, 'Invalid member code or login ID in NSE system. Please verify your credentials.' AS ResponseMessage, @userId AS UserId;
            RETURN;
        END
        ELSE IF @nseResponseCode = 704  -- Not Eligible for Segment
        BEGIN
            PRINT 'Not Eligible for Segment (704)';
            SELECT 403 AS ResponseCode, 'You are not eligible to access this trading segment. Please contact support.' AS ResponseMessage, @userId AS UserId;
            RETURN;
        END
        ELSE
        BEGIN
            PRINT 'Unknown NSE response code: ' + CAST(@nseResponseCode AS NVARCHAR);
            SELECT @nseResponseCode AS ResponseCode,
                   CONCAT('NSE returned response code: ', @nseResponseCode, '. Please contact support.') AS ResponseMessage,
                   @userId AS UserId;
            RETURN;
        END
    END
END






