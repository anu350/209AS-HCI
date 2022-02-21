// Use this file as quiz interface
// -- display as list instead of a flow for ease.

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Question from "./Question";
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

export default function QuizContainer() {
  const [myquestions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);

  const startQuiz = () => {
    // do question size checks in here
    // if everything looks good, change state:
    setStarted(true);
    console.log("quiz has started");
  };

  const endQuiz = () => {
    setStarted(false);
  };

  function runQuiz() {
    const problems = [
      {
        question: "what?",
        answer: "something",
      },
      {
        question: "what?",
        answer: "something",
      },
    ];
    return problems.map((aProblem, idx) => {
      return (
        <div>
          <div>{idx + ". " + aProblem.question}</div>
          <div>{aProblem.answer}</div>
        </div>
      );
    });
  }

  const retryQuiz = () => {
    console.log("retry quiz");
  };

  // function that loads as soon as component is mounted
  useEffect(() => {
    // generate questions here an modify state
  }, []);

  return (
    <div>
      <div>
        <h2>Quiz mode!</h2>

        {started ? (
          <div>
            <button onClick={endQuiz}>end</button>
            {runQuiz()}
          </div>
        ) : (
          <div>
            <button onClick={startQuiz}>start</button>
            <p>not started</p>
          </div>
        )}
      </div>
    </div>
  );
}
