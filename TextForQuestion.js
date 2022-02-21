// 1. how to make it ReadOnly: https://stackoverflow.com/questions/37010687/how-can-i-make-custom-rendered-block-readonly-in-draft-js-editor-when-its-readon
// 2. how to highlight text: https://dev.to/rose/draft-js-introduction-custom-styles-highlighted-text-and-have-formatting-buttons-show-whether-they-are-on-or-off-4f9p

import React, { Component } from "react";

export default class TextForQuestion extends Component {
  render() {
    return (
      <div>
        <p>textbox for question interface</p>
        <p>
          should be able to access note.id. or even better get actual note
          object
        </p>
      </div>
    );
  }
}
