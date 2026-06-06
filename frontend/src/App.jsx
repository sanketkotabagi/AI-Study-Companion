import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [quiz, setQuiz] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const uploadPDF = async () => {
    try {
      if (!file) {
        alert("Please select PDF first");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setUploadedFileName(file.name);

      alert(data.message || "PDF Uploaded Successfully");
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  const askQuestion = async () => {
    try {
      if (!question) {
        alert("Please enter a question");
        return;
      }

      setLastQuestion(question);

      const response = await fetch(
        `http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`
      );

      const data = await response.json();

      setAnswer(data.answer || data.error);
      setQuestion("");
    } catch (error) {
      console.log(error);
      setAnswer("Error getting answer");
    }
  };

  const generateQuiz = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/quiz"
      );

      const data = await response.json();

      setQuiz(data.quiz || "No quiz generated");
    } catch (error) {
      console.log(error);
      alert("Quiz generation failed");
    }
  };

  const generateSummary = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/summary"
      );

      const data = await response.json();

      setSummary(data.summary || "No summary generated");
    } catch (error) {
      console.log(error);
      alert("Summary generation failed");
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setQuestion(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Voice recognition failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };


  const registerUser = () => {
  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  const user = {
    name,
    email,
    password,
  };

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  alert("Registration Successful");

  setIsRegistering(false);
};

const loginUser = () => {
  const savedUser = JSON.parse(
    localStorage.getItem("user")
  );

  if (
    savedUser &&
    savedUser.email === email &&
    savedUser.password === password
  ) {
    setIsLoggedIn(true);
  } else {
    alert("Invalid Credentials");
  }
};

const logoutUser = () => {
  setIsLoggedIn(false);

  setEmail("");
  setPassword("");
};

if (!isLoggedIn) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0F172A,#1E293B)"
      }}
    >
      <div
        style={{
          background: "#0B1120",
          padding: "50px",
          borderRadius:  "25px",
          width: "450px",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div
  style={{
    textAlign: "center",
    marginBottom: "35px"
  }}
>
  <div
    style={{
      fontSize: "60px",
      marginBottom: "10px"
    }}
  >
    🤖
  </div>

  <h1
    style={{
      color: "white",
      margin: "0",
      fontSize: "38px",
      fontWeight: "700",
      lineHeight: "1.2"
    }}
  >
    AI Study
    <br />
    Companion
  </h1>

  <p
    style={{
      color: "#94A3B8",
      marginTop: "12px",
      fontSize: "14px"
    }}
  >
    Learn Smarter with AI
  </p>
</div>

        {isRegistering && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px"
            }}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#1E293B",
            color: "white",
            fontSize: "15px"

          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding:  "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#1E293B",
            color: "white",
            fontSize: "15px"   
          }}
        />

        {isRegistering ? (
          <button
            onClick={registerUser}
            style={{
              width: "100%",
              padding: "12px"
            }}
          >
            Register
          </button>
        ) : (
          <button
            onClick={loginUser}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "#2563EB",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
}}

            
          >
            Login
          </button>
        )}

        <br />
        <br />

        <button
  onClick={() =>
    setIsRegistering(!isRegistering)
  }
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#1E293B",
    color: "white",
    cursor: "pointer"
  }}
>
        
          {isRegistering
            ? "Already have account?"
            : "Create Account"}
        </button>
      </div>
    </div>
  );
}

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #0F172A, #1E293B)",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "280px",
          background: "#111827",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          padding: "20px",
          borderRight: "1px solid gray",
        }}
      >
        <h2>🤖 AI Study Companion</h2>

        <button
  onClick={logoutUser}
  style={{
    width: "100%",
    padding: "10px",
    background: "#DC2626",
    color: "white",
    border: "none",
    borderRadius: "8px"
  }}
>
  Logout
</button>

<br />
<br />

        <hr />

        <h3>Upload Notes</h3>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br />
        <br />

        <button
          onClick={uploadPDF}
          style={{
            padding: "10px",
            width: "100%",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Upload PDF
        </button>

        <br />
        <br />

        <button
          onClick={generateQuiz}
          style={{
            padding: "10px",
            width: "100%",
            background: "#9333EA",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          📝 Generate Quiz
        </button>

        <br />
        <br />

        <button
          onClick={generateSummary}
          style={{
            padding: "10px",
            width: "100%",
            background: "#F59E0B",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          📄 Generate Summary
        </button>

        <br />
        <br />

        <button
          onClick={startListening}
          style={{
            padding: "10px",
            width: "100%",
            background: "#16A34A",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          {isListening
            ? "🎤 Listening..."
            : "🎤 Voice Assistant"}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <h1>AI Chat</h1>

        {uploadedFileName && (
          <div
            style={{
              background: "#065F46",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            📄 Uploaded File: {uploadedFileName}
          </div>
        )}

        {summary && (
          <div
            style={{
              background: "#92400E",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "15px",
            }}
          >
            <h2>Summary</h2>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "white",
              }}
            >
              {summary}
            </pre>
          </div>
        )}

        {quiz && (
          <div
            style={{
              background: "#4C1D95",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "15px",
            }}
          >
            <h2>Quiz Generated</h2>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "white",
              }}
            >
              {quiz}
            </pre>
          </div>
        )}

        <div
          style={{
            background: "#1E293B",
            height: "400px",
            padding: "20px",
            borderRadius: "15px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              background: "#2563EB",
              padding: "15px",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          >
            <b>You:</b>
            <p>{lastQuestion}</p>
          </div>

          <div
            style={{
              background: "#334155",
              padding: "15px",
              borderRadius: "15px",
            }}
          >
            <b>AI:</b>
            <p>{answer}</p>
          </div>
        </div>

        <br />

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask from uploaded notes"
          style={{
            width: "80%",
            padding: "15px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <button
          onClick={askQuestion}
          style={{
            padding: "15px",
            marginLeft: "10px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: "10px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;