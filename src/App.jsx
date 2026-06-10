import React, { useState } from 'react'
import { Mic, Square } from 'lucide-react'
import Dashboard from './Dashboard'
import Onboarding from './Onboarding'
import Sidebar from './Sidebar'
import Agendamentos from './Agendamentos'
import Transacoes from './Transacoes'
import './App.css'

function App() {
  // Lê do navegador se o usuário já finalizou o onboarding antes
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('beluna_onboarded') === 'true';
  })
  
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptPreview, setTranscriptPreview] = useState('')
  const recognitionRef = React.useRef(null)

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setTranscriptPreview('');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true; // Mantém o microfone ligado direto!
    recognition.interimResults = false;

    let fullTranscript = ''; // Acumulador de tudo que foi falado enquanto o mic tá ligado

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let newFinalText = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newFinalText += event.results[i][0].transcript + ' ';
          fullTranscript += event.results[i][0].transcript + ' ';
        }
      }
      
      setTranscriptPreview(fullTranscript);

      const activeEl = document.activeElement;
      
      // Se tiver clicado num campo, vai digitando aos poucos conforme a pessoa fala
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        if (newFinalText.trim() !== '') {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          const newValue = activeEl.value ? activeEl.value + ' ' + newFinalText.trim() : newFinalText.trim();
          nativeInputValueSetter.call(activeEl, newValue);
          
          const inputEvent = new Event('input', { bubbles: true });
          activeEl.dispatchEvent(inputEvent);
        }
      } else {
        // Envia tanto a frase acumulada quanto a última palavra isolada para evitar bugs de navegação
        if (fullTranscript.trim() !== '') {
          const smartEvent = new CustomEvent('smartSpeech', { 
            detail: { full: fullTranscript, latest: newFinalText } 
          });
          window.dispatchEvent(smartEvent);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Erro na gravação:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setTimeout(() => setTranscriptPreview(''), 4000);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    // Salva na memória do navegador para não pedir novamente
    localStorage.setItem('beluna_onboarded', 'true');
  }

  const handleReset = () => {
    localStorage.removeItem('beluna_onboarded');
    setIsOnboarded(false);
    setActiveTab('Dashboard');
  }

  return (
    <div className={`app-container ${!isOnboarded ? 'onboarding-mode' : ''}`}>
      {transcriptPreview && (
        <div className="transcript-preview">
          "{transcriptPreview}"
        </div>
      )}
      <button 
        className={`fab-mic ${isRecording ? 'recording' : ''}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={toggleRecording}
        title="Falar com a Beluna"
      >
        {isRecording ? <Square size={28} /> : <Mic size={28} />}
      </button>

      {!isOnboarded ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onReset={handleReset} />
          <main className="main-content">
            {activeTab === 'Dashboard' && <Dashboard />}
            {activeTab === 'Agendamentos' && <Agendamentos />}
            {activeTab === 'Receitas' && <Transacoes tipo="RECEITA" />}
            {activeTab === 'Despesas' && <Transacoes tipo="DESPESA" />}
            {activeTab !== 'Dashboard' && activeTab !== 'Agendamentos' && activeTab !== 'Receitas' && activeTab !== 'Despesas' && (
              <div className="placeholder-screen">
                <h2>{activeTab}</h2>
                <p>Esta tela será construída em breve.</p>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App
