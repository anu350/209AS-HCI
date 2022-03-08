import React, { useState, useEffect } from "react";
import "./QuizContainer.css";

export default function QuizContainer2(props) {
  const [myquestions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [gameState, setGameState] = useState("init"); // other states are "ongoing", "results"
  const [quizLength, setQuizLength] = useState(0);

  const [playerScore, setPlayerScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState([]); //

  const [answered, setAnswered] = useState(false);

  const [explain, setExplain] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const realQuestions = [
    {
      question: "1. what?",
      explanation: "a large amount of text",
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
        {
          answer: "something aaaa that",
          correct: false,
        },
      ],
    },
    {
      question: "2. Who?",
      explanation: "a large amount of text",
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
        {
          answer: "ssss",
          correct: false,
        },
      ],
    },
    {
      question: "3. Why?",
      explanation: "a large amount of text",
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
        {
          answer: "ssss",
          correct: false,
        },
      ],
    },
    {
      question: "4. When?",
      explanation: "a large amount of text",
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
        {
          answer: "ssss",
          correct: false,
        },
      ],
    },
  ];

  // called when component loads
  useEffect(() => {
    console.log("1. in component load: from previous: ", props.quiz);
    if (Object.entries(props.quiz).length !== 0) {
      setQuestions(props.quiz); // replace with props from caller
    }
    // setQuestions([]);
  }, []);

  // will be called when questions are populated
  useEffect(() => {
    console.log("2. in myquestion useffect");
    if (myquestions.length === props.quiz.length) {
      console.log("2.1 inside if");
      initStates();
    }
  }, [myquestions]);

  const initStates = () => {
    console.log("init states", myquestions);
    setQuizLength(myquestions.length);
    setPlayerScore(0);
    shuffleIndexes(myquestions.length); // this assigns questionOrder --> careful on setCurrentQuestion
    setCurrentIndex(0);
  };

  // called when question order is defined
  useEffect(() => {
    console.log("in questionOrder Effect");
    if (myquestions.length > 0) {
      // this keeps it from breaking
      console.log("in questionOrder Effect>> inside of if condition");
      setCurrentQuestion(myquestions[questionOrder[0]]);
      setLoaded(true);
    }
  }, [questionOrder]);

  // when currentIndex increments, this will be called
  useEffect(() => {
    setCurrentQuestion(myquestions[questionOrder[currentIndex]]);
  }, [currentIndex]);

  // useEffect(() => {
  // console.log("quizLength: ", quizLength);
  // console.log("wrongAttempt: ", wrongAttempt);
  // console.log("playerScore: ", playerScore);
  // console.log("myquestions: ", myquestions);
  // console.log("currquestion: ", currentQuestion);
  // console.log("currindex: ", currentIndex);
  // console.log("questionorder: ", questionOrder);
  // });

  // DONE -- careful with where i'm getting the size
  const shuffleIndexes = (size) => {
    const x = [...Array(size).keys()];
    // console.log("before shuffle", x);
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = x[i];
      x[i] = x[j];
      x[j] = temp;
    }
    // console.log("after shuffle", x);
    setQuestionOrder(x);
  };

  const checkAnswer = (e, isCorrect) => {
    // missing timeout after modifying background color.
    setAnswered(true);
    if (answered) {
      return;
    }

    if (isCorrect) {
      setPlayerScore(playerScore + 1);
      const oldcolor = "lightgray";
      document.body.style.backgroundColor = "rgb(214,255,214)"; // a light green
      setTimeout(() => {
        document.body.style.backgroundColor = oldcolor;
      }, 1000);
    } else {
      const oldcolor = "lightgray";
      document.body.style.backgroundColor = "rgb(255,214,214)"; // a light red
      setTimeout(() => {
        document.body.style.backgroundColor = oldcolor;
      }, 1000);
    }
  };

  const showExplanation = () => {
    console.log("called showExplanation", currentQuestion.explanation);
    setExplain(!explain);
  };

  // called when the next button is clicked
  const handleNextQuestion = () => {
    if (!answered) {
      // pop up message telling user to select an answer
      console.log("need to answer first");
      return;
    }

    if (currentIndex < quizLength - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnswered(false);
        // NextQuestion(currentIndex);
      }, 1000);
    } else {
      // setGameover(true);
      setGameState("results");
    }
  };

  const resetGame = () => {
    initStates();
    setGameState("init");
  };

  return (
    <div className="big-root">
      {/* <button
        onClick={() => {
          if (gameState === "init") setGameState("ongoing");
          if (gameState === "ongoing") setGameState("results");
          if (gameState === "results") setGameState("init");
          console.log("aaa");
        }}
      >
        DEBUG! toggle gameState
      </button> */}
      {loaded ? (
        {
          init: (
            <div className="start-banner">
              <div>
                <h2>Selected Quiz</h2>
                <h4>{props.numq} questions</h4>
                <h4>Created on {props.date}</h4>
                {/* <h4>Type: {props.type}</h4> */}
              </div>
              <div className="next-button-container">
                <button
                  onClick={() => {
                    setGameState("ongoing");
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          ),
          ongoing: (
            <div>
              {explain ? (
                <div className="explanation-container">
                  <p>{"... " + currentQuestion.explanation + " ..."}</p>
                </div>
              ) : null}
              <div className="game-quiz-container">
                <div className="game-details-container">
                  <h1>
                    Score : {playerScore} / {myquestions.length}
                  </h1>
                  <h1 onClick={showExplanation} className="clickable">
                    Hint/Explanation
                  </h1>
                  <h1>
                    Question : {currentIndex + 1} / {myquestions.length}
                  </h1>
                </div>

                <div className="game-question-container">
                  <h1>{currentQuestion.question}</h1>
                </div>

                <div className="game-options-container">
                  <div>
                    {currentQuestion.answers.map((answer, index) => (
                      <div className="answer-options">
                        <p>{String.fromCharCode(65 + index)}</p>
                        <button onClick={(e) => checkAnswer(e, answer.correct)}>
                          {answer.answer}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="next-button-container">
                  <button>Bad question?</button>
                  <button onClick={handleNextQuestion}>Next Question</button>
                </div>
              </div>
            </div>
          ),
          results: (
            <div className="results-container">
              <div className="results-header">
                <h1>Congratulations!</h1>
                <h2>Quiz Completed</h2>
              </div>
              <div className="results-details">
                <p>Wrong Answers : {quizLength - playerScore}</p>
                <p>Right Answers : {playerScore}</p>
                <p>Grade : {((playerScore / quizLength) * 100).toFixed()}%</p>
                <p>
                  <span id="remarks"></span>
                </p>
              </div>
              <div className="next-button-container">
                <button onClick={resetGame}>Continue</button>
              </div>
            </div>
          ),
        }[gameState]
      ) : (
        <div className="no-quiz-message">
          <h3>Select a saved quiz or create a new one.</h3>
        </div>
      )}
    </div>
  );
}
