// should do a "quiz start" screen that displays info about questions

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Question from "./Question";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";
import "./QuizContainer.css";
//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
//import Oval from 'react-loader-spinner';

// -------------------------------------------------------------------------------------------- Actual format to handle
const realQuestions = [
  {
    question: "what?",
    answers: [
      {
        answer: "something",
        correct: true,
      },
      {
        answer: "something else",
        correct: false,
      },
      {
        answer: "something besides that",
        correct: false,
      },
    ],
  },
  {
    question: "Who?",
    answers: [
      {
        answer: "someone",
        correct: true,
      },
      {
        answer: "someone else",
        correct: false,
      },
      {
        answer: "nobody",
        correct: false,
      },
    ],
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

export default function QuizContainer(props) {
  const [myquestions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  // const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [quizLength, setQuizLength] = useState(0);

  let shuffledQuestions = []; //empty array to hold shuffled selected questions <----------------------------refactor using state and setstate
  // >>>>> could just make a list of indexes and shuffle those.
  //       instead of shuffling objects
  let questionNumber = 1;
  let playerScore = 0;
  let wrongAttempt = 0;
  let indexNumber = 0;

  useEffect(() => {
    generateQuestions(props.noteId);
    console.log("Quiz start!");
  }, []);

  useEffect(() => {
    if (started) {
      shuffleQuestions();
      NextQuestion(0);
    }
  }, [started]);

  useEffect(() => {
    console.log("quizLength: ", quizLength);
  });

  const generateQuestions = async () => {
    console.log("in questiongeneration");
    setLoading(true);
    fetch("http://localhost:5000/notes/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: "test title",
        raw_json: props.fullnote.raw_json,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log("full resposnse:", json);
        if (json[2] === 201) {
          let transit_questions = json[1].map((q) => ({
            question: q.question,
            answers: q.answer,
          }));
          console.log("transit questions: ", transit_questions);
          setQuestions(transit_questions);
          setQuizLength(transit_questions.length);

          // // checkIf New Questions
          // let newQuestions = transit_questions.filter(
          //   (x) => !myquestions.includes(x)
          // );
          // if (newQuestions.length > 0) {
          //   newQuestions.map((aquestion) =>
          //     setQuestions((myquestions) => [...myquestions, aquestion])
          //   );
          //   // await saveQuestions();
          // } else {
          //   console.log("no new questions");
          // }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error occured while onGenerate:", error);
        setLoading(false);
      });
  };

  //SHUFFLE THE QUESTIONS
  const shuffleQuestions = () => {
    while (shuffledQuestions.length < quizLength) {
      const random = myquestions[Math.floor(Math.random() * quizLength)];
      if (!shuffledQuestions.includes(random)) {
        shuffledQuestions.push(random);
      }
    }
  };

  // FUNCTION TO DISPLAY QUESTION FROM ARRAY IN DOM
  const NextQuestion = (index) => {
    // shuffleQuestions();
    // console.log("SHUFFLED: " + shuffledQuestions[0]);
    const currentQuestion = shuffledQuestions[index];
    document.getElementById("question-number").innerHTML = questionNumber;
    document.getElementById("player-score").innerHTML = playerScore;
    document.getElementById("display-question").innerHTML =
      currentQuestion.question;
    document.getElementById("option-zero-label").innerHTML =
      currentQuestion.answers[0].answer;
    document.getElementById("option-one-label").innerHTML =
      currentQuestion.answers[1].answer;
    document.getElementById("option-two-label").innerHTML =
      currentQuestion.answers[2].answer;
    document.getElementById("option-three-label").innerHTML =
      currentQuestion.answers[3].answer;
  };

  const checkForAnswer = () => {
    const currentQuestion = shuffledQuestions[indexNumber]; //gets current Question
    // const currentQuestionAnswer = currentQuestion.correctOption; //gets current Question's index
    const idx = shuffledQuestions[indexNumber].answers.findIndex(
      (x) => x.correct === true
    );
    const answer_value = "option" + idx;  //option0,1,2,3
    console.log("my answer: ", answer_value); //x_answer
    const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs) <-------- TOO HARDCODED!
    let correctOption = null;

    options.forEach((option) => {
      if (option.value === answer_value) {
        //get's correct's radio input with correct answer
        correctOption = option.labels[0].id; // < --------------------------------------------Sometimes fails
        console.log("inside options loop: correctoption: ", correctOption);
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
      if (option.checked === true && option.value === answer_value) {
        document.getElementById(correctOption).style.backgroundColor = "green";
        playerScore++;
        indexNumber++;
        //set to delay question number till when next question loads
        setTimeout(() => {
          questionNumber++;
        }, 1000);
      } else if (option.checked && option.value !== answer_value) {
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

    // condition check for player remark and remark color <---------------------------------------------- Hardcoded. make dynamic or remove
    if (playerScore <= 3) {
      remark = "Improvement Needed, Keep Practicing!";
      remarkColor = "red";
    } else if (playerScore >= 4 && playerScore < 7) {
      remark = "Average Grades, You can do better!";
      remarkColor = "orange";
    } else if (playerScore >= 7) {
      remark = "Excellent, Keep the good work going!";
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
    setStarted(false);
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

  const loadQuestions = async () => {
    // try: fetch from DB
    // if empty : generate from python
  };

  return (
    <div>
      {loading ? (

        <p className="overall-container"> <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></p>
      ) : ( 
        <div className="start-quiz-container">
          {/* If quiz started, display close button, else display start button*/}
          {started ? ( 
              <button
                onClick={() => {
                  setStarted(!started);
                }}
                className="start-quiz"
              >
                Close Quiz
              </button>
          ) : (
              <button
                onClick={() => {
                  setStarted(!started);
                }}
                className="start-quiz"
              >
                Start Quiz
              </button>
          )}
        </div>
      )}

      {started ? (
        <div>
          <main className="overall-container">
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
                    id="option-zero"
                    name="option"
                    className="radio"
                    value="option0"
                  />
                  <label
                    htmlFor="option-zero"
                    className="option"
                    id="option-zero-label"
                  ></label>
                </span>

                <span>
                  <input
                    type="radio"
                    id="option-one"
                    name="option"
                    className="radio"
                    value="option1"
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
                    value="option2"
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
                    value="option3"
                  />
                  <label
                    htmlFor="option-three"
                    className="option"
                    id="option-three-label"
                  ></label>
                </span>
              </div>

              <div className="next-button-container">
                <button onClick={handleNextQuestion}>Next Question</button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <p className="overall-container"></p>
      )}
    </div>
  );
}