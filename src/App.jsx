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
      <button 
        className={`fab-mic ${isRecording ? 'recording' : ''}`}
        onClick={() => setIsRecording(!isRecording)}
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
