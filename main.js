var inquirer = require("inquirer");
var fs = require("fs");

var flashcards = require("./flashcards.js");


// newBasicFlashcard.displayQuestion();

// newBasicFlashcard.displayAnswer();


// newClozeFlashcard.clozeDeletedDisplay();

// newClozeFlashcard.displayAnswer();

function getCommand() {
	inquirer.prompt([
		{	
			type: "list",
			name: "command",
			message: "What would you like to do?",
			choices: ["Create a flashcard", "Play quiz", "Exit"] 
		}
	]).then(function(user) {
		if(user.command === "Create a flashcard") {
			inquirer.prompt([
				{
					name: "type",
					message: "Basic or Cloze?", 
				}
			]).then(function(card) {
				if(card.type === "Basic") {
					inquirer.prompt([
						{
							name: "question",
							message: "Enter the question." 
						},
						{
							name: "answer",
							message: "Enter it's answer."
						}
					]).then(function(basicFlashcard) {
						var newBasicFlashcard = new flashcards.BasicFlashcard(basicFlashcard.question, basicFlashcard.answer);
						// console.log(newBasicFlashcard);
						fs.appendFile(".basicCards", JSON.stringify(newBasicFlashcard), function(err) {
							if(err) {
								console.log(err);
							}else {
								console.log("Your flashcard has been stored.");
								getCommand();
							}
						})
					}); // basic flash card creation inquirer end
				}else if(card.type === "Cloze") {
					inquirer.prompt([
						{
							name: "completeText",
							message: "Enter the complete text." 
						},
						{
							name: "clozeText",
							message: "Enter the text to be hidden when quizzing."
						}
					]).then(function(clozeFlashcard) {
						var newClozeFlashcard = new flashcards.ClozeFlashcard(clozeFlashcard.completeText, clozeFlashcard.clozeText );
						// Appending to closeCards file
						fs.appendFile(".clozeCards", JSON.stringify(newClozeFlashcard), function(err) {
							if(err) {
								console.log(err);
							}else {
								console.log("Your flashcard has been stored.");
								getCommand();
							}
						})
					});
				} // cloze flash card creation inquirer end
			}); // card type inquirer end
		}else if(user.command === "Display flashcards") {
			displayCards();
		}else if(user.command === "Play quiz") {
			inquirer.prompt([
				{
					type: "list",
					name: "typeOfQs",
					message: "Which type of quiz would you like to play?",
					choices: ["Basic Flashcard quiz", "Cloze Flashcard Quiz", "Randomized"] 
				}
			]).then(function(choice) {
				// If Basic, read basic file
				// Choose any question at random (store index in used index list to avoid displaying used questions again)
				// Ask question, and wait for answer
				// If answer = answer in file, "correct", else "wrong"
				// Go to next question

				// If Cloze, read cloze file
				// Choose any question at random (store index in used index list to avoid displaying used questions again)
				// Pass into cloze constructor and use method clozeDeletedDisplay() to display only quiz text, and wait for user answer
				// If answer = answer in file, "correct", else "wrong"
				// Go to next question
				switch(choice.typeOfQs) {
					case "Basic Flashcard quiz":
						fs.readFile(".basicCards", "utf-8", function(err, data) {
							console.log(data);
						})
				}
			})
		}
	})
}

getCommand();
