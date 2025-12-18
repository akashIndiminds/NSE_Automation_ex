
const file_config = {
  common: {//dirName
    FO: {
      MarketReports: {
        file_name : "F_CN01_NSE_#.csv.gz",
        file_type : "N",
        format : "DD-MM-YYYY",
        spName : "SP_Trans_DailyStatistics",
        spParam : "Module-EXCHNAGESEGMENT",
        spParamValue : " -1",
        childPath : "",
      },
    },
    CM: {//segment
      bhavcopy: {//foldername
        file_name: "BhavCopy_NSE_CM_0_0_0_#_F_0000.csv.zip",
        file_type: "N",
        format: "YYYY-MM-DD",
        spName: "UDIFF_CMBhavcopy",
        spParam: "Module-ExchangeSegmentID",
        spParamValue: "InsUpdate_Trans_DailyStatistics-1",
        // segment: 'CM',
        childPath: "",
      },
      clearing: {
        file_name:
          "CM_MTM_Prices_#.csv,C_SEC_#_NSE.csv,NCL_APPLICABLE_SYMBOL_#.csv,BSE_Scrip_Series_Mapping_#.csv,SettlementMaster_NCL_CM_0_0_0_#00_0_0000.csv.gz",
        file_type: "N,N,N,N,N",
        format: "DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,YYYY-MM",
        spName:
          "Import_NSECL_Price,Import_NSE_Scrips,Update_NCL_Scrips,Update_NSECL_ScripCodes,NSESettCalender_CSV23",
        spParam: "Module-EXCHNAGESEGMENT,Module-ModifyUser,Module-ModifyUser,Module-ModifyUser,-",
        spParamValue: "InsUpdate-1,nSEsCRIPS-9999,NCL_Scrips-9999,NSECLCodes-9999,-",
        // segment: 'CM',
        childPath: ",,,,",
      },
      varrate: {
        file_name: "C_VAR1_#_6.DAT",
        file_type: "N",
        format: "DD-MM-YYYY",
        spName: "SP_INSUP_Trans_DailyVar",
        spParam: "Module-ModifyUser-FileDate-ExcSegmt",
        spParamValue: "DailyVar-9999-2024|12|28-1",
        // segment: 'CM',
        childPath: "",
      },
    },
  },
  member: {
    FO: {
      Reports: {
        file_name:
          "STT_NCL_FO_0_TM_*_#_F_0000.csv,StampDuty_NCL_FO_0_TM_*_#_F_0000.csv,Position_NCL_FO_0_TM_*_#_F_0000.csv,F_*_SEC_PLEDGE_#_01.csv.gz,F_*_SEC_PLEDGE_#_02.csv.gz,Margin_NCL_FO_0_CM_*_#_P_1100.csv.gz,Margin_NCL_FO_0_CM_*_#_P_1230.csv.gz,Margin_NCL_FO_0_CM_*_#_P_1430.csv.gz,Margin_NCL_FO_0_CM_*_#_P_1530.csv.gz,Margin_NCL_FO_0_CM_*_#_F_0000.csv.gz",

        file_type: "N,N,E,E,E,N,N,N,N,N",

        format: "YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,DD-MM-YYYY,DD-MM-YYYY,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD",
        spName:
          "UDIFF_NSEFO_STT,UDIFF_NSEFO_StampDuty,UDIFF_NSEFO_Position,Reco_NCLPledgeSecurities,Reco_NCLPledgeSecurities,UDIFF_NSEFO_Margin,UDIFF_NSEFO_Margin,UDIFF_NSEFO_Margin,UDIFF_NSEFO_Margin,UDIFF_NSEFO_Margin",
        spParam:
          "COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,ModifyUser-ExcSegmt-ExchangeTrades_CompanyID-LckTradeDate-ExpireDate-LockMsg,CreateUser,CreateUser,Module-ModifyUser-ExcSegmt-ExchangeTrades_CompanyID,Module-ModifyUser-ExcSegmt-ExchangeTrades_CompanyID,Module-ModifyUser-ExcSegmt-ExchangeTrades_CompanyID,Module-ModifyUser-ExcSegmt-ExchangeTrades_CompanyID,Module-ModifyUser-ExcSegmt-ExchangeTrades_CompanyID",
        spParamValue:
          "COR0000002-18-9999,COR0000002-18-9999,9999-18-COR0000002-2025|12|01-2048|12|01-lic Expired,9999,9999,Import-9999-18-COR0000002,Import-9999-18-COR0000002,Import-9999-18-COR0000002,Import-9999-18-COR0000002,Import-9999-18-COR0000002",
        // segment: 'CM',
        childPath:
          ",,,,,Standard report,Standard report,Standard report,Standard report,Standard report",
      },
      Onlinebackup: {
        file_name: "Trade_NSE_FO_0_TM_*_#_F_0000.csv",
        file_type: "N",
        format: "YYYY-MM-DD",
        spName : "UDIFF_NSEFO_Trades",
        spParam: "ModifyUser-ExcSegmt-ExchangeTrades_CompanyID-LckTradeDate-ExpireDate-LockMsg",
        spParamValue: "9999-24-COR0000002-2025|12|01-2048|12|01-lic Expired",
        childPath: "",
      },
    },
    CM: {
      Reports: {
        file_name:
          "C_*_DFNS_#.csv.gz,C_SA04_*_#.lis.gz,DeliveryDpo_NCL_CM_EquityT1_CM_*_#_F_0000.csv.gz,DeliveryDpo_NCL_CM_EquityT1_CM_*_#_P_0002.csv.gz,C_*_SEC_PLEDGE_#_01.csv.gz,C_*_SEC_PLEDGE_#_02.csv.gz,STT_NCL_CM_0_CM_*_#_F_0000.csv.gz,C_MG13_*_#.lis.gz,C_MG01_*_#.lis,COLLDTLS_*_#_01.CSV.gz,C_CC02_*_#.csv.gz,StampDuty_NCL_CM_0_CM_*_#_F_0000.csv.gz,Margin_NCL_CM_0_CM_*_#_P_1100.csv.gz,Margin_NCL_CM_0_CM_*_#_P_1230.csv.gz,Margin_NCL_CM_0_CM_*_#_P_1430.csv.gz,Margin_NCL_CM_0_CM_*_#_P_1530.csv.gz,Margin_NCL_CM_0_CM_*_#_P_0000.csv.gz,Margin_NCL_CM_0_CM_*_#_F_0000.csv.gz",
        file_type: "N,N,N,E,E,N,N,N,N,N,N,N,N,N,N,N,N,N",
        
        format:
          "DD-MM-YYYY,DD-MM-YYYY,YYYY-MM-DD,YYYY-MM-DD,DD-MM-YYYY,DD-MM-YYYY,YYYY-MM-DD,DD-MM-YYYY,DD-MM-YYYY,YYYY-MM-DD,DD-MM-YYYY,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD",
        spName:
          "SP_INSUP_FUNDFILES,Import_NSE_SA04,UDIFF_NSE_DeliveryDpo,UDIFF_NSE_DeliveryDpo,Reco_NCLPledgeSecurities,Reco_NCLPledgeSecurities,Import_NSECM_MWST,Import_NSECM_MG13,Import_NSCCL_MarginReport,Import_NSCCL_MemberCapital,Import_NSE_CC02,Import_NSECM_SD0n,UDIFF_NSECM_MarginP,UDIFF_NSECM_MarginP,UDIFF_NSECM_MarginP,UDIFF_NSECM_MarginP,UDIFF_NSECM_MarginP,UDIFF_NSECM_Margin",
        spParam:
          "Module-ModifyUser-ExcSegmt-ExchangeSegmentID-CashBankAccount-FileName-ExchangeTrades_CompanyID-FinYear,COMPANY_ID-SegmentID-ModifyUser,file_path-file_name-compid-segid-FinYear-userid,file_path-file_name-compid-segid-FinYear-userid,CreateUser,CreateUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentId-ModifyUser,COMPANY_ID-SegmentId-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser,COMPANY_ID-SegmentID-ModifyUser",
        spParamValue:
          "InsertTradeData-9999-24-1-CashBankAccount-DFNS-COR0000002-2025|2026,COR0000002-24-9999,file_path- -COR0000002-24-2025|2026-9999,file_path- -COR0000002-24-2025|2026-9999,9999,9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999,COR0000002-24-9999",
        // segment: 'CM',
        childPath:
          ",,,,,,,,,,,,Standard report,Standard report,Standard report,Standard report,Standard report,Standard report",
      },
      CEP: {
        file_name: "*_CEP#.D^",
        file_type:"I-1",
        format: "YYYY-MM-DD",
        spName: "Import_NSECM_EPI_CEP",
        spParam: "COMPANY_ID-SegmentID-ModifyUser",
        spParamValue: "COR0000002-24-9999",
        // segment: 'CM',
        childPath: "Dnld",
      },
      Onlinebackup: {
        file_name: "CM_ORD_LOG_#_*.CSV.gz,Trade_NSE_CM_0_TM_*_#_F_0000.csv.gz",
        file_type: "N,N",
        format: "DD-MM-YYYY,YYYY-MM-DD",
        spName: "Import_NSECM_Orders,UDIFF_NSECM_Trades",
        spParam: "SegmentId-COMPANY_ID-ModifyUser,ModifyUser-ExcSegmt-ExchangeTrades_CompanyID-LckTradeDate-ExpireDate-LockMsg",
        spParamValue: "24-COR0000002-9999,9999-24-COR0000002-2025|12|01-2048|12|01-lic Expired",
        // segment: 'CM',
        childPath: ",",
      },
    },
  },
};

export default file_config;

// Reports:
// {
//     file_name:'Margin_NCL_CM_0_CM_*_#_P_1100.csv.gz',
//     format:'YYYY-MM-DD',
//     spName:'UDIFF_NSECM_MarginP',
//     spParam:'COMPANY_ID-SegmentID-ModifyUser',
//     spParamValue:'COR0000002-24-9999',
//     segment: 'CM',
//     childPath: 'Standard report'
// },
