// missing: calling quiz start + shift to current quiz

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./SavedQuizMenu.css";

export default function SavedQuizMenu(props) {
  const [quizzes, setQuizzes] = useState([]);
  const [empty, setEmpty] = useState(true);

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

  // use map to request and display
  useEffect(() => {
    console.log("loaded saved quiz menu, with id: ", props.noteId);
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (quizzes.length) {
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  }, [quizzes]);

  const fetchQuizzes = async (my_id) => {
    const { data, error } = await supabase
      .from("quizzes")
      .select()
      .eq("related_note", props.noteId)
      .order("created_at", { ascending: true });
    if (error) console.log("error fetching questions", error);
    else {
      if (data.length) {
        setQuizzes(data);
      }
    }
  };

  const handleQuizSelection = async (quiz_id) => {
    // console.log("in handleQuizSelection");
    // fetch questions with quizid
    // let quiz_id_dummy = "186e654e-e632-4345-aa07-3b7cfae4262a";

    const { data, error } = await supabase
      .from("questions")
      .select()
      .match({ related_quiz: quiz_id });
    if (error) console.log("error deleting quiz");

    // console.log("post response, data: ", data);
    props.loadQuiz(quiz_id, data);
  };

  const deleteQuiz = async (quiz_id) => {
    const { data, error } = await supabase
      .from("quizzes")
      .delete()
      .match({ id: quiz_id });
    if (error) console.log("error deleting quiz");
  };

  return (
    <div className="savedQuizMenu-container">
      {/* <button onClick={fetchQuizzes}>fetchquestions</button> */}
      {
        {
          false: (
            <div>
              {quizzes.map((myQ, index) => (
                <div key={index} className="savedQuizMenu-subcontainer">
                  <div className="savedQuizMenu-title-container">
                    <h1>Quiz #{index + 1}</h1>
                    <div className="buttons">
                      {/* <button onClick={() => props.loadQuiz(realQuestions)}> */}
                      <button onClick={() => handleQuizSelection(myQ.id)}>
                        Load
                      </button>
                      <button onClick={() => deleteQuiz(myQ.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="savedQuizMenu-options-container">
                    {/* <p>Quiz type: {myQ.quiztype}</p> */}
                    <p>Number of Questions: {myQ.size}</p>
                    <p>Creation Date: {myQ.created_at.substring(0, 10)}</p>
                    <p>Has bad questions?</p>
                    <p>Difficulty: ?</p>
                  </div>
                </div>
              ))}
            </div>
          ),
          true: <p>No quizzes</p>,
        }[empty]
      }
    </div>
  );
}
