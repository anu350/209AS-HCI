// Purpose: checks if method has been implemented yet
// relatively unnecessary but serves to have a placeholder for future components

import React from "react";
import NoteBrief from "./components/NoteBrief";

const Components = {
  //   foo: NoteBrief,
  //   bar: Bar,
  NoteBrief: NoteBrief,
};

export default (block) => {
  if (typeof Components[block.component] !== "undefined") {
    return React.createElement(Components[block.component], {
      key: block._uid,
      block: block,
    });
  }
  return React.createElement(
    () => <div>The component {block.component} has not been created yet.</div>,
    { key: block._uid }
  );
};
