function BasicFlashcard(front, back) {
	this.front = front;
	this.back = back;
}

function ClozeFlashard(text, cloze) {
	this.text = text;
	this.cloze = cloze;
	this.clozeDeletedDisplay = function() {
		// Displaying cloze deleted text by replacing the 'cloze' text with a blank
		var clozeDeletedText = text.replace(cloze, "__________");
		console.log(clozeDeletedText);
	}
}