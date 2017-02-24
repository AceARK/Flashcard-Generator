var inquirer = require("inquirer");
var fs = require("fs");

var flashcards = require("./flashcards.js");

var basicQuizQuestions = [];
var clozeQuizQuestions = [];
var randomQuestions = [];
var playCheck = false;

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
							message: "Enter the question:" 
						},
						{
							name: "answer",
							message: "Enter it's answer:"
						}
					]).then(function(basicFlashcard) {
						var newBasicFlashcard = new flashcards.BasicFlashcard(basicFlashcard.question, basicFlashcard.answer);
						// console.log(newBasicFlashcard);
						fs.appendFile(".basicCards", "\n" + JSON.stringify(newBasicFlashcard), function(err) {
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
							message: "Enter the complete text:" 
						},
						{
							name: "clozeText",
							message: "Enter the text to be hidden when quizzing:"
						}
					]).then(function(clozeFlashcard) {
						var newClozeFlashcard = new flashcards.ClozeFlashcard(clozeFlashcard.completeText, clozeFlashcard.clozeText );
						// Checking for proper cloze pattern using error 'throw' and handling
						if(newClozeFlashcard instanceof Error) {
							console.log(`
------------------------
Improper cloze flashcard pattern -> 
${newClozeFlashcard}

Flashcard discarded.
------------------------
`);
							getCommand();
						}else  {
							// Appending to closeCards file
							fs.appendFile(".clozeCards", "\n" + JSON.stringify(newClozeFlashcard), function(err) {
								if(err) {
									console.log(err);
								}else {
									console.log("Your flashcard has been stored.");
									getCommand();
								}
							}); // End of cloze flashcard storing
						} // End of else proper cloze condition 
					});
				} // cloze flash card creation inquirer end
			}); // card type inquirer end
		}else if(user.command === "Play quiz") {
			inquirer.prompt([
				{
					type: "list",
					name: "typeOfQs",
					message: "Which type of quiz would you like to play?",
					choices: ["Basic Flashcard Quiz", "Cloze Flashcard Quiz", "Randomized"] 
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
					case "Basic Flashcard Quiz":
						fs.readFile(".basicCards", "utf-8", function(err, data) {
							basicQuizQuestions = data.split("\n");
							var loop = 0;
							getQuestions(basicQuizQuestions, loop);
						});
						break;

					case "Cloze Flashcard Quiz":
						fs.readFile(".clozeCards", "utf-8", function(err, data) {});
						break;
				}

				function getQuestions(basicQuizQuestions, loop) {
					if(loop < basicQuizQuestions.length) {
						var flashcard = JSON.parse(basicQuizQuestions[loop]);
						var question = flashcard.front;
						var answer = flashcard.back;

						console.log(question);
						inquirer.prompt([
							{
								name: "answer",
								message: "Your answer: " 
							}
						]).then(function(user) {
							if(user.answer.toLowerCase() === answer.toLowerCase()) {
								console.log(`
You are correct!
--------------------
`);
							}else {
								console.log(`
You are wrong.
The correct answer is: ${answer}
--------------------
`);
							}
							loop++;
							if(loop < basicQuizQuestions.length) {
								inquirer.prompt([
									{
										type: "confirm",
										name: "another",
										message: "Play another?"
									}
								]).then(function(game) {
									if(game.another) {
										getQuestions(basicQuizQuestions, loop);
									}else {
										getCommand();
									}
								});
							} else {
								console.log("Basic Flashcard game over");
								getCommand();
							}
						});
					}
				}
			})
		}
	})
}
getCommand();
