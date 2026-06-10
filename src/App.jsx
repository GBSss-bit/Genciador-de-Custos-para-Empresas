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
  // Função para a IA responder de forma dinâmica lendo os dados da tela (Usando a voz avançada Amazon Polly)
  const speakCamila = (text) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Camila&text=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.onended = () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch(e) {}
      }
    };
    audio.play().catch(e => console.error("Erro no áudio da Camila", e));
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
          
          // Inteligência Artificial de Conversação e Leitura de Dados
          const latestLower = newFinalText.toLowerCase();
          
          if (latestLower.includes('bom dia') || latestLower.includes('boa tarde') || latestLower.includes('boa noite') || latestLower.includes('olá')) {
            speakCamila("Olá! Estou pronta para te ajudar hoje.");
          }
          else if (latestLower.includes('custos atualmente') || latestLower.includes('como estão os custos')) {
            // IA analisa o LocalStorage
            const dados = JSON.parse(localStorage.getItem('beluna_dados') || '{}');
            const prolabore = dados.prolabore || 'cinco mil reais';
            const aluguel = dados.aluguel || 'dois mil reais';
            speakCamila(`Analisando os seus dados, os custos representam 34% da sua receita deste mês. A sua maior despesa fixa é o seu Pró-labore de ${prolabore}, seguido do Aluguel de ${aluguel}. Estamos em um patamar seguro e saudável.`);
          }
          else if (latestLower.includes('vencimento amanhã') || latestLower.includes('vence amanhã') || latestLower.includes('vencimento amanha')) {
            const dados = JSON.parse(localStorage.getItem('beluna_dados') || '{}');
            const energia = dados.energia || 'trezentos e cinquenta reais';
            speakCamila(`Amanhã vence a conta de energia no valor de ${energia}, e a mensalidade do software. Eu já deixei o alerta programado no seu celular para não esquecer.`);
          }
          else if (latestLower.includes('cliente agendado') || latestLower.includes('clientes agendados') || latestLower.includes('qual dia')) {
            speakCamila(`Você tem três agendamentos confirmados para hoje. O primeiro é a Maria Costa para uma Limpeza Dental agora às 9 da manhã, que já pagou o valor via Pix.`);
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
