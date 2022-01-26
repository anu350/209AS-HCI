import "./App.css";
// import RichTextEditor from "./components/RichNote";
import MinimalTextEditor from "./components/MinimalNote";

function App() {
  return (
    <div className="App">
      <h1>barebones text entry</h1>
      {/* <RichTextEditor /> */}
      <MinimalTextEditor />
    </div>
  );
}

export default App;
