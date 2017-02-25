const CLOZE_TOKEN = "___";

function BasicFlashcard(front, back) {
	this.front = front;
	this.back = back;
}

function ClozeFlashcard(text, cloze) {
	if(!text.includes(cloze)) {
		return new Error(`Cloze word "${cloze}" is not a part of "${text}".`);
	}else {
		this.text = text;
		this.cloze = cloze;
		this.getPartialText = function() {
			var partialText = text.replace(cloze, CLOZE_TOKEN);
			return partialText;
		}
	}
}

module.exports = {BasicFlashcard, ClozeFlashcard, CLOZE_TOKEN};
