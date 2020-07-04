const fs = require("fs");
const xml2js = require("xml2js");
const JZZ = require("jzz");
require("jzz-midi-smf")(JZZ);
const childProcess = require("child_process");
const pathToFfmpeg = require("ffmpeg-static");
const path = require("path");

const input = fs.readFileSync(process.argv[2], "utf8");
const output = process.argv[3] || path.parse(process.argv[2]).name + ".wav";

const notes = require("./data/notes");
const tracks = require("./data/tracks");

xml2js.parseString(input, (_err, result) => {

	if (!fs.existsSync(".unmss")) fs.mkdirSync(".unmss");
	process.chdir(".unmss");

	// Stage 1: Split MSS into individual MID files

	for (i = 0; i < tracks.length; i++) {

		var smf = new JZZ.MIDI.SMF();
		smf.push(new JZZ.MIDI.SMF.MTrk());

		smf[0].add(0, JZZ.MIDI.smfBPM(result.MarioSequencerSong.$.tempo));

		for (j = 0; j < result.MarioSequencerSong.chord.length; j++) {

			const element = result.MarioSequencerSong.chord[j];

			if (element.speedmark) smf[0].add(j * 96, JZZ.MIDI.smfBPM(element.speedmark[0].$.tempo));

			if (element[tracks[i]]) {

				const note = element[tracks[i]][0].match(/[+-]?[A-Ia-i]/g);
				const volume = Math.round(element.$.volume * 7.9375);

				note.forEach(element => {
					smf[0].add(j * 96, JZZ.MIDI.noteOn(0, notes[element], volume));
					smf[0].add((j + 1) * 96, JZZ.MIDI.noteOff(0, notes[element]));
				});

			};

		};

		smf[0].add(result.MarioSequencerSong.chord.length * 96, JZZ.MIDI.smfEndOfTrack());

		fs.writeFileSync(tracks[i] + ".mid", smf.dump(), "binary");

	};

	// Stage 2: Convert MIDs to WAVs with soundfont

	tracks.map(x => childProcess.execFileSync("fluidsynth", [
		"-F",
		x + ".wav",
		"../sounds/" + x + ".sf2",
		x + ".mid"
	]));

	// Stage 3: Merge WAVs into one single file

	childProcess.execFileSync(pathToFfmpeg, [
		"-y",
		...tracks.map(x => ["-i", x + ".wav"]).flat(),
		"-filter_complex",
		"amix=inputs=" + tracks.length + ":duration=longest",
		path.resolve(__dirname, output)
	]);

	process.chdir("..");
	fs.rmdirSync(".unmss", {
		recursive: true
	});

});
