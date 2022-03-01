// tabs taken from https://www.digitalocean.com/community/tutorials/react-tabs-component

import React, { useState } from "react";
import Tabs from "../utility/Tabs";
import "../utility/Tabs.css";
import NewQuizMenu from "./NewQuizMenu";
import SavedQuizMenu from "./SavedQuizMenu";
import QuizContainer from "./QuizContainer";
import QuizContainer2 from "./QuizContainer_copy";

export default function QuizMenu(props) {
  const [activeQuiz, setActiveQuiz] = useState(false);

  const startQuiz = (questions) => {
    console.log("in parent startquiz");
    // set activeTab = "Current QUiz"
    // or... dynamically add the "Current Quiz" div to <Tabs /> + set it active
  };

  return (
    <div>
      <h1 style={styles.header}>{props.fullnote.title}</h1>
      <div style={styles.container}>
        <Tabs activeTab="New Quiz">
          <div label="New Quiz">
            <NewQuizMenu fullnote={props.fullnote} startQuiz={startQuiz} />
          </div>
          <div label="Saved Quizzes">
            <SavedQuizMenu noteId={props.noteId} startQuiz={startQuiz} />
          </div>
          {/* TODO: Current quiz tab should dynamically appear only when a quiz is started */}
          <div label="Current Quiz">
            {/* <QuizContainer /> */}
            <QuizContainer2 />
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
