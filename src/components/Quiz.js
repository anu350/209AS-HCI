import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Question from "./Question";
import "../../node_modules/font-awesome/css/font-awesome.min.css"; 
import QuizContainer from "./QuizContainer";

export default function Quiz(props) {
    const [myquestions, setQuestions] = useState([]);
    const [empty, setEmpty] = useState(true);
    const [loading, setLoading] = useState(false);
    const [quizMode, setQuizMode] = useState(false);

     
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

  //SAVE QUESTIONS TO SUPABASE
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

  //GENERATE QUESTION
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
  

    const onclickQuiz = () => {
        //generate questions and save to supabase
        console.log("Initiating Quiz Mode");
        //onGenerate();
        //saveQuestions();
        setQuizMode(!quizMode);
      };
   
    const closeQuiz = () => {
      //generate questions and save to supabase
      console.log("Quitting Quiz Mode");
      setQuizMode(!quizMode);
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
    <div style = {styles.qcontainer}>
        {/* if button toggled, display quiz*/}
        {quizMode ? (
          <div> 
             <button style={styles.quizButton} onClick={closeQuiz} onMouseEnter={buttonHover} onMouseLeave={stopButtonHover}>
               Close Quiz
            </button> 
            <div><br></br></div>
            <QuizContainer
              //PASS IN QUESTIONS/ANSWERS TO QUIZ CONTAINER IN CORRECT FORMAT
            />
          </div>
        ):(
            <div>
                <button style={styles.quizButton} onClick={onclickQuiz} onMouseEnter={buttonHover} onMouseLeave={stopButtonHover}>
                    Take Quiz
                </button>
                {/* <div style = {styles.resultsContainer}>
                    RESULTS:
                </div> */}
            </div>
         )}
    </div>
  );
}

const styles = {
  qcontainer: {
    flex: "1 1 0",
    position: "relative",
    top: "60px",
    flexMode: "column",
  },

  resultsContainer: {
    border: "solid white 5px",
    width: "80%",
    height:"350px",
    position: "relative",
    left: "10%",
    marginTop:"20px",
    alignContent: "center",
  },

  quizContainer: {
    border: "solid black 1px",
    backgroundColor: "#d9e3f3",
    width: "50%",
    height:"400px",
    position: "relative",
    left: "25%",
    //marginTop:"20px",
    borderRadius: "20px",
  },

  quizButton: {
    height: "50px",
    width: "20%",
    fontSize: "15px",
    padding: "0px",
    position: "relative",
    borderRadius: "8px",
    backgroundColor: "white", 
    color: "black", 
    border: "1px solid #abc6fd",
    cursor: "pointer",
    left: "40%", 
  },
  closeButton: {
    height: "40px",
    width: "10%",
    fontSize: "15px",
    padding: "10px",
    position: "relative",
    left: "75%",
    borderRadius: "20px",
    backgroundColor: "white", 
    color: "black", 
    border: "1px solid #abc6fd",
    cursor: "pointer", 
    bottomMargin:"10px",
  },

  nextButton: {
    height: "50px",
    width: "10%",
    fontSize: "15px",
    padding: "0px",
    position: "relative",
    left: "75%",
    top: "80%",
    borderRadius: "8px",
    backgroundColor: "white", 
    color: "black", 
    border: "1px solid #abc6fd",
    cursor: "pointer", 
  }
};
