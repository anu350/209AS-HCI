import React from "react";
import styles from "./TopBar.module.css";

function random_rgba_pair(opac = 0.3) {
  // opacities are hardcoded. should fix.

  var o = Math.round,
    r = Math.random,
    s = 255;

  var r1 = o(r() * s),
    g1 = o(r() * s),
    b1 = o(r() * s);
  var r2 = 255 - r1,
    g2 = 255 - g1,
    b2 = 255 - b1;
  let color_pair = {
    color1: "rgba(" + r1 + "," + g1 + "," + b1 + ",1)",
    color2_border: "rgba(" + r2 + "," + g2 + "," + b2 + "," + opac + ")",
    color2_bg: "rgba(" + r2 + "," + g2 + "," + b2 + ",0.9)",
    color2_shadow: "rgba(" + r2 + "," + g2 + "," + b2 + ",0.801)",
  };

  return color_pair;
}

export default function TopBar(props) {
  const onclickQuestion = () => {
    // console.log("clicked question button");
    props.togglequestionmode();
  };

  const onclickTheme = () => {
    // TODO: fix color error when adding notes
    const color_pair = random_rgba_pair();
    // console.log("random colors: ", color_pair.color1, " ", color_pair.color2);

    document.getElementsByClassName("leftbar-container")[0].style.borderColor =
      color_pair.color2_border;
    document.getElementsByClassName(
      "searchbar-container"
    )[0].style.backgroundColor = color_pair.color2_border;

    document.getElementsByClassName(
      "TopBar_themeDot__G4gjh"
    )[0].style.backgroundColor = color_pair.color2_bg;
    document.getElementsByClassName(
      "TopBar_themeDot__G4gjh"
    )[0].style.backgroundColor = color_pair.color2_bg;
    document.getElementsByClassName(
      "TopBar_themeDot__G4gjh"
    )[0].style.boxShadow = "-2.5px -2.5px 10px 10px " + color_pair.color2_bg;

    // Following code works but fails to update when new notes get added.

    // Array.from(
    //   document.getElementsByClassName("notebriefscontainer")[0].children
    // ).map((brief) => {
    //   brief.style.backgroundColor = color_pair.color1;
    //   return 0;
    // });
  };

  const onclickSettings = () => {
    // console.log("clicked setting button");
    props.togglesettings();
  };

  return (
    <div className={styles["bigbox"]}>
      <div className={styles["logo"]}>
        <h1>notesmart</h1>
      </div>
      <div className={styles["buttonContainer"]}>
        <button className={styles["button1"]} onClick={onclickQuestion}>
          <h1 className={styles["Q"]}>Q</h1>
        </button>
        <button className={styles["button2"]} onClick={onclickTheme}>
          <span className={styles["themeDot"]}></span>
        </button>
        <button className={styles["button3"]} onClick={onclickSettings}>
          <div className={styles["dots"]}>...</div>
        </button>
      </div>
    </div>
  );
}
