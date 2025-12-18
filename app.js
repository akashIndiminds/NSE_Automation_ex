import express from 'express';
import cors from 'cors';
import downloadRoutes from './src/routes/download.route.js'
import errorHandler from './src/middlewares/error.middleware.js';
import loginRoutes from './src/routes/login.route.js';
import automationRoutes from './src/routes/automation.route.js';

import validateUserLogin from './src/services/UserLogin/userRepository.js';


const app = express();

app.use(cors());
app.use(express.json());  // For parsing JSON bodies

// Timeout Middleware 
// app.use((req, res, next) => {
//     const timeout = setTimeout(() => {
//         if (!res.headersSent) { 
//             res.status(504).json({ error: "Request timed out" });
//         }
//     }, 120000); // 70 seconds timeout

//     // Clear timeout when response is sent
//     res.on("finish", () => clearTimeout(timeout));
//     res.on("close", () => clearTimeout(timeout));

//     next();
// });

app.use('/api/download',downloadRoutes);  // Use document-related routes

app.use('/api/login', loginRoutes); 

app.use('/api/automate',automationRoutes); 


app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
      title: "Login API",
      description: "API for validating login credentials with NSE integration.",
      version: "1.0.0",
    });
  });
  
  // Login endpoint - supports both GET and POST
  app
    .route("/login")
    .get(async (req, res) => {
      try {
        const { loginId, password } = req.query;
  
        if (!loginId || !password) {
          return res.status(400).json({
            error:
              "Missing required parameters: loginId and password are required",
          });
        }
  
        const result = await validateUserLogin(loginId, password);
  
        if (!result) {
          return res
            .status(500)
            .json({ error: "No response from stored procedure" });
        }
  
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    })
    .post(async (req, res) => {
      try {
        const { loginId, password } = req.body;
  
        if (!loginId || !password) {
          return res.status(400).json({
            error:
              "Missing required parameters: loginId and password are required",
          });
        }
  
        const result = await validateUserLogin(loginId, password);
  
        if (!result) {
          return res
            .status(500)
            .json({ error: "No response from stored procedure" });
        }
  
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
  
  // NSE Login endpoint - supports both GET and POST
  app
    .route("/nse-login")
    .get(async (req, res) => {
      try {
        const { loginId, password, nseResponseCode } = req.query;
  
        if (!loginId || !password || !nseResponseCode) {
          return res.status(400).json({
            error:
              "Missing required parameters: loginId, password and nseResponseCode are required",
          });
        }
  
        const result = await validateUserLogin(
          loginId,
          password,
          parseInt(nseResponseCode)
        );
  
        if (!result) {
          return res
            .status(500)
            .json({ error: "No response from stored procedure" });
        }
  
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    })
    .post(async (req, res) => {
      try {
        const { loginId, password, nseResponseCode } = req.body;
  
        if (!loginId || !password || !nseResponseCode) {
          return res.status(400).json({
            error:
              "Missing required parameters: loginId, password and nseResponseCode are required",
          });
        }
  
        const result = await validateUserLogin(
          loginId,
          password,
          parseInt(nseResponseCode)
        );
  
        if (!result) {
          return res
            .status(500)
            .json({ error: "No response from stored procedure" });
        }
  
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });


export default app;