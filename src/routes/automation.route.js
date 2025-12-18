import express from "express";
import { getTaskstatus, buildTask,buildConfig, startImport, uploadTask, startDownload , deleteTask, 
    getDB, getActivity,getConfig,deleteWTask,getExcelFiles,getExcelFile,openFileFolder,
appendDetails,getUserDetails,insertTask,insertFile,updateConfig,getDBbyId,
notify,getNotifiedFiles,getWeekTaskstatus,getPendingTasks,sendDownloadedFile,getImportStatus} from "../controllers/automation.controller.js";


const automationRoutes = express.Router();

automationRoutes.get('/buildTask', buildTask);

automationRoutes.get('/getDB', getDB);

automationRoutes.get('/getDBbyId', getDBbyId);

automationRoutes.post('/buildConfig', buildConfig);

automationRoutes.post('/notify', notify);

automationRoutes.get('/DownloadFiles', startDownload);

automationRoutes.get('/sendFile', sendDownloadedFile);

automationRoutes.get('/Status', getTaskstatus);

automationRoutes.get('/weekStatus', getWeekTaskstatus);

automationRoutes.get('/pendingTasks', getPendingTasks);

automationRoutes.get('/deleteTask', deleteTask);

automationRoutes.get('/ImportFiles', startImport);

automationRoutes.get('/insertTask', insertTask);

automationRoutes.post('/UploadTask', uploadTask);

automationRoutes.get('/getActivityLog/:date', getActivity);

automationRoutes.get('/getConfig',getConfig);

automationRoutes.get('/deleteWeekTask', deleteWTask)

automationRoutes.get('/getExcelFileNames', getExcelFiles);

automationRoutes.get('/getExcelFile/:filename', getExcelFile);

automationRoutes.post('/openFolder', openFileFolder);

automationRoutes.post('/appendDetails', appendDetails);

automationRoutes.get('/getUserDetails', getUserDetails);

automationRoutes.get('/getNotifiedFiles', getNotifiedFiles);

automationRoutes.get('/getImportStatus', getImportStatus);

automationRoutes.post('/insertNewFile', insertFile);

automationRoutes.patch('/updateFileDetails',updateConfig);

export default automationRoutes;