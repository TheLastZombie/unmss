const fs = require("fs");
const xml2js = require("xml2js");

const cTrack = require("./tools/create-track");
const lInstruments = require("./tools/list-instruments");

const input = fs.readFileSync(process.argv[2], "utf8");
const output = process.argv[3];

xml2js.parseString(input, (_err, result) => {

	// TODO: Implement volume changes
	// TODO: Implement BPM changes
	// TODO: Implement setting measure
	// TODO: Set respective instruments

	fs.mkdirSync(".unmss");
	process.chdir(".unmss");

	for (i in lInstruments) {
		cTrack(result, lInstruments[i]);
	};

	process.chdir("..");

	// TODO: Combine, convert with Fluidsynth, write to output
	// TODO: Use soundfont specified in file
	// TODO: Delete .unmss directory

});
