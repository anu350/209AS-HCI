import React from "react";
import styles from "./TopBar.module.css";

export default function TopBar(props) {
  const onclickQuestion = () => {
    console.log("clicked question button");
    props.functionfromabove();
  };

  const onclickTheme = () => {
    console.log("clicked theme button");
  };

  const onclickSettings = () => {
    console.log("clicked setting bustton");
  };

  return (
    <div className={styles["bigbox"]}>
      {/* <p>topbar</p> */}
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
