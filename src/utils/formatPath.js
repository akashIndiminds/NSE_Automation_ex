function formatPath(filePath) {
    console.log(`Original path: ${filePath}`);
    
    // Replace all backslashes with forward slashes, then reduce multiple consecutive slashes to single slashes
    // But preserve the leading double slash for UNC paths
    const p = filePath
        .replace(/\\/g, '/')  // Replace all backslashes with forward slashes
        .replace(/\/+/g, '/') // Replace multiple consecutive slashes with single slash
        .replace(/^\/([^\/])/, '//$1'); // Restore leading double slash if it was a UNC path
    
    console.log(`Formatted path: ${p}`);
    return p;
}

export default formatPath;