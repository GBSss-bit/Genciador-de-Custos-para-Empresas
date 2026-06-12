import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import './Onboarding.css'; // Podemos reaproveitar os estilos do onboarding para o formulário

const Configuracoes = () => {
  const [dados, setDados] = useState({
    empresa: '', segmento: '', cidade: '', colaboradores: '', tipoEmpresa: 'MEI',
    aluguel: '', energia: '', agua: '', limpeza: '', internet: '', software: '', contador: '', marketing: '', prolabore: '', salarios: '', beneficios: '',
    comissoes: '', insumos: ''
  });
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('beluna_dados');
    if (saved) {
      try {
        setDados(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler dados salvos", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
    setSalvo(false); // Esconde a mensagem de sucesso se houver nova edição
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    let num = value.replace(/[^\d]/g, '');
    if (!num) return '';
    num = parseInt(num, 10).toString(); 
    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${num}`;
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: formatCurrency(value) }));
    setSalvo(false);
  };

  const handleSave = () => {
    localStorage.setItem('beluna_dados', JSON.stringify(dados));
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000); // Esconde após 3 segundos
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Configurações do Meu Negócio</h2>
        <button className="btn-success" onClick={handleSave} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {salvo ? <><Check size={18} /> Salvo com Sucesso!</> : <><Save size={18} /> Salvar Alterações</>}
        </button>
      </div>

      <div className="onboarding-glass" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#B388FF' }}>1. Dados da Empresa</h3>
        <div className="grid-inputs">
          <div className="form-group"><label>Nome</label><input name="empresa" value={dados.empresa} onChange={handleChange} /></div>
          <div className="form-group"><label>Segmento</label><input name="segmento" value={dados.segmento} onChange={handleChange} /></div>
          <div className="form-group"><label>Cidade</label><input name="cidade" value={dados.cidade} onChange={handleChange} /></div>
          <div className="form-group"><label>Colaboradores</label><input name="colaboradores" type="number" value={dados.colaboradores} onChange={handleChange} /></div>
          <div className="form-group">
            <label>Tipo de empresa</label>
            <select name="tipoEmpresa" value={dados.tipoEmpresa} onChange={handleChange}>
              <option value="MEI">MEI</option>
              <option value="LTDA">LTDA</option>
              <option value="Empresário Individual (EI)">Empresário Individual (EI)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="onboarding-glass" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#B388FF' }}>2. Custos Fixos (Mensais)</h3>
        <div className="grid-inputs">
          <div className="form-group"><label>Aluguel</label><input name="aluguel" value={dados.aluguel || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Energia</label><input name="energia" value={dados.energia || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Água</label><input name="agua" value={dados.agua || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Limpeza</label><input name="limpeza" value={dados.limpeza || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Internet / Telefone</label><input name="internet" value={dados.internet || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Software / Tráfego</label><input name="software" value={dados.software || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Contador</label><input name="contador" value={dados.contador || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Marketing</label><input name="marketing" value={dados.marketing || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Pró-labore</label><input name="prolabore" value={dados.prolabore || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Salários da Equipe</label><input name="salarios" value={dados.salarios || ''} onChange={handleCurrencyChange} /></div>
          <div className="form-group"><label>Benefícios</label><input name="beneficios" value={dados.beneficios || ''} onChange={handleCurrencyChange} /></div>
        </div>
      </div>

      <div className="onboarding-glass" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#B388FF' }}>3. Custos Variáveis</h3>
        <div className="grid-inputs">
          <div className="form-group">
            <label>Comissões</label>
            <input name="comissoes" value={dados.comissoes || ''} onChange={(e) => {
               const v = e.target.value;
               setDados(prev => ({ ...prev, comissoes: v.includes('%') ? v : formatCurrency(v) }));
               setSalvo(false);
            }} />
          </div>
          <div className="form-group"><label>Insumos / Produtos</label><input name="insumos" value={dados.insumos || ''} onChange={handleCurrencyChange} /></div>
        </div>
      </div>
      
    </div>
  );
};

export default Configuracoes;
