import React, { useState } from "react";

export default function QuestionContainer(props) {
  const [myquestions, setQuestions] = useState([]);

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
        // setQuestions(json[0].questions);
        // console.log("errorcode: ", json[1]);
        console.log("full resposnse:", json);
        if (json[2] === 201) {
          console.log(Array.isArray(json[1]));
          // json[1].map((x) => console.log(x.question));
          json[1].map((x) =>
            setQuestions((myquestions) => [myquestions, x.question])
          );
        }
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
      {myquestions.length ? (
        myquestions.map((question, index) => (
          <div style={styles.questions} key={index}>
            <h3>{question}</h3>
          </div>
        ))
      ) : (
        <span>Empty - might be just loaded or error in python!</span>
      )}
    </div>
  );
}

const styles = {
  questions: {
    height: "40px",
    // width: "40px",
    fontSize: "26px",
    padding: "0px",
    marginRight: "2.5px",
  },
};
