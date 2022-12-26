# Requirements
* Keyboard
* Electricity
* NodeJS

# Overview
Labeled Basic is a preprocessor for TRS80 Labeled BASIC files. It takes in a .lb file as input and processes it, outputting a .bas file. The preprocessor returns the number of lines in the input file and the output file, as well as the difference between the two.

# Running the Preprocessor
To run the preprocessor, use the following command in the terminal, replacing examples/printbye.lb with the file you want to process:
```
node . examples/printbye.lb
```
This will create a new file "printbye.bas" which can be used on the [TRS-80 Model 100](https://bitchin100.com/CloudT/#/M100Display).
