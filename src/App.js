import "./App.css";
// import RichTextEditor from "./components/RichNote";
import MinimalTextEditor from "./components/MinimalNote";
//import SideNav from "./components/SideNav";


function App() {
  return (
    <div className="App">
      {/*<SideNav />*/}

      <h1>Text Entry</h1>
        {/* <RichTextEditor /> */}
      <MinimalTextEditor />
      
    </div>
  );
}

export default App;
