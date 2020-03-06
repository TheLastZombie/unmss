module.exports = (input) => {

	var output = input.map(x => x && "x" || "-");

	output = output.join("");

	return output;

};
