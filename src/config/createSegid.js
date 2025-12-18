import runQuery from "../utils/runSegID.query.js";

const createSegid = async () => {
    const segid = {};
    try{
        const result = await runQuery();
        for (const row of result) {
            segid[row.ExchSegmentName] = row.SegId;
        }
        return segid;
    }
    catch (error) {
        console.error("Error in createSegid:", error);
    }
}

const segid = await createSegid();
 export default segid;