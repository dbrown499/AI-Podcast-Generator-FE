import React, { useState } from 'react'
import './Styling/App.scss'

const API = import.meta.env.VITE_API_URL;


function App() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Function to validate the transcript
  function isTranscript(text) {
    const hasSpeakerLabels = /(\bSpeaker\s?\d+:|\bPerson\s?\d+:)/i.test(text);
    const hasTimestamps = /\[\d{2}:\d{2}(:\d{2})?\]/.test(text);
    return hasSpeakerLabels || hasTimestamps;
  }

  const handleChange = (e) => {
    setTranscript(e.target.value);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page reload
    setLoading(true)

  try {
    const response = await fetch(`${API}/text-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'text': transcript
    }), // Send transcript as JSON
    })

// console.log('YOOOOOOO', response)
    if (response.ok) {
      const audioBlob = await response.blob(); // Convert response to audio blob
      const url = URL.createObjectURL(audioBlob); // Create audio URL
      setAudioUrl(url); // Save it to state
      console.log("Audio received:", url);

      // const data = await response.json()
      // console.log('Response from backend:', data)
      // alert('Transcript submitted successfully!')
    } else {
      console.error('Error submitting transcript:', response.statusText)
      alert("Failed to generate audio.");
    }
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred while submitting the transcript.')
  } finally {
    setLoading(false)
  }
}

  console.log(isTranscript(transcript))

  return (
    <div className="container">
      <h1 className="title">AI Podcast Generator</h1>
      <p className="subtitle">Transform your content into shareable podcast episodes</p>

      <div className="options">
        <span className="option">Upload Audio</span>
        <span className="option">Enter Transcript</span>
      </div>

      <div className="input-container">
        <textarea 
        class="input-field"
        type="text" 
        placeholder="Paste your transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}

        // onChange={handleChange}
        />
      </div>

      <button 
      className="button" 
      onClick={handleSubmit} 
      disabled={loading || !isTranscript(transcript)}>{loading ? "Generating..." : "✨ Start Generate"}
      </button>

      {audioUrl && (
            <div className="audio-container">
                <h3>Generated Audio:</h3>
                <audio controls>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        )}
    </div>
  )
}

export default App
