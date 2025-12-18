const dbConfig = {
    user: 'sa',
    password: '123@sap#456',
    server: 'fitmind.connectcloud365.com', // ✅ hostname only
    port: 60382,                            // ✅ port separately defined
    database: 'FitOffice',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    connectionTimeout: 3000000, // Connection timeout (in milliseconds)
    requestTimeout: 30000000    // Request timeout (in milliseconds)
};

export default dbConfig;
