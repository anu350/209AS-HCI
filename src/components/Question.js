import React from "react";
import { supabase } from "../lib/supabaseClient";

export default function Question(props) {
  const deleteQuestion = async () => {
    // try {
    //   await supabase.from("questions").delete().match({ id: props.question.id });
    //   props.reloadfunc();
    // } catch (error) {
    //   console.log("error deleting question: ", error);
    // }
  };

  return (
    <div style={styles.questionContainer}>
      <button onClick={deleteQuestion}>delete</button>
      <div style={styles.flexBriefQuestions}>
        <div>
          <p>{props.question}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  flexBriefQuestions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  questionContainer: {
    marginLeft: "auto",
    border: "solid",
  },
};
