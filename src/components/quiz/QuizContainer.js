// Use this file as quiz interface
// -- display as list instead of a flow for ease.

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Question from "./Question";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";
import "./QuizContainer.css";
// import Answers from "./Answer";
// import Results from "./Results";

const dummyQuestions = [
  {
    question: "what?",
    answer: "something",
  },
  {
    question: "what?",
    answer: "something",
  },
];

const dummyMCquestions = [
  {
    question: "How many days makes a week ?",
    optionA: "10 days",
    optionB: "14 days",
    optionC: "5 days",
    optionD: "7 days",
    correctOption: "optionD",
  },

  {
    question: "How many players are allowed on a soccer pitch ?",
    optionA: "10 players",
    optionB: "11 players",
    optionC: "9 players",
    optionD: "12 players",
    correctOption: "optionB",
  },

  {
    question: "Who was the first President of USA ?",
    optionA: "Donald Trump",
    optionB: "Barack Obama",
    optionC: "Abraham Lincoln",
    optionD: "George Washington",
    correctOption: "optionD",
  },
];

export default function QuizContainer() {
  const [myquestions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);

  let shuffledQuestions = []; //empty array to hold shuffled selected questions
  let questionNumber = 1;
  let quizLength = dummyMCquestions.length;
  let playerScore = 0;
  let wrongAttempt = 0;
  let indexNumber = 0;

  useEffect(() => {
    console.log("Quiz start!");

    NextQuestion(0);
  }, []);

  //SHUFFLE THE QUESTIONS
  const handleQuestions = () => {
    while (shuffledQuestions.length < quizLength) {
      const random = dummyMCquestions[Math.floor(Math.random() * quizLength)];
      if (!shuffledQuestions.includes(random)) {
        shuffledQuestions.push(random);
      }
    }
  };

  // FUNCTION TO DISPLAY QUESTION FROM ARRAY IN DOM
  const NextQuestion = (index) => {
    handleQuestions();
    console.log("SHUFFLED: " + shuffledQuestions[0]);
    const currentQuestion = shuffledQuestions[index];
    document.getElementById("question-number").innerHTML = questionNumber;
    document.getElementById("player-score").innerHTML = playerScore;
    document.getElementById("display-question").innerHTML =
      currentQuestion.question;
    document.getElementById("option-one-label").innerHTML =
      currentQuestion.optionA;
    document.getElementById("option-two-label").innerHTML =
      currentQuestion.optionB;
    document.getElementById("option-three-label").innerHTML =
      currentQuestion.optionC;
    document.getElementById("option-four-label").innerHTML =
      currentQuestion.optionD;
  };

  const checkForAnswer = () => {
    const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
    const currentQuestionAnswer = currentQuestion.correctOption; //gets current Question's answer
    const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)
    let correctOption = null;

    options.forEach((option) => {
      if (option.value === currentQuestionAnswer) {
        //get's correct's radio input with correct answer
        correctOption = option.labels[0].id;
      }
    });

    //checking to make sure a radio input has been checked or an option being chosen
    if (
      options[0].checked === false &&
      options[1].checked === false &&
      options[2].checked === false &&
      options[3].checked === false
    ) {
      document.getElementById("option-modal").style.display = "flex";
    }

    //checking if checked radio button is same as answer
    options.forEach((option) => {
      if (option.checked === true && option.value === currentQuestionAnswer) {
        document.getElementById(correctOption).style.backgroundColor = "green";
        playerScore++;
        indexNumber++;
        //set to delay question number till when next question loads
        setTimeout(() => {
          questionNumber++;
        }, 1000);
      } else if (option.checked && option.value !== currentQuestionAnswer) {
        const wrongLabelId = option.labels[0].id;
        document.getElementById(wrongLabelId).style.backgroundColor = "red";
        document.getElementById(correctOption).style.backgroundColor = "green";
        wrongAttempt++;
        indexNumber++;
        //set to delay question number till when next question loads
        setTimeout(() => {
          questionNumber++;
        }, 1000);
      }
    });
  };

  //called when the next button is called
  const handleNextQuestion = () => {
    checkForAnswer();
    unCheckRadioButtons();
    //delays next question displaying for a second
    setTimeout(() => {
      if (indexNumber < quizLength) {
        NextQuestion(indexNumber);
      } else {
        handleEndGame();
      }
      resetOptionBackground();
    }, 1000);
  };

  //sets options background back to null after display the right/wrong colors
  const resetOptionBackground = () => {
    const options = document.getElementsByName("option");
    options.forEach((option) => {
      document.getElementById(option.labels[0].id).style.backgroundColor = "";
    });
  };

  // unchecking all radio buttons for next question(can be done with map or foreach loop also)
  const unCheckRadioButtons = () => {
    const options = document.getElementsByName("option");
    for (let i = 0; i < options.length; i++) {
      options[i].checked = false;
    }
  };

  // function for when all questions being answered
  const handleEndGame = () => {
    let remark = null;
    let remarkColor = null;

    // condition check for player remark and remark color
    if (playerScore <= 3) {
      remark = "Bad Grades, Keep Practicing.";
      remarkColor = "red";
    } else if (playerScore >= 4 && playerScore < 7) {
      remark = "Average Grades, You can do better.";
      remarkColor = "orange";
    } else if (playerScore >= 7) {
      remark = "Excellent, Keep the good work going.";
      remarkColor = "green";
    }
    const playerGrade = (playerScore / 10) * 100;

    //data to display to score board
    document.getElementById("remarks").innerHTML = remark;
    document.getElementById("remarks").style.color = remarkColor;
    document.getElementById("grade-percentage").innerHTML = playerGrade;
    document.getElementById("wrong-answers").innerHTML = wrongAttempt;
    document.getElementById("right-answers").innerHTML = playerScore;
    document.getElementById("score-modal").style.display = "flex";
  };

  //closes score modal and resets game
  const closeScoreModal = () => {
    questionNumber = 1;
    playerScore = 0;
    wrongAttempt = 0;
    indexNumber = 0;
    shuffledQuestions = [];
    NextQuestion(indexNumber);
    document.getElementById("score-modal").style.display = "none";
  };

  //function to close warning modal
  const closeOptionModal = () => {
    document.getElementById("option-modal").style.display = "none";
  };

  // const startQuiz = () => {
  //   // do question size checks in here
  //   loadQuestions();
  //   // if everything looks good, change state:
  //   setStarted(true);
  //   console.log("quiz has started");
  // };

  // const endQuiz = () => {
  //   setStarted(false);
  // };

  const loadQuestions = async () => {
    // try: fetch from DB
    // if empty : generate from python
  };

  // function runQuiz() {
  //   const problems = [
  //     {
  //       question: "what?",
  //       answer: "something",
  //     },
  //     {
  //       question: "what?",
  //       answer: "something",
  //     },
  //   ];
  //   return problems.map((aProblem, idx) => {
  //     return (
  //       <div>
  //         <div>{idx + ". " + aProblem.question}</div>
  //         <div>{aProblem.answer}</div>
  //       </div>
  //     );
  //   });
  // }

  // const retryQuiz = () => {
  //   console.log("retry quiz");
  // };

  return (
    <div>
      <div>
        <main>
          <div className="modal-container" id="score-modal">
            <div className="modal-content-container">
              <h1>Congratulations, Quiz Completed.</h1>

              <div className="grade-details">
                <p>Attempts : 10</p>
                <p>
                  Wrong Answers : <span id="wrong-answers"></span>
                </p>
                <p>
                  Right Answers : <span id="right-answers"></span>
                </p>
                <p>
                  Grade : <span id="grade-percentage"></span>%
                </p>
                <p>
                  <span id="remarks"></span>
                </p>
              </div>

              <div className="modal-button-container">
                <button onClick={closeScoreModal}>Continue</button>
              </div>
            </div>
          </div>

          <div className="game-quiz-container">
            <div className="game-details-container">
              <h1>
                Score : <span id="player-score"></span> / 10
              </h1>
              <h1>
                {" "}
                Question : <span id="question-number"></span> / 10
              </h1>
            </div>

            <div className="game-question-container">
              <h1 id="display-question"></h1>
            </div>

            <div className="game-options-container">
              <div className="modal-container" id="option-modal">
                <div className="modal-content-container">
                  <h1>Please Pick An Option</h1>

                  <div className="modal-button-container">
                    <button onClick={closeOptionModal}>Continue</button>
                  </div>
                </div>
              </div>

              <span>
                <input
                  type="radio"
                  id="option-one"
                  name="option"
                  className="radio"
                  value="optionA"
                />
                <label
                  htmlFor="option-one"
                  className="option"
                  id="option-one-label"
                ></label>
              </span>

              <span>
                <input
                  type="radio"
                  id="option-two"
                  name="option"
                  className="radio"
                  value="optionB"
                />
                <label
                  htmlFor="option-two"
                  className="option"
                  id="option-two-label"
                ></label>
              </span>

              <span>
                <input
                  type="radio"
                  id="option-three"
                  name="option"
                  className="radio"
                  value="optionC"
                />
                <label
                  htmlFor="option-three"
                  className="option"
                  id="option-three-label"
                ></label>
              </span>

              <span>
                <input
                  type="radio"
                  id="option-four"
                  name="option"
                  className="radio"
                  value="optionD"
                />
                <label
                  htmlFor="option-four"
                  className="option"
                  id="option-four-label"
                ></label>
              </span>
            </div>

            <div className="next-button-container">
              <button onClick={handleNextQuestion}>Next Question</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
