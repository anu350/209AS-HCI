// this menu allows the user to select parameters to generate questions for a quiz
// has direct connection with python
// on creation of the quiz, it saves it to the database (missing)
// then calls quiz start (missing)

import React, { useState, useEffect } from "react";
import "./NewQuizMenu.css";

export default function NewQuizMenu(props) {
  const [loading, setLoading] = useState(false);
  const [myquestions, setQuestions] = useState([]);

  const [params_MC, setParams_MC] = useState({ q_num: 5, seed: "" });
  const [params_text, setParams_text] = useState({ q_num: 5, seed: "" });

  useEffect(() => {
    if (myquestions.length > 0) {
      if (!loading) {
        props.startQuiz(myquestions);
      }
      // TODO: call save questions here
    }
  }, [myquestions]);

  // currently capable of handling MC OR text entry. will need to change if other types of quizzes are done
  const generateQuestions = async (e, type) => {
    console.log("in questiongeneration");
    setQuestions([1, 2]);

    setLoading(true);
    fetch("http://localhost:5000/notes/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: props.fullnote.title,
        raw_json: props.fullnote.raw_json,
        num_questions: type === "MC" ? params_MC.q_num : params_text.q_num,
        seed: type === "MC" ? params_MC.seed : params_text.seed,
        type: type,
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
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error occured while onGenerate:", error);
        setLoading(false);
      });

    // once it finishes, it will populate myQuestions.
    // make sure ^^ above reacts to myQuestions changed.
  };

  const parameterChangeHandler = (event) => {
    if (event.target.className === "MC-q-number") {
      setParams_MC({ q_num: event.target.value });
    }
    if (event.target.className === "MC-q-seed") {
      setParams_MC({ seed: event.target.value });
    }
    if (event.target.className === "text-q-number") {
      setParams_text({ q_num: event.target.value });
    }
    if (event.target.className === "text-q-seed") {
      setParams_text({ seed: event.target.value });
    }
  };

  return (
    <div className="newQuizMenu-container">
      {loading ? <p>Loading</p> : null}
      {/* <button onClick={logNote}>log current note</button> */}
      <div className="newQuizMenu-subcontainer">
        <div>
          <h1>Multiple choice</h1>
          <button onClick={(e) => generateQuestions(e, "MC")}>Generate</button>
        </div>

        <div className="newQuizMenu-options-container">
          <span>
            <p>number of questions</p>
            <input
              className="MC-q-number"
              onChange={parameterChangeHandler}
              placeholder="5"
            />
          </span>
          <span>
            <p>seed</p>
            <input
              className="MC-q-seed"
              onChange={parameterChangeHandler}
              placeholder="seed"
            />
          </span>
        </div>
      </div>
      <div className="newQuizMenu-subcontainer">
        <div>
          <h1>Text entry</h1>
          <button>Generate</button>
        </div>
        <div className="newQuizMenu-options-container">
          <span>
            <p>number of questions</p>
            <input
              className="text-q-number"
              onChange={parameterChangeHandler}
              placeholder="5"
            />
          </span>
          <span>
            <p>seed</p>
            <input
              className="text-q-seed"
              onChange={parameterChangeHandler}
              placeholder="seed"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
