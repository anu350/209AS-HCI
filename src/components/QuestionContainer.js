import React, { useState } from "react";
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 

export default function QuestionContainer(props) {
  const [myquestions, setQuestions] = useState([]);

  const getTest = () => {
    fetch("http://localhost:5000/notes/", {
      method: "GET",
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       },

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

  const buttonHover = (event) => {
    event.target.style.backgroundColor = "#abc6fd";
    event.target.style.transitionDuration = "0.2s";
    // event.target.style.backgroundColor = "#ebebeb";
  };

  const stopButtonHover = (event) => {
    event.target.style.backgroundColor = "";
    // event.target.style.backgroundColor = "";
  };

  return (
    <div>
      <h2>Question Container</h2>
      <button style={styles.questionButton} onClick={getTest} onMouseEnter={buttonHover} onMouseLeave={stopButtonHover}>
        Request Question
      </button>
      <button style={styles.questionButton} onClick={postTest} onMouseEnter={buttonHover} onMouseLeave={stopButtonHover}>     
        Generate Question
      </button><br></br>
      {myquestions.length ? (
        myquestions.map((question, index) => (
          <div style={styles.questions} key={index} className="question">
            <h3>{index+1}) {question}</h3>
          </div>
        ))
      ) : (
        <span>Empty - might be just loading or error in python!</span> //include loading icon until q generated
      )}

    </div>
  );
}

const styles = {
  questions: {
    height: "40px",
    // width: "40px",
    fontSize: "15px",
    padding: "0px",
    marginRight: "2.5px",
  },

  questionButton: {
    fontFamily: "Arial,Helvetica,sans-serif",
    fontSize: "15px",
    height: "35px",
    width: "30%",
    padding: "0px",
    marginLeft: "20px",
    marginRight: "20px",
    borderRadius: "8px",
    backgroundColor: "white", 
    color: "black", 
    border: "1px solid #abc6fd",
    cursor: "pointer", 
  },

};
