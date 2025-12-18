import express from 'express';
import { synchronizeFiles , singleFileDownload , listBuilder } from '../controllers/download.controller.js';

const downloadRoutes = express.Router();


downloadRoutes.get('/syncfiles', synchronizeFiles);
downloadRoutes.get('/listBuild', listBuilder);
downloadRoutes.get('/file', singleFileDownload);



export default downloadRoutes;
