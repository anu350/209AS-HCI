// tabs taken from https://www.digitalocean.com/community/tutorials/react-tabs-component

import React, { useState, useEffect } from "react";
import Tabs from "../utility/Tabs";
import "../utility/Tabs.css";
import NewQuizMenu from "./NewQuizMenu";
import SavedQuizMenu from "./SavedQuizMenu";
// import QuizContainer from "./QuizContainer";
import QuizContainer2 from "./QuizContainer_copy";

export default function QuizMenu(props) {
  const [activeQuiz, setActiveQuiz] = useState({});
  const [activeQuizId, setActiveQuizId] = useState("");

  useEffect(() => {
    console.log("changed active quiz: ", activeQuiz);
  }, [activeQuiz]);

  const loadQuiz = (quizid, quiz) => {
    console.log("in set quiz: quiz: ", quiz, "quizid: ", quizid);

    // ERROR HAPPENS HERE WHEN CALLED FROM SavedQuizMenus.js -- new DB caused breaking changes.
    setActiveQuiz(quiz);
    setActiveQuizId(quizid);
  };

  return (
    <div>
      <h1 style={styles.header}>{props.fullnote.title}</h1>
      <div style={styles.container}>
        <Tabs activeTab="New Quiz">
          <div label="New Quiz">
            <NewQuizMenu
              noteId={props.noteId}
              fullnote={props.fullnote}
              loadQuiz={loadQuiz}
            />
          </div>
          <div label="Saved Quizzes">
            <SavedQuizMenu noteId={props.noteId} loadQuiz={loadQuiz} />
          </div>
          {/* TODO: Current quiz tab should dynamically appear only when a quiz is started */}
          {/* OR - dynamic name + class on title (quiz/no quiz loaded) */}
          <div label="Current Quiz">
            <QuizContainer2
              quiz={activeQuiz}
              quizid={activeQuizId}
              // date={"adate"}
              numq={activeQuiz.length}
            // type="mc"
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// add flex grow to container to fill bottom of screen -- also overflowY in case questions is long
const styles = {
  header: {
    textAlign: "center",
  },
  container: {
    height: "60vh",
  },
};
