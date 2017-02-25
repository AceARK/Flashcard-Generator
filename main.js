var inquirer = require("inquirer");
var fs = require("fs");

var flashcards = require("./flashcards.js");

var basicQuizQuestions = [];
var clozeQuizQuestions = [];
var randomQuestions = [];
var randomQuestionIndex = 0;
var usedQuestionIndex = [];

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
					type: "list",
					name: "type",
					message: "Card type: ", 
					choices: ["Basic", "Cloze"]
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
						// Lazy initialization here, hence does not require a try-catch block
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
				randomQuestionIndex = 0;
				usedQuestionIndex = [];

				switch(choice.typeOfQs) {
					case "Basic Flashcard Quiz":
						fs.readFile(".basicCards", "utf-8", function(err, data) {
							quizQuestions = data.split("\n");
							var loop = 0;
							getQuestions(quizQuestions, loop);
						});
						break;

					case "Cloze Flashcard Quiz":
						fs.readFile(".clozeCards", "utf-8", function(err, data) {
							quizQuestions = data.split("\n");
							// var parsedQuestion = JSON.parse(quizQuestions[0]);
							var loop = 0;
							getQuestions(quizQuestions, loop);
							// Send to getQuestions function
						});
						break;

					case "Randomized":
						quizQuestions = [];
						fs.readFile(".basicCards", "utf-8", function(err, data) {
							quizQuestions = data.split("\n");

							fs.readFile(".clozeCards", "utf-8", function(err, data) {
								var clozeQuestions = data.split("\n");
								quizQuestions.push(...clozeQuestions);
 								
								var loop = 0;
								getQuestions(quizQuestions, loop);
							});
						});
				}
			})
		}
	})
}

// Function to get questions
function getQuestions(quizQuestions, loop) {
	// console.log(quizQuestions);
	if(loop < quizQuestions.length) {

		// Randomizing question sequence
		randomQuestionIndex = Math.floor(Math.random()*quizQuestions.length);
		while(usedQuestionIndex.indexOf(randomQuestionIndex) !== -1) {
			randomQuestionIndex = Math.floor(Math.random()*quizQuestions.length);
		}
		usedQuestionIndex.push(randomQuestionIndex);

		// Parsing into flashcard
		var flashcard = JSON.parse(quizQuestions[randomQuestionIndex]);
		// Check if flashcard is of cloze type
		if(flashcard.hasOwnProperty('cloze')) {
			var text = flashcard.text;
			var partialText = text.replace(flashcard.cloze,flashcards.CLOZE_TOKEN);
			var question = partialText;
			var answer = flashcard.cloze;
		}else {
			var question = flashcard.front;
			var answer = flashcard.back;
		}

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
			if(loop < quizQuestions.length) {
				inquirer.prompt([
					{
						type: "confirm",
						name: "another",
						message: "Take another?"
					}
				]).then(function(game) {
					if(game.another) {
						getQuestions(quizQuestions, loop);
					}else {
						getCommand();
					}
				});
			} else {
				console.log("Game over");
				getCommand();
			}
		});
	}
}

// Start Flashcard program
getCommand();
