// should do a "quiz start" screen that displays info about questions

import React, { useState, useEffect } from "react";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";
import "./QuizContainer.css";

// -------------------------------------------------------------------------------------------- Actual format to handle

export default function QuizContainer2(props) {
  const [myquestions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizLength, setQuizLength] = useState(0);

  const [wrongAttempt, setWrongAttempt] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState([]); //

  const [gameover, setGameover] = useState(false);

  const [answered, setAnswered] = useState(false);

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
        {
          answer: "something aaaa that",
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
        {
          answer: "ssss",
          correct: false,
        },
      ],
    },
  ];

  // called when component loads
  useEffect(() => {
    // generateQuestions(props.noteId);
    setQuestions(realQuestions);
    console.log("Quiz start!");
  }, []);

  // will be called when questions are populated
  useEffect(() => {
    initStates();
  }, [myquestions]);

  // will be called when question order is definec
  useEffect(() => {
    setCurrentQuestion(myquestions[questionOrder[0]]);
  }, [questionOrder]);

  useEffect(() => {
    setCurrentQuestion(myquestions[questionOrder[currentIndex]]);
  }, [currentIndex]);

  useEffect(() => {
    // console.log("quizLength: ", quizLength);
    // console.log("wrongAttempt: ", wrongAttempt);
    // console.log("playerScore: ", playerScore);
    // console.log("myquestions: ", myquestions);
    // console.log("currquestion: ", currentQuestion);
    // console.log("currindex: ", currentIndex);
    // console.log("questionorder: ", questionOrder);
  });

  const initStates = () => {
    setQuizLength(myquestions.length);
    setWrongAttempt(0);
    setPlayerScore(0);
    shuffleIndexes(myquestions.length); // this assigns questionOrder --> careful on setCurrentQuestion
  };

  // DONE
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

    if (isCorrect) {
      setPlayerScore(playerScore + 1);
      // score+1
      // nextQuestion
      // console.log("correct answer");
      e.target.style.backgroundColor = "#fff";
    } else {
      // wrong+1
      // nextQuestion
      // console.log("incorrect answer");
      e.target.style.backgroundColor = "#ccc";
    }
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
      setGameover(true);
    }
  };

  //closes score modal and resets game
  const closeScoreModal = () => {
    console.log("called closeScoreModal");
  };

  //function to close warning modal
  const closeOptionModal = () => {
    console.log("called closeOptionModal");
  };

  const loadQuestions = async () => {
    // try: fetch from DB
    // if empty : generate from python
  };

  function displayResults() {
    console.log("in display resukts");

    return (
      <div className="modal-content-container">
        <h1>Congratulations, Quiz Completed.</h1>

        <div className="grade-details">
          {/* <p>Attempts : 10</p> */}
          <p>
            Wrong Answers : <span id="wrong-answers"></span>
          </p>
          <p>Wrong Answers : {wrongAttempt}</p>
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
    );
  }

  return (
    <div>
      {loading ? (
        <p>loading</p>
      ) : (
        <button
          onClick={() => {
            setStarted(!started);
          }}
        >
          start
        </button>
      )}

      {started ? (
        <div>
          <main>
            <div className="modal-container" id="score-modal">
              {gameover ? displayResults() : null}
            </div>

            <div className="game-quiz-container">
              <div className="game-details-container">
                <h1>
                  Score : {playerScore} / {myquestions.length}
                </h1>
                <h1>
                  Question : {currentIndex + 1} / {myquestions.length}
                </h1>
              </div>

              <div className="game-question-container">
                <h1 id="display-question">{currentQuestion.question}</h1>
              </div>

              <div className="game-options-container">
                <div className="modal-container" id="option-modal">
                  <div className="modal-content-container">
                    <h1>Please Pick An Option</h1>

                    <div className="modal-button-container">
                      <button onClick={closeOptionModal}>
                        what Continue is this
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  {currentQuestion.answers.map((question, index) => (
                    <button onClick={(e) => checkAnswer(e, question.correct)}>
                      {question.answer}
                    </button>
                  ))}
                </div>
              </div>

              <div className="next-button-container">
                <button onClick={handleNextQuestion}>Next Question</button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <p>notstarted</p>
      )}
    </div>
  );
}
