const query = `Select CompanyId,Session_ExchangeSegmentID ExchSegId,Session_UserSegID SegId,exh_shortName ExchName,exch_segmentId ExchSegmentName from
(Select Ltrim(Rtrim(Company)) TextField,Ltrim(Rtrim(CompanyID))+'~'+Ltrim(Rtrim(isnull(Cast(Session_ExchangeSegmentID as Varchar),'')))+
'~'+Ltrim(Rtrim(Session_UserSegID))+'~'+Ltrim(Rtrim(exh_shortName))+'~'+Ltrim(Rtrim(isnull(exch_segmentId,''))) ValueField,
CompanyID,Session_ExchangeSegmentID,Session_UserSegID,exh_shortName,exch_segmentId from (Select Ltrim(Rtrim(Exch_CompID)) as CompanyID,
(Select Ltrim(RTrim(Cmp_Name)) from Tbl_Master_Company Where Cmp_InternalID=Exch_CompID) as Company,
(Select ExchangeSegment_ID From Master_ExchangeSegments Where ExchangeSegment_ExchangeID=Exchange_ID and
ExchangeSegment_Code=Exch_SegmentID) as [Session_ExchangeSegmentID],Exch_InternalID as [Session_UserSegID],Exh_ShortName,Exch_SegmentID
from (Select Exch_CompID,Exch_InternalID,Exh_ShortName,Exch_SegmentID from Tbl_Master_Exchange,Tbl_Master_CompanyExchange
WHERE Exh_CntId=Exch_ExchID) as T1,Master_Exchange Where Exchange_ShortName=Exh_ShortName) Exch_Exh) CompanyExchange
Where exh_shortName='NSE' and CompanyID='COR0000002'`;

export default query;