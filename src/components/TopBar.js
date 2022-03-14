import React from "react";
import styles from "./TopBar.module.css";

function random_rgba_pair() {
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
    color_border: "rgba(" + r2 + "," + g2 + "," + b2 + ",0.9)",
    color_shadow: "rgba(" + r2 + "," + g2 + "," + b2 + ",0.8)",
    color_light: "rgba(" + r2 + "," + g2 + "," + b2 + ",0.3)",
    color_lighter: "rgba(" + r2 + "," + g2 + "," + b2 + ",0.1)",
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
    let root = document.documentElement;
    root.style.setProperty(
      "--theme-highlights-border-color",
      color_pair.color_border
    );
    root.style.setProperty(
      "--theme-highlights-boxshadow-color",
      color_pair.color_shadow
    );
    root.style.setProperty(
      "--theme-highlights-light-color",
      color_pair.color_light
    );
    root.style.setProperty(
      "--theme-highlights-lighter-color",
      color_pair.color_lighter
    );

    // console.log("random colors: ", color_pair.color1, " ", color_pair.color2);

    // document.getElementsByClassName("leftbar-container")[0].style.borderColor =
    //   color_pair.color2_border;
    // document.getElementsByClassName(
    //   "searchbar-container"
    // )[0].style.backgroundColor = color_pair.color2_border;

    // document.getElementsByClassName(
    //   "TopBar_themeDot__G4gjh"
    // )[0].style.backgroundColor = color_pair.color2_bg;
    // document.getElementsByClassName(
    //   "TopBar_themeDot__G4gjh"
    // )[0].style.backgroundColor = color_pair.color2_bg;
    // document.getElementsByClassName(
    //   "TopBar_themeDot__G4gjh"
    // )[0].style.boxShadow = "-2.5px -2.5px 10px 10px " + color_pair.color2_bg;
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
