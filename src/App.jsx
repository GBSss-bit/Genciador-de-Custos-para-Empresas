import React, { useState, useEffect } from 'react'
import { Mic, Square } from 'lucide-react'
import Dashboard from './Dashboard'
import Onboarding from './Onboarding'
import Sidebar from './Sidebar'
import Agendamentos from './Agendamentos'
import Transacoes from './Transacoes'
import './App.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary capturou um erro:", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: '#111', minHeight: '100vh' }}>
          <h2>Ops! O aplicativo encontrou um erro.</h2>
          <p>Por favor, tire um print desta tela e envie:</p>
          <pre style={{ background: '#222', padding: '1rem', overflow: 'auto' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.info && this.state.info.componentStack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px' }}>Recarregar Aplicativo</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  // Lê do navegador se o usuário já finalizou o onboarding antes
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('beluna_onboarded') === 'true';
  })
  
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptPreview, setTranscriptPreview] = useState('')
  const recognitionRef = React.useRef(null)

  // Carrega as vozes antecipadamente para o Chrome não devolver array vazio
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);
  
  // Função para a Beluna falar com o usuário
  const speakBeluna = (text) => {
    // Pausa o microfone para ela não escutar a própria voz
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Truque Mágico: Usa a voz Neural da Amazon Polly (Voz: Camila ou Vitoria), que é absurdamente humana!
    // Acessado através da API pública do StreamElements.
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Camila&text=${encodeURIComponent(text)}`;
    const audio = new Audio(url);

    audio.onended = () => {
      // Quando ela terminar de falar, o microfone volta a ouvir automaticamente
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch(e) {} // Ignora se já estiver iniciado
      }
    };

    audio.play().catch(e => {
      console.error("Erro ao tocar áudio neural. Tentando a voz do navegador como backup.", e);
      // Plano B: Se a API falhar, cai pra voz do navegador
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.15;
      synth.cancel();
      
      utterance.onend = audio.onended;
      synth.speak(utterance);
    });
  };

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
          
          // Inteligência Artificial de Conversação
          const latestLower = newFinalText.toLowerCase();
          if (latestLower.includes('bom dia') || latestLower.includes('boa tarde') || latestLower.includes('boa noite') || latestLower.includes('olá')) {
            speakBeluna("Olá! Estou pronta para te ajudar hoje.");
          }
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default App
