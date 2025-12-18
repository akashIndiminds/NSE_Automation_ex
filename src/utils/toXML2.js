import { create } from 'xmlbuilder2';

function toXML2(data) {
    // Validate input
    if (!Array.isArray(data)) {
        throw new Error('Input must be an array');
    }
    if (data.length === 0) {
        // Return empty but valid XML structure
        return '<Data></Data>';
    }
    try {
        // Create XML builder root
        const xml = create()
            .ele('Data');
        // Iterate through data array and create Record elements
        data.forEach((item, index) => {
            // Validate each item
            if (typeof item !== 'object' || item === null) {
                console.warn(`Skipping invalid item at index ${index}`);
                return;
            }
            const record = xml.ele('Record');
            Object.keys(item).forEach(key => {
                // Handle special cases for values
                let value = item[key];
                // Convert null/undefined to empty string
                if (value === null || value === undefined) {
                    value = '';
                }
                // Convert objects/arrays to string
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                // Ensure value is string
                value = String(value);
                // Create element with text
                record.ele(key).txt(value);
            });
        });
        // Convert to string with formatting, suppressing XML declaration
        const xmlString = xml.end({ prettyPrint: true, headless: true });
        // Validate the output doesn't start with closing tag
        if (xmlString.startsWith('</')) {
            throw new Error('Generated XML is malformed - starts with closing tag');
        }
        return xmlString;
    } catch (error) {
        console.error('Error generating XML:', error);
        throw new Error(`Failed to generate XML: ${error.message}`);
    }
}

export default toXML2;