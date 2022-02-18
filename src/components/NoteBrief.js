/**
 * The little card you see on the side.
 * This is just the container - the DB query happens in '/components/NoteList.js'
 */
import React from "react";
import { supabase } from "../lib/supabaseClient";
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import { Spring } from "react-spring";
import { useSpring, animated } from 'react-spring';

const getDate = (raw_timestamp) => {
  // console.log(raw_timestamp);                        // raw format: 2022-02-01T10:03:04+00:00
  let date = new Date(raw_timestamp.replace(" ", "T"));
  return date.toDateString().substring(0, 10);
};



export default function NoteBrief(props) {
  const prop2 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } , delay: 1000, duration: 1000});
  const deleteNote = async () => {
    try {
      await supabase.from("notes").delete().match({ id: props.note.id });
      // console.log("deleted note with id", props.note.id);
      props.reloadfunc(); // reloads parent
    } catch (error) {
      console.log("error deleting", error);
    }
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
    <animated.div style={prop2}>
              <div style={styles.notebriefContainer}>
              <button className ="fa fa-trash" style={styles.deleteButton} onClick={deleteNote} onMouseEnter={buttonHover} onMouseLeave={stopButtonHover}>
              </button>

              <div style={styles.flexBriefHeader}>
                <div>
                  {props.note.title ? (
                    <h3>{props.note.title}</h3>
                  ) : (
                    <h3>Untitled Note</h3> // should be unnecessary now that DB never saves untitled file.
                  )}
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <p>{getDate(props.note.created_at)}</p>
                </div>
              </div>

              <hr />
              {props.note.note ? <p> {props.note.note}</p> : <p></p>}
            </div>
       
    </animated.div>
      
  );
}

const styles = {

  deleteButton: {
    height: "30px",
    width: "30px",
    fontSize: "26px",
    padding: "0px",
    position: "relative",
    marginTop:"-10px",
    //marginRight: "2.5px",
    borderRadius: "8px",
    backgroundColor: "white", 
    color: "black", 
    border: "1px solid #abc6fd",
    cursor: "pointer", 
  },
  fa: {
    fontSize: "5px",
  },
  notebriefContainer: {
    padding: 20,
    // minWidth: "20%",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "blue",
    height: "120px",
  },
  flexBriefHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "45px",
    // width: "100px",
  },
};
