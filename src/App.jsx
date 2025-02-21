import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [language, setLanguage] = useState("es"); // Default: Spanish
  const [listening, setListening] = useState(false);

  // Speech Recognition
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  // Translate Text using MyMemory API
  const translateText = async () => {
    if (!text) {
      alert("Please speak or enter text first!");
      return;
    }
    
    try {
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${text}&langpair=en|${language}`
      );
      setTranslatedText(response.data.responseData.translatedText);
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  // Speak Translated Text
  const speakText = () => {
    if (!translatedText) {
      alert("No translation available to speak!");
      return;
    }
    
    const speech = new SpeechSynthesisUtterance(translatedText);
    speech.lang = language;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="app">
      <h2>🌍 Speech Translation App</h2>
      
      <button className="btn speak-btn" onClick={startListening}>
        {listening ? "🎤 Listening..." : "🎙️ Start Speaking"}
      </button>
      
      <p className="text-box">🗣 Spoken Text: <span>{text || "Waiting for input..."}</span></p>

      <select className="dropdown" onChange={(e) => setLanguage(e.target.value)} value={language}>
        <option value="es">🇪🇸 Spanish</option>
        <option value="fr">🇫🇷 French</option>
        <option value="de">🇩🇪 German</option>
        <option value="hi">🇮🇳 Hindi</option>
        <option value="ta">🇮🇳 Tamil</option>
        <option value="en">english</option>
      </select>

      <button className="btn translate-btn" onClick={translateText}>🔄 Translate</button>
      
      <p className="text-box">🌐 Translated: <span>{translatedText || "Translation will appear here..."}</span></p>

      <button className="btn speak-btn" onClick={speakText}>🔊 Speak Translation</button>
    </div>
  );
};

export default App;
