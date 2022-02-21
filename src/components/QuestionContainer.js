import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Question from "./Question";

export default function QuestionContainer(props) {
  const [myquestions, setQuestions] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("props.id:", props.noteId);
    fetchQuestions(props.noteId);
  }, []);

  useEffect(() => {
    if (myquestions.length) {
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  }, [myquestions]);

  const onClear = async () => {
    if (empty) {
      return;
    }
    setQuestions([]);
    let { data, error } = await supabase
      .from("questions")
      .delete()
      .match({ related_note: props.noteId });
    if (error) console.log("error deleting questions", error);
    setEmpty(true);
    return;
  };

  const fetchQuestions = async (my_id) => {
    const { data: qs, error } = await supabase
      .from("questions")
      .select("question")
      .eq("related_note", my_id);
    if (error) console.log("error fetching questions", error);
    else {
      if (qs.length) {
        console.log("fetched questions:", qs);
        // qs.map((aq) => console.log(aq.question));
        qs.map((aq) =>
          setQuestions((myquestions) => [...myquestions, aq.question])
        );
      }
    }
    console.log("myquestions: ", myquestions);
  };

  const saveQuestions = async () => {
    const creation_time = new Date().toISOString();
    const { data, error } = await supabase.from("questions").insert(
      myquestions.map((q, idx) => ({
        created_at: creation_time,
        related_note: props.noteId,
        question: q,
        answer: "",
        index: idx,
      }))
    );

    // let data2post =
    console.log(
      myquestions.map((q, idx) => ({
        created_at: creation_time,
        related_note: props.noteId,
        question: q,
        answer: "",
        index: idx,
      }))
    );
  };

  const getTest = () => {
    fetch("http://localhost:5000/notes", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
      });
  };

  const onGenerate = () => {
    setLoading(true);
    fetch("http://localhost:5000/notes/", {
      method: "POST",
      // headers: { CORS: "Access-Control-Allow-Origin" },
      headers: {
        // CORS: "Access-Control-Allow-Origin",
        "content-type": "application/json",
        // accepts: "application/json",
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
          console.log(Array.isArray(json[1]));
          json[1].map(
            (x) => setQuestions((myquestions) => [...myquestions, x.question]) // error ---------------
          );
        }
        setLoading(false);
      });
    // ------------------
    // NOTE:
    // can use this function as the generate button
    // make an async call to python
    // python returns an array
    // array holds questions
    // if non empty, post to supabase DB
  };

  return (
    <div>
      <h2>Questions</h2>
      <button onClick={onGenerate}>Generate</button>
      <button onClick={onClear}>Clear</button>
      <button onClick={saveQuestions}>Save</button>
      <div>
        {
          {
            false: (
              <div>
                {myquestions.map((myQ, index) => (
                  <div
                    style={styles.questions}
                    key={index}
                    // noteId={props.noteId}
                  >
                    <Question question={myQ} />
                  </div>
                ))}
              </div>
            ),
            true: <div>{loading ? <p>Loading</p> : <p>No questions</p>} </div>,
          }[empty]
        }
      </div>
    </div>
  );
}

const styles = {
  questions: {
    fontSize: "20px",
    paddingTop: "10px",
    marginRight: "2.5px",
  },
};
