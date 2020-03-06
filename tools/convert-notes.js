module.exports = (input) => {

	const lNotes = require("./list-notes");

	var output = input.filter(Boolean).flat();

	output = output.map(x => x.match(/(\+|-)*[A-Ha-i]/g));

	output = output.map(x => {
		x = x.map(y => lNotes[y]);
		return (x.length == 1 ? x.toString() : x);
	});

	return output;

};
