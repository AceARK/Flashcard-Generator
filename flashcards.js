const CLOZE_TOKEN = "___";

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
	if(!text.includes(cloze)) {
		return new Error(`Cloze word "${cloze}" is not a part of "${text}".`);
	}else {
		this.text = text;
		this.cloze = cloze;
	}
}

module.exports = {BasicFlashcard, ClozeFlashcard, CLOZE_TOKEN};
