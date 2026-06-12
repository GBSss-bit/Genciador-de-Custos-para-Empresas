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

  // Estados para a Etapa 2
  const [aluguel, setAluguel] = useState('');
  const [energia, setEnergia] = useState('');
  const [agua, setAgua] = useState('');
  const [limpeza, setLimpeza] = useState('');
  const [internet, setInternet] = useState('');
  const [software, setSoftware] = useState('');
  const [contador, setContador] = useState('');
  const [marketing, setMarketing] = useState('');
  const [prolabore, setProlabore] = useState('');
  const [salarios, setSalarios] = useState('');
  const [beneficios, setBeneficios] = useState('');

  // Estados para a Etapa 3
  const [comissoes, setComissoes] = useState('');
  const [insumos, setInsumos] = useState('');

  // Formatação automática para R$
  const formatCurrency = (value) => {
    if (!value) return '';
    let num = value.replace(/[^\d]/g, '');
    if (!num) return '';
    num = parseInt(num, 10).toString(); // remove zeros à esquerda
    // Formata milhar: 1000 -> 1.000
    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${num}`;
  };

  useEffect(() => {
    const handleSmartSpeech = (e) => {
      const latestText = e.detail.latest.toLowerCase();
      const fullText = e.detail.full.toLowerCase();

      // Comando de voz Global: Avançar Etapa (usa apenas a última frase falada para não repetir comandos antigos)
      if (latestText.includes('próximo') || latestText.includes('proximo') || latestText.includes('avançar') || latestText.includes('continuar')) {
        if (step < 3) {
          setStep((prev) => Math.min(prev + 1, 3));
        } else {
          handleFinish(); // Se falar 'próximo' na última etapa, salva os dados e vai pro Dashboard!
        }
        return; // Para não misturar com o texto dos formulários
      }

      const extract = (text, regex) => {
        const match = text.match(regex);
        return match ? match[1].trim() : null;
      };

      if (step === 1) {
        const stops = "segmento|cidade|colaboradores|colaborador|funcionários|funcionário|tipo";
        const nEmpresa = extract(fullText, new RegExp(`(?:nome da empresa|empresa)\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
        const nSegmento = extract(fullText, new RegExp(`segmento\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
        const nCidade = extract(fullText, new RegExp(`cidade\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
        const nColab = extract(fullText, new RegExp(`(?:colaboradores|colaborador|funcionários|funcionário)\\s+(.*?)(?=\\s+(?:${stops})|$)`, 'i'));
        const nTipo = extract(fullText, new RegExp(`(?:tipo de empresa|tipo)\\s+(.*)`, 'i'));

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
      }

      if (step === 2) {
        const extractMoney = (regex) => {
          const match = fullText.match(regex);
          if (match) {
             let val = match[1].replace(/[^\d,.]/g, ''); // Retira tudo que não for número, vírgula ou ponto
             return val ? val : null;
          }
          return null;
        };

        const stops2 = "aluguel|energia|luz|água|agua|limpeza|material|internet|telefone|software|tráfego|contador|contabilidade|marketing|pró-labore|prolabore|salário|salários|benefícios";

        const nAluguel = extractMoney(new RegExp(`aluguel\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nEnergia = extractMoney(new RegExp(`(?:energia|luz)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nAgua = extractMoney(new RegExp(`(?:água|agua)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nLimpeza = extractMoney(new RegExp(`(?:limpeza|material de limpeza)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nInternet = extractMoney(new RegExp(`(?:internet|telefone)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nSoftware = extractMoney(new RegExp(`(?:software|tráfego)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nContador = extractMoney(new RegExp(`(?:contador|contabilidade)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nMarketing = extractMoney(new RegExp(`marketing\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nProlabore = extractMoney(new RegExp(`(?:pró-labore|prolabore|salário do dono)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nSalarios = extractMoney(new RegExp(`(?:salários da equipe|salário da equipe|salários|salário)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));
        const nBeneficios = extractMoney(new RegExp(`(?:benefícios da equipe|benefícios|beneficio)\\s+(.*?)(?=\\s+(?:${stops2})|$)`, 'i'));

        if (nAluguel) setAluguel(formatCurrency(nAluguel));
        if (nEnergia) setEnergia(formatCurrency(nEnergia));
        if (nAgua) setAgua(formatCurrency(nAgua));
        if (nLimpeza) setLimpeza(formatCurrency(nLimpeza));
        if (nInternet) setInternet(formatCurrency(nInternet));
        if (nSoftware) setSoftware(formatCurrency(nSoftware));
        if (nContador) setContador(formatCurrency(nContador));
        if (nMarketing) setMarketing(formatCurrency(nMarketing));
        if (nProlabore) setProlabore(formatCurrency(nProlabore));
        if (nSalarios) setSalarios(formatCurrency(nSalarios));
        if (nBeneficios) setBeneficios(formatCurrency(nBeneficios));
      }

      if (step === 3) {
        // Nova lógica mais inteligente que não quebra se o usuário repetir palavras
        const nComissoesMatch = fullText.match(/(?:comissões|comissão).*?([\d.,]+(?:\s*%|\s*por cento)?)/i);
        const nInsumosMatch = fullText.match(/(?:custos com produtos|custo com produto|produtos|insumos|produto|insumo).*?([\d.,]+)/i);

        if (nComissoesMatch) {
            let val = nComissoesMatch[1].replace(/[^\d,.]/g, '');
            if (nComissoesMatch[0].includes('%') || nComissoesMatch[0].includes('por cento')) {
                setComissoes(val + '%');
            } else if (val) {
                setComissoes(formatCurrency(val));
            }
        }
        
        if (nInsumosMatch) {
            let val = nInsumosMatch[1].replace(/[^\d,.]/g, '');
            if (val) setInsumos(formatCurrency(val));
        }
      }
    };

    window.addEventListener('smartSpeech', handleSmartSpeech);
    return () => window.removeEventListener('smartSpeech', handleSmartSpeech);
  }, [step]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFinish = () => {
    // Salva todos os dados que o usuário informou para que a Inteligência Artificial possa ler e conversar sobre eles no Dashboard
    const dadosCadastrados = {
      empresa, segmento, cidade, colaboradores, tipoEmpresa,
      aluguel, energia, agua, limpeza, internet, software, contador, marketing, prolabore, salarios, beneficios,
      comissoes, insumos
    };
    localStorage.setItem('beluna_dados', JSON.stringify(dadosCadastrados));
    onComplete();
  };

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
                <div className="form-group"><label>Aluguel</label><input type="text" placeholder="R$ 0,00" value={aluguel} onChange={e => setAluguel(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Energia</label><input type="text" placeholder="R$ 0,00" value={energia} onChange={e => setEnergia(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Água</label><input type="text" placeholder="R$ 0,00" value={agua} onChange={e => setAgua(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Material de limpeza</label><input type="text" placeholder="R$ 0,00" value={limpeza} onChange={e => setLimpeza(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Internet / Telefone</label><input type="text" placeholder="R$ 0,00" value={internet} onChange={e => setInternet(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Software / Tráfego</label><input type="text" placeholder="R$ 0,00" value={software} onChange={e => setSoftware(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Contador</label><input type="text" placeholder="R$ 0,00" value={contador} onChange={e => setContador(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Marketing</label><input type="text" placeholder="R$ 0,00" value={marketing} onChange={e => setMarketing(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Pró-labore (Salário do Dono)</label><input type="text" placeholder="R$ 0,00" value={prolabore} onChange={e => setProlabore(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Salários da Equipe (Funcionários)</label><input type="text" placeholder="R$ Soma de todos" value={salarios} onChange={e => setSalarios(formatCurrency(e.target.value))} /></div>
                <div className="form-group"><label>Benefícios da Equipe</label><input type="text" placeholder="R$ 0,00" value={beneficios} onChange={e => setBeneficios(formatCurrency(e.target.value))} /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h3>3. Custos Variáveis</h3>
              <p className="hint">Aqueles que sobem quando você vende mais.</p>
              <div className="grid-inputs">
                <div className="form-group">
                  <label>Comissões (Total pago no mês)</label>
                  <input type="text" placeholder="R$ 0,00 ou %" value={comissoes} onChange={e => {
                    const v = e.target.value;
                    setComissoes(v.includes('%') ? v : formatCurrency(v));
                  }} />
                </div>
                <div className="form-group">
                  <label>Custos com Produtos / Insumos</label>
                  <input type="text" placeholder="R$ 0,00" value={insumos} onChange={e => setInsumos(formatCurrency(e.target.value))} />
                </div>
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
            <button className="btn-success" onClick={handleFinish}>
              <CheckCircle2 size={18} /> Dashboard
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
