CREATE TABLE User_Activities_Log (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    LoginId NVARCHAR(255) NOT NULL,
    Date DATETIME NOT NULL,
    MaximumAttempt INT NOT NULL,
    IsNseBlocked BIT NULL
);