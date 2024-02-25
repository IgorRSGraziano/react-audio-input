import React from "react";
import "./App.css";
import AudioRecorder from "./components/audioRecorder";

function App() {
	return <AudioRecorder onChange={console.log} />;
}

export default App;
