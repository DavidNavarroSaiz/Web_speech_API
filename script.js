let recognition;
let finalResult = '';

function startRecognition() {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.getElementById('languageSelect').value;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function(event) {
      let result = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalResult += event.results[i][0].transcript;
        } else {
          result += event.results[i][0].transcript + ' ';
        }
      }
      document.getElementById('result').textContent = finalResult + result;
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function() {
      console.log('Speech recognition ended.');
    };

    recognition.start();
  } else {
    console.error('Speech recognition is not supported in this browser.');
  }
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    console.log('Speech recognition stopped.');
  }
}

function clearResult() {
  finalResult = '';
  document.getElementById('result').textContent = '';
}

// Text-to-Speech function
function speakText(text) {
  const speechSynthesis = window.speechSynthesis;

  // Check if speech synthesis is supported
  if ('speechSynthesis' in window && speechSynthesis) {
    // Cancel any previous speech synthesis in progress
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const voices_test = speechSynthesis.getVoices();

    voices_test.forEach((voice, index) => {
      console.log(`Voice ${index + 1}:`);
      console.log('Name:', voice.name);
      console.log('Language:', voice.lang);
      console.log('URI:', voice.voiceURI);
      console.log('Default voice:', voice.default);
      console.log('---');
    });
    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = document.getElementById('languageSelect').value;
    voices = speechSynthesis.getVoices();
    utterance.rate = 1;  // Faster speech rate
    utterance.pitch = 1.2; // Higher pitch
    utterance.volume = 1; // Adjusted volume
    // Find the desired voice or fallback to a default voice
    const desiredVoice = voices.find(voice => voice.lang === utterance.lang) || voices.find(voice => voice.default);
    utterance.voice = desiredVoice;
    if (utterance.voice) {
      window.speechSynthesis.speak(utterance);
    } 
    else {
      console.error('Desired voice not found.');
    }
  } else {
    console.error('Text-to-speech is not supported in this browser.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const clearButton = document.getElementById('clearButton');
  const languageSelect = document.getElementById('languageSelect');
  const speakButton = document.getElementById('speakButton');
  const textToSpeechInput = document.getElementById('textToSpeech');

  startButton.addEventListener('click', function() {
    startRecognition();
  });

  stopButton.addEventListener('click', function() {
    stopRecognition();
  });

  clearButton.addEventListener('click', function() {
    clearResult();
  });

  languageSelect.addEventListener('change', function() {
    stopRecognition();
  });

  window.speechSynthesis.onvoiceschanged = function() {
    // Enable the speakButton once the voices have been loaded
    speakButton.disabled = false;
  };

  speakButton.addEventListener('click', function() {
    const text = textToSpeechInput.value.trim();
    if (text !== '') {
      speakText(text);
    }
  });
});

