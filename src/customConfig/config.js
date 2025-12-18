import segid from '../config/createSegid.js';
      const { cm:CM, FO } = segid;
      
      const finalConfig = {
  "common": {
    "CM": {
      "bhavcopy": {
        "file_name": `BhavCopy_NSE_CM_0_0_0_#_F_0000.csv.zip`,
        "file_type": `N`,
        "format": `YYYY-MM-DD`,
        "spName": `UDIFF_CMBhavcopy`,
        "spParam": `Module-ExchangeSegmentID`,
        "spParamValue": `InsUpdate_Trans_DailyStatistics-1`,
        "childPath": ``,
        "reserved": ``,
        "id": `2`
      },
      "clearing": {
        "file_name": `CM_MTM_Prices_#.csv,C_SEC_#_NSE.csv,NCL_APPLICABLE_SYMBOL_#.csv,BSE_Scrip_Series_Mapping_#.csv,SettlementMaster_NCL_CM_0_0_0_#00_0_0000.csv.gz,C_CORPACT_#.csv.gz,C_CORPACT_08092025.csv.gz`,
        "file_type": `N,N,N,N,N,N,N`,
        "format": `DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,YYYY-MM,DD-MM-YYYY,DD-MM-YYYY`,
        "spName": `Import_NSECL_Price,Import_NSE_Scrips,Update_NCL_Scrips,Update_NSECL_ScripCodes,NSESettCalender_CSV23,-,-`,
        "spParam": `Module-EXCHNAGESEGMENT,Module-ModifyUser,Module-ModifyUser,Module-ModifyUser,-,-,-`,
        "spParamValue": `InsUpdate-1,nSEsCRIPS-9999,NCL_Scrips-9999,NSECLCodes-9999,-,-,-`,
        "childPath": `,,,,,,`,
        "reserved": `,,,,,,`,
        "id": `3,4,5,6,7,56,57`
      },
      "varrate": {
        "file_name": `C_VAR1_#_6.DAT`,
        "file_type": `N`,
        "format": `DD-MM-YYYY`,
        "spName": `SP_INSUP_Trans_DailyVar`,
        "spParam": `Module-ModifyUser-FileDate-ExcSegmt`,
        "spParamValue": `DailyVar-9999-2024|12|28-1`,
        "childPath": ``,
        "reserved": ``,
        "id": `8`
      }
    },
    "FO": {
      "Volatility": {
        "file_name": `FOVOLT_#.csv`,
        "file_type": `N`,
        "format": `DD-MM-YYYY`,
        "spName": `-`,
        "spParam": `-`,
        "spParamValue": `-`,
        "childPath": ``,
        "reserved": ``,
        "id": `9`
      },
      "Limit Files": {
        "file_name": `Contract_Delta_#.csv,oi_cli_limit_#.lst,F_AEL_OPT_CONTRACTS_#.csv.gz,ael_#.csv,fo_secban_#.csv,Contract_Delta_#_i01.csv,Contract_Delta_#_i02.csv,Contract_Delta_#_i03.csv,Contract_Delta_#_i04.csv,Contract_Delta_#_i05.csv`,
        "file_type": `N,N,N,N,N,N,N,N,N,N`,
        "format": `DD-MM-YYYY,DD|-MON|-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY,DD-MM-YYYY`,
        "spName": `-,-,-,-,-,-,-,-,-,-`,
        "spParam": `-,-,-,-,-,-,-,-,-,-`,
        "spParamValue": `-,-,-,-,-,-,-,-,-,-`,
        "childPath": `,,,,,,,,,`,
        "reserved": `,,,,,,,,,`,
        "id": `10,11,42,43,50,51,52,53,54,55`
      },
      "Bhavcopy": {
        "file_name": `BhavCopy_NSE_FO_0_0_0_#_F_0000.csv.zip`,
        "file_type": `N`,
        "format": `YYYY-MM-DD`,
        "spName": `UDIFF_FOBhavcopy`,
        "spParam": `Module-ExchangeSegmentID`,
        "spParamValue": `InsUpdate_Trans_DailyStatistics-1`,
        "childPath": ``,
        "reserved": ``,
        "id": `12`
      },
      "MarketReports": {
        "file_name": `F_CN01_NSE_#.CSV.gz`,
        "file_type": `N`,
        "format": `DD-MM-YYYY`,
        "spName": `InsertFODataForSelectLOT`,
        "spParam": `Module-ModifyUser-ExchangeSegmentID`,
        "spParamValue": ` -9999-2`,
        "childPath": ``,
        "reserved": ``,
        "id": `36`
      },
      "Parameter": {
        "file_name": `nsccl.#.i01.spn.gz,nsccl.#.i02.spn.gz,nsccl.#.i03.spn.gz,nsccl.#.i04.spn.gz,nsccl.#.i05.spn.gz,nsccl.#.s.spn.gz`,
        "file_type": `N,N,N,N,N,N`,
        "format": `YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD,YYYY-MM-DD`,
        "spName": `-,-,-,-,-,-`,
        "spParam": `-,-,-,-,-,-`,
        "spParamValue": `-,-,-,-,-,-`,
        "childPath": `,,,,,`,
        "reserved": `,,,,,`,
        "id": `44,45,46,47,48,49`
      }
    }
  }
};
      
      export default finalConfig;
      