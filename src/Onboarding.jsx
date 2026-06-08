import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Building, DollarSign, PieChart } from 'lucide-react';
import './Onboarding.css';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  // Estados para a Etapa 1
  const [empresa, setEmpresa] = useState('');
  const [segmento, setSegmento] = useState('');
  const [cidade, setCidade] = useState('');
  const [colaboradores, setColaboradores] = useState('');
  const [tipoEmpresa, setTipoEmpresa] = useState('MEI');

  useEffect(() => {
    const handleSmartSpeech = (e) => {
      if (step !== 1) return; // A inteligência está ativada apenas na etapa 1 por enquanto
      
      const text = e.detail.toLowerCase();
      
      const extract = (regex) => {
        const match = text.match(regex);
        return match ? match[1].trim() : null;
      };

      // Palavras de parada para delimitar onde o campo termina
      const stops = "segmento|cidade|colaboradores|colaborador|funcionários|funcionário|tipo";
      
      const nEmpresa = extract(new RegExp(`(?:nome da empresa|empresa)\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
      const nSegmento = extract(new RegExp(`segmento\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
      const nCidade = extract(new RegExp(`cidade\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
      const nColab = extract(new RegExp(`(?:colaboradores|colaborador|funcionários|funcionário)\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
      const nTipo = extract(new RegExp(`(?:tipo de empresa|tipo)\\s+(.*)`, 'i'));

      const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

      if (nEmpresa) setEmpresa(capitalize(nEmpresa));
      if (nSegmento) setSegmento(capitalize(nSegmento));
      if (nCidade) setCidade(capitalize(nCidade));
      if (nColab) setColaboradores(nColab.replace(/\D/g, ''));
      
      if (nTipo) {
        if (nTipo.includes('mei')) setTipoEmpresa('MEI');
        else if (nTipo.includes('limitada') || nTipo.includes('ltda')) setTipoEmpresa('LTDA');
        else if (nTipo.includes('individual')) setTipoEmpresa('Empresário Individual (EI)');
      }
    };

    window.addEventListener('smartSpeech', handleSmartSpeech);
    return () => window.removeEventListener('smartSpeech', handleSmartSpeech);
  }, [step]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="onboarding-container">
      <div className="onboarding-glass">
        
        <div className="onboarding-header">
          <h2>Bem-vindo à Beluna</h2>
          <p>Vamos montar o mapa financeiro da sua empresa. Sem planilhas complicadas.</p>
          
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}><Building size={16}/></div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}><DollarSign size={16}/></div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}><PieChart size={16}/></div>
          </div>
        </div>

        <div className="step-content">
          {step === 1 && (
            <div className="fade-in">
              <h3>1. Dados da Empresa</h3>
              <div className="form-group">
                <label>Nome da empresa</label>
                <input type="text" placeholder="Ex: Clínica Sorriso" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Segmento</label>
                <input type="text" placeholder="Ex: Odontologia" value={segmento} onChange={(e) => setSegmento(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input type="text" placeholder="Ex: São Paulo" value={cidade} onChange={(e) => setCidade(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Colaboradores</label>
                  <input type="number" placeholder="Ex: 5" value={colaboradores} onChange={(e) => setColaboradores(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tipo de empresa</label>
                  <select value={tipoEmpresa} onChange={(e) => setTipoEmpresa(e.target.value)}>
                    <option value="MEI">MEI</option>
                    <option value="LTDA">LTDA</option>
                    <option value="Empresário Individual (EI)">Empresário Individual (EI)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h3>2. Custos Fixos (Mensais)</h3>
              <p className="hint">Aqueles que não mudam, independentemente do quanto você vende.</p>
              <div className="grid-inputs">
                <div className="form-group"><label>Aluguel</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Energia</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Água</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Material de limpeza</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Internet / Telefone</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Software / Tráfego</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Contador</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Marketing</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Pró-labore (Salário do Dono)</label><input type="text" placeholder="R$ 0,00" /></div>
                <div className="form-group"><label>Salários da Equipe (Funcionários)</label><input type="text" placeholder="R$ Soma de todos" /></div>
                <div className="form-group"><label>Benefícios da Equipe</label><input type="text" placeholder="R$ 0,00" /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h3>3. Custos Variáveis</h3>
              <p className="hint">Aqueles que sobem quando você vende mais.</p>
              <div className="grid-inputs">
                <div className="form-group"><label>Comissões (Total pago no mês)</label><input type="text" placeholder="R$ 0,00 ou %" /></div>
                <div className="form-group"><label>Custos com Produtos / Insumos</label><input type="text" placeholder="R$ 0,00" /></div>
              </div>
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          {step > 1 ? (
            <button className="btn-secondary" onClick={prevStep}>
              <ArrowLeft size={18} /> Voltar
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button className="btn-primary" onClick={nextStep}>
              Próximo <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-success" onClick={onComplete}>
              <CheckCircle2 size={18} /> Ver Dashboard
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
