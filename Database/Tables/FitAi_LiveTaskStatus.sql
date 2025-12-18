
CREATE TABLE [dbo].[FitAi_LiveTaskStatus](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[dir] [varchar](50) NULL,
	[segment] [varchar](10) NULL,
	[folderPath] [varchar](255) NULL,
	[filename] [varchar](255) NULL,
	[filepath] [varchar](max) NULL,
	[filetype] [varchar](max) NULL,
	[spName] [varchar](100) NULL,
	[spParam] [varchar](max) NULL,
	[spParamValue] [varchar](max) NULL,
	[spPath] [varchar](max) NULL,
	[spStatus] [varchar](250) NULL,
	[dlStatus] [varchar](250) NULL,
	[ePath] [varchar](255) NULL,
	[reserved] [varchar](max) NULL,
	[lastModified] [datetime] NULL,
	[spTime] [varchar](max) NULL,
	[dlTime] [varchar](max) NULL,
	[createdTime] [varchar](50) NULL,
	[taskId] [varchar](250) NULL,
	[date] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


