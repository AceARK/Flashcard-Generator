function BasicFlashcard(front, back) {
	this.front = front;
	this.back = back;
	this.displayQuestion = function() {
		console.log(this.front);
	}
	this.displayAnswer = function() {
		console.log(this.back);
	}
}

function ClozeFlashcard(text, cloze) {
	this.text = text;
	this.cloze = cloze;
	this.clozeDeletedDisplay = function() {
		// Displaying cloze deleted text by replacing the 'cloze' text with a blank
		var clozeDeletedText = text.replace(cloze, "$$token$$");
		console.log(clozeDeletedText);
	};
	this.displayAnswer = function() {
		console.log(this.text);
	};
}

module.exports = {BasicFlashcard, ClozeFlashcard};
