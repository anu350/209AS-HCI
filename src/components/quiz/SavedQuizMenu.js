// missing: calling quiz start + shift to current quiz

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./SavedQuizMenu.css";

export default function SavedQuizMenu(props) {
  const [quizzes, setQuizzes] = useState([]);
  const [empty, setEmpty] = useState(true);
  // const [selectedQuiz, setSelectedQuiz] = useState({});

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

  const fetchSingleQuiz = async (id) => {
    console.log("a");
    // setSelectedQuiz();
    return;
  };

  const handleSelection = (quizId) => {
    console.log("inhandleselection: ", quizId);
    // await fetchSingleQuiz(quizId);
    // props.startQuiz(selectedQuiz);
  };

  const fetchQuizzes = async (my_id) => {
    const { data, error } = await supabase
      .from("quizzes")
      .select(
        `
        id, 
        created_at, 
        type, 
        index, 
        size,
        notes:related_note (title)
      `
      )
      .eq("related_note", props.noteId)
      .order("index", { ascending: true });
    if (error) console.log("error fetching questions", error);
    else {
      console.log(data);
      if (data.length) {
        // console.log("fetched questions:", qs);
        setQuizzes(data);
      }
    }
    // console.log("fetchQuestions() -- ", myquestions);
  };

  return (
    <div className="savedQuizMenu-container">
      {/* <button onClick={fetchQuizzes}>fetchquestions</button> */}
      {
        {
          false: (
            <div>
              {quizzes.map((myQ, index) => (
                // <div key={index}>
                // <p>{myQ.type}</p>
                // </div>
                <div key={index} className="savedQuizMenu-subcontainer">
                  <div className="savedQuizMenu-title-container">
                    <h1>Quiz #{myQ.index + 1}</h1>
                    <div className="buttons">
                      <button onClick={() => handleSelection(myQ.id)}>
                        Start
                      </button>
                      <button>Delete</button>
                    </div>
                  </div>
                  <div className="savedQuizMenu-options-container">
                    <p>quiz type: {myQ.type}</p>
                    <p># questions: {myQ.size}</p>
                    <p>Creation Date: {myQ.created_at}</p>
                    <p>difficulty: ?</p>
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
