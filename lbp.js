// TRS80 Labeled BASIC Preprocessor

const fs = require("fs");

if(process.argv.length < 3) {
    console.log("You must pass in a .lb file to process");
    return;
}

let inputFile = process.argv[2];
if(!inputFile.endsWith(".lb")) {
    console.log("Invalid file. Must be .lb filetype");
    return;
}

if(!fs.existsSync(inputFile)) {
    console.log(`Unable to find file: ${inputFile}`);
    return;
}

console.log("Processing...");
let outputFile = inputFile.replace(".lb", ".bas");
processLbFile(inputFile, outputFile);
console.log("Finished!");

function processLbFile(fileName, outputFile) {
    /** @type {String[]} */ let inputLines = fs.readFileSync(fileName, "utf-8").split(/\r?\n/);
    /** @type {String[]} */ let outputLines = [];
    /** @type {Object<String, Number>} */ let labels = {};
    /** @type {Number} */ let lineNumber = 10;
    
    // For each line
    for(let i = 0; i < inputLines.length; i++) {
        /** @type {String} */ let currentLine = inputLines[i].trim();
        /** @type {String} */ let resultLine; // Result
        
        // Skip empty lines
        if(currentLine.length <= 0) continue;
        
        // If line is a label
        if(currentLine.startsWith("@")) {
            // Add label to labels collection
            resultLine = `${lineNumber} REM ${inputLines[i]}`;
            labels[currentLine] = lineNumber + 10;
        }
        else {
            // Do nothing special
            resultLine = `${lineNumber} ${inputLines[i]}`;
        }
        lineNumber += 10;
        outputLines.push(resultLine);
    }
    
    // For each label in labels collection
    Object.keys(labels).forEach(label => {
        // For each line
        for(let i = 0; i < outputLines.length; i++) {
            /** @type {String} */ let line = outputLines[i];
            
            // Replace @LABEL with line number if it's not the label definition line
            if(!line.includes("REM") && outputLines[i].includes(label)) {
                line = outputLines[i].replace(label, labels[label]);
                outputLines[i] = line;
            }
        }
    });
    
    // Write file
    fs.writeFileSync(outputFile, outputLines.join("\n"));
}
