import React from "react";

export default function QuestionContainer(props) {
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
        title: "ATITLE",
        content: "SOMECONTENT",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
      });
  };

  return (
    <div>
      <h2>questioncontainer</h2>
      <p>Should be able to access noteid: {props.noteId} - DONE</p>
      <p>Now do a post request to python with note object</p>
      <button onClick={getTest}>CLICK ME 4 REQUEST</button>
      <button onClick={postTest}>CLICK ME 2 POST SOMETHING</button>
    </div>
  );
}
