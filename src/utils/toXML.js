import { create } from 'xmlbuilder2';

function toXML(result) {

      try {
    
        const recordsets = result.recordsets; // Array of objects
        if (!recordsets) {
            console.log("No table found");
            return;
        }
        // Convert recordset to XML
        const xml = create({ version: '1.0' })
        .ele('NewDataSet')

        recordsets.forEach(recordset=>{
            xml.ele(recordset.map(row => ({ Table: { '@': row } })))
        })


        const xmlString = xml.end({ prettyPrint: true,headless: true });
        //console.log(xmlString,typeof xmlString);
        return xmlString;

      } catch (err) {
        console.error(err);
      }
}

    export default toXML;