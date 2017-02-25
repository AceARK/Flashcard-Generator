const CLOZE_TOKEN = "___";

// Incorporating JS closures so that user can create new objects with or without 'new' keyword
function BasicFlashcard(front, back) {
	var _front = front;
	var _back = back;
	this.front = front;
	this.back = back;
	var basicCardObject = {
		front: _front,
		back: _back
	};
	return basicCardObject;
}

function ClozeFlashcard(text, cloze) {
	if(!text.includes(cloze)) {
		return new Error(`Cloze word "${cloze}" is not a part of "${text}".`);
	}else {
		if(this instanceof ClozeFlashcard) {
			this.text = text;
			this.cloze = cloze;
			this.getPartialText = function() {
				var partialText = text.replace(cloze, CLOZE_TOKEN);
				return partialText;
			}
		}else {
			return new ClozeFlashcard(text, cloze);
		}
	}
}

module.exports = {BasicFlashcard, ClozeFlashcard, CLOZE_TOKEN};
