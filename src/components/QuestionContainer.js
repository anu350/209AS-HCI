import React, { useState } from "react";

export default function QuestionContainer(props) {
  const [questions, setQuestions] = useState([]);

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

  const postTest = () => {
    fetch("http://localhost:5000/notes/", {
      method: "POST",
      //   headers: { CORS: "Access-Control-Allow-Origin" },
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        raw_json: props.fullnote,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setQuestions(json[0].questions);
        // console.log("errorcode: ", json[1]);
        // console.log(json[0].questions);
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
      <h2>questioncontainer</h2>
      <button onClick={getTest}>CLICK ME 4 REQUEST</button>
      <button onClick={postTest}>CLICK ME 2 ASK U SOMETHING</button>
      {questions.length ? (
        questions.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
          </div>
        ))
      ) : (
        <span>Empty - might be just loaded or error in python!</span>
      )}
    </div>
  );
}
