import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Question from "../quiz/Question";

export default function QuestionContainer(props) {
  const [myquestions, setQuestions] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("props.id:", props.noteId);
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
        // console.log("fetched questions:", qs);
        // qs.map((aq) => console.log(aq.question));
        qs.map((aq) =>
          setQuestions((myquestions) => [...myquestions, aq.question])
        );
      }
    }
    // console.log("fetchQuestions() -- ", myquestions);
  };

  const checkSavedQuestions = async () => {
    let data;
    try {
      data = await supabase
        .from("questions")
        .select("question")
        .eq("related_note", props.noteId)
        .then((value) =>
          value.data.map((item) => {
            return item["question"];
          })
        );
    } catch (err) {
      console.log(err);
    }
    // console.log("checksavedq_ data:", data);
    return data;
  };

  // check content hasn't been uploaded yet before saving
  const saveQuestions = async () => {
    const creation_time = new Date().toISOString();

    // 1. query questions by matching related_note
    let prevSavedQs = await checkSavedQuestions();
    console.log(prevSavedQs);
    let idx_offset = prevSavedQs.length;
    // 2. find how many of our currently generated notes are already in the returned array
    let newQuestions = myquestions.filter((x) => !prevSavedQs.includes(x));
    console.log("in saveQuestions/ newQuestions:", newQuestions);
    // 3. if any new --> post + display saved # notes
    if (newQuestions.length > 0) {
      let { error } = await supabase.from("questions").insert(
        newQuestions.map((q, idx) => ({
          created_at: creation_time,
          related_note: props.noteId,
          question: q,
          answer: "",
          index: idx + idx_offset,
        }))
      );
      if (error) console.log("error when saving new questions");
      console.log("saved ", newQuestions.length, " new questions!");
    } else {
      // 4. else display notes already saved
      console.log("no new questions to be saved");
    }
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
          let transit_questions = json[1].map((q) => q.question);
          // checkIf New Questions
          let newQuestions = transit_questions.filter(
            (x) => !myquestions.includes(x)
          );
          if (newQuestions.length > 0) {
            newQuestions.map((aquestion) =>
              setQuestions((myquestions) => [...myquestions, aquestion])
            );
            // await saveQuestions();
          } else {
            console.log("no new questions");
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("error occured while onGenerate:", error);
        setLoading(false);
      });
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
