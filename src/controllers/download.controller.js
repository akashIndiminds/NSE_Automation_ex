import generateFileNames from "../services/generateFileNames.service.js";
import file_config from '../config/files.config.js';
import {downloadFile} from '../utils/downloadFile.js'
import getdownloadPayload from "../utils/getdownloadPayload.js";
import getDownloadlist from "../services/getDownloadList.js";
import startBulkDownload from "../services/startBulkDownload.js";
import HttpError from "../utils/HttpError.js";

export const listBuilder = async (req, res, next) => {
    try {
      console.log("sync triggered");
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).send('Missing required parameters: startDate or endDate');
      }
      // const obj = file_config.common.clearing;
      // const generatedFileNames = await generateFileNames(startDate, endDate , obj);
      const downloadList= await getDownloadlist(startDate, endDate);
      res.status(200).send({ success: true, data: downloadList });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };

  export const singleFileDownload = async (req, res, next) => {
    try {
      console.log("Download triggered");
      const messagePayload = getdownloadPayload(req.body);
      const fileData = await downloadFile(messagePayload);
      if(fileData instanceof HttpError){
        throw fileData;
      }
      const dataBuffer = Buffer.from(fileData);

      res.setHeader('Content-Disposition', 'attachment; filename="downloaded-file.ext"');
      res.setHeader('Content-Type','application/octet-stream');

      res.status(200).send({ success: true, filedata: dataBuffer });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };
  

  export const synchronizeFiles = async (req, res, next) => {
    try {
      console.log("Download triggered");
      console.log("sync triggered");
      const { startDate, endDate ,Token } = req.query;
      if (!startDate || !endDate || !Token) {
        return res.status(400).send('Missing required parameters: startDate or endDate');
      }
      const failed = await startBulkDownload(startDate , endDate , Token);
      console.log(failed);
      res.status(200).send({ success: true, filedata: true });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };
  