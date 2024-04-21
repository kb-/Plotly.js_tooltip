const code_to_add = 'module.exports = { templateFormatString, lib };';
const fs = require('fs');
const path = require('path');

// Define paths
const sourceFilePath = path.resolve(__dirname, 'node_modules/plotly.js/src/lib/index.js');

// Function to modify the source file
function modifySourceFile() {
    if (!fs.existsSync(sourceFilePath)) {
        console.error("Source file does not exist:", sourceFilePath);
        return;
    }

    // Read the source file
    const content = fs.readFileSync(sourceFilePath, 'utf8');

    // Check if the content already includes the code to add
    if (content.includes(code_to_add)) {
        console.log("No modification needed. Code already present.");
        return;
    }

    // Modify the content by appending your custom export
    const modifiedContent = content + '\n' + code_to_add + '\n';

    // Write the modified content back to the original file
    fs.writeFileSync(sourceFilePath, modifiedContent);
    console.log("File modified and saved to:", sourceFilePath);
}

// Run the function
modifySourceFile();
