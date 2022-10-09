// TRS80 Labeled BASIC Preprocessor

const fs = require("fs");

// Check arg count
if(process.argv.length < 3) {
    console.log("You must pass in a .lb file to process");
    return;
}

// Check file name is valid
let inputFile = process.argv[2];
if(!inputFile.endsWith(".lb")) {
    console.log("Invalid file. Must be .lb filetype");
    return;
}

// Check file exists
if(!fs.existsSync(inputFile)) {
    console.log(`Unable to find file: ${inputFile}`);
    return;
}

// Begin
console.log("Processing...");
let outputFile = inputFile.replace(".lb", ".bas");
let lineCount = processLbFile(inputFile, outputFile);
console.log("Finished!");

console.log("\nLines");
console.log(`${inputFile}: ${lineCount[0]}`);
console.log(`${outputFile}: ${lineCount[1]}`);
console.log(`Delta: ${lineCount[1] - lineCount[0]}`);

// Done

/**
 * Process the Labeled BASIC file.
 * @param {String} fileName 
 * @param {String} outputFile 
 * @returns {Number[]}
 */
function processLbFile(fileName, outputFile) {
    const lineIncrementSize = 10;
    /** @type {String[]} */ let inputLines = fs.readFileSync(fileName, "utf-8").split(/\r?\n/);
    /** @type {String[]} */ let outputLines = [];
    /** @type {Object<String, Number>} */ let labels = {};
    /** @type {Number} */ let lineNumber = lineIncrementSize;
    
    // For each line
    for(let i = 0; i < inputLines.length; i++) {
        /** @type {String} */ let currentLine = inputLines[i].trim();
        /** @type {String} */ let resultLine; // Result
        
        // Skip empty lines
        if(currentLine.length <= 0) continue;
        
        // Skip comment lines
        if(currentLine.startsWith("'")) continue;
        
        // If line is a label
        if(currentLine.startsWith("@")) {
            // Add label to labels collection
            resultLine = `${lineNumber} REM ${currentLine}`;
            labels[currentLine] = lineNumber + lineIncrementSize;
        }
        else {
            // Do nothing special
            resultLine = `${lineNumber} ${currentLine}`;
        }
        lineNumber += lineIncrementSize;
        
        // Clean off any .lb comments
        if(resultLine.includes("'")) {
            resultLine = resultLine.slice(0, resultLine.indexOf("'"));
            resultLine = resultLine.trim();
        }
        outputLines.push(resultLine);
    }
    
    // Get list of labels
    let labelEntries = Object.keys(labels);
    
    // Sort by longest label to shortest label.
    // They must be sorted because otherwise short label names could fit
    // into longer label names when finding/replacing `@LABEL` with `@LABEL_LONG`.
    // The output might be `130_LONG`.
    // But larger labels do not fit inside smaller labels, so handle bigger labels first.
    // Then shorter labels won't get confused.
    labelEntries = labelEntries.sort((a, b) => {
        return b.length - a.length;
    });
    
    // For each label entry
    for(let i = 0; i <= labelEntries.length; i++) {
        let labelName = labelEntries[i];
        let labelLineNumber = labels[labelName];
        
        // For each line
        for(let j = 0; j < outputLines.length; j++) {
            /** @type {String} */ let line = outputLines[j];
            
            // Replace @LABEL with line number if it's not the label definition line
            if(!line.includes(" REM @") && outputLines[j].includes(labelName)) {
                line = outputLines[j].replace(labelName, labelLineNumber);
                outputLines[j] = line;
            }
        }
    }
    
    // Write file
    fs.writeFileSync(outputFile, outputLines.join("\n"));
    
    return [inputLines.length, outputLines.length];
}
