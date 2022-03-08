// missing:
// - checks new questions if version is the same (aka word count has not changed since previous quiz)
// - retrieve passages for explanations/hints

import React, { useState, useEffect } from "react";
import "./NewQuizMenu.css";
import { supabase } from "../../lib/supabaseClient";

export default function NewQuizMenu(props) {
  const [loading, setLoading] = useState(false);
  const [myquestions, setQuestions] = useState([]);

  const [params_MC, setParams_MC] = useState({ q_num: 5, seed: "" });
  // const [params_text, setParams_text] = useState({ q_num: 5, seed: "" });

  useEffect(() => {
    if (myquestions.length > 0) {
      // if (!loading) {
      console.log("setting my questions");
      saveQuiz(myquestions).then((quizid) => {
        saveQuestions(quizid, myquestions);
        props.loadQuiz(quizid, myquestions);
      });
    }
  }, [myquestions]);

  const saveQuiz = async (quiz2save) => {
    // check difference between last note version and current note version
    // is large ( via word count)

    const creation_time = new Date().toISOString();
    let { data, error } = await supabase.from("quizzes").insert({
      created_at: creation_time,
      related_note: props.noteId,
      size: quiz2save.length,
      // related_note_last_edit_time: creation_time, // TODO MISSING
    });

    if (error) {
      console.log("error in saveQuiz ", error);
    }
    // console.log("inside savequiz, data.id: ", data.id);
    // console.log("inside savequiz, data: ", data[0].id);

    return data[0].id;
  };

  const saveQuestions = async (id, questions) => {
    console.log("saveQuestions");
    console.log("id:", id);
    console.log("questions: ", questions);
    let { data, error } = await supabase.from("questions").insert(
      questions.map(function (q, idx) {
        return {
          question: q.question,
          answers: q.answers,
          idx: idx,
          badquestion: false,
          related_quiz: id,
        };
      })
    );
    if (error) {
      console.log("error in saveQuestions ", error);
    }
  };

  const generateQuestions = async (e, type) => {
    // console.log("in questiongeneration");

    setLoading(true);
    fetch("http://localhost:5000/notes/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: props.fullnote.title,
        raw_json: props.fullnote.raw_json,
        num_questions: params_MC.q_num,
        // num_questions: type === "MC" ? params_MC.q_num : params_text.q_num,
        // type: type,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        // console.log("full resposnse:", json);
        if (json[2] === 201) {
          let transit_questions = json[1].map((q) => ({
            question: q.question,
            answers: q.answer,
          }));
          // console.log("transit questions: ", transit_questions);
          setQuestions(transit_questions);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error occured while onGenerate:", error);
        setLoading(false);
      });
  };

  const parameterChangeHandler = (event) => {
    if (event.target.className === "MC-q-number") {
      setParams_MC({ q_num: event.target.value });
    }
    if (event.target.className === "MC-q-seed") {
      setParams_MC({ seed: event.target.value });
    }
    // if (event.target.className === "text-q-number") {
    //   setParams_text({ q_num: event.target.value });
    // }
    // if (event.target.className === "text-q-seed") {
    //   setParams_text({ seed: event.target.value });
    // }
  };

  return (
    <div className="newQuizMenu-container">
      {loading ? <p>Loading...</p> : null}
      <button onClick={() => saveQuiz().then((value) => console.log(value))}>
        log current note
      </button>
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
              placeholder="seed (disabled)"
            />
          </span>
        </div>
      </div>
      {/* <div className="newQuizMenu-subcontainer">
        <div>
          <h1>Text entry (disabled)</h1>
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
              placeholder="seed (disabled)"
            />
          </span>
        </div>
      </div> */}
    </div>
  );
}
