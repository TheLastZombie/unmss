module.exports = (result, instrument) => {

	const scribble = require("scribbletune");

	const cNotes = require("./convert-notes");
	const cPattern = require("./convert-pattern");

	const input = result.MarioSequencerSong.chord.map(x => x[instrument]);

	const notes = cNotes(input);
	const pattern = cPattern(input);

	const clip = scribble.clip({
		notes: notes,
		pattern: pattern
	});

	return scribble.midi(clip, instrument + ".mid");

};
