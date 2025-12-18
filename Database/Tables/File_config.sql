
CREATE TABLE [dbo].[File_Config](
	[id] [int] PRIMARY KEY,
	[childPath] [varchar](max) NULL,
	[file_name] [varchar](100) NULL,
	[file_type] [varchar](5) NULL,
	[format] [varchar](20) NULL,
	[spName] [varchar](100) NULL,
	[spParam] [varchar](255) NULL,
	[spParamValue] [varchar](255) NULL,
	[dirName] [varchar](20) NULL,
	[segment] [varchar](20) NULL,
	[folderName] [varchar](20) NULL,
	[created_at] [datetime] NULL,
	[reserved] [varchar](150) NULL,
	[notifyMe] [varchar](500) NULL,
)