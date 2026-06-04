import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Plus, UserPlus, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import './Agendamentos.css';

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('agendamento'); // 'agendamento' ou 'paciente'

  // Form states
  const [nomePaciente, setNomePaciente] = useState('');
  const [telefone, setTelefone] = useState('');
  
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Buscar pacientes
      const { data: pacData, error: pacError } = await supabase
        .from('pacientes')
        .select('*')
        .order('nome', { ascending: true });
      if (pacError) throw pacError;
      setPacientes(pacData);

      // Buscar agendamentos
      const { data: agData, error: agError } = await supabase
        .from('agendamentos')
        .select(`
          *,
          pacientes (nome)
        `)
        .order('data_hora', { ascending: true });
      if (agError) throw agError;
      setAgendamentos(agData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error.message);
      alert('Erro ao conectar com o banco de dados.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPaciente(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pacientes')
        .insert([{ nome: nomePaciente, telefone }]);
      
      if (error) throw error;
      
      setNomePaciente('');
      setTelefone('');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error.message);
    }
  }

  async function handleAddAgendamento(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('agendamentos')
        .insert([{
          paciente_id: pacienteSelecionado,
          data_hora: dataHora,
          procedimento,
          valor: parseFloat(valor),
          status: 'Agendado'
        }]);
      
      if (error) throw error;
      
      setPacienteSelecionado('');
      setDataHora('');
      setProcedimento('');
      setValor('');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error.message);
    }
  }

  const formatarData = (isoStr) => {
    const data = new Date(isoStr);
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="agendamentos-container">
      <header className="agendamentos-header">
        <div>
          <h2>Agenda da Clínica</h2>
          <p>Gerencie seus clientes e horários</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => { setModalType('paciente'); setShowModal(true); }}>
            <UserPlus size={18} /> Novo Paciente
          </button>
          <button className="btn-primary" onClick={() => { setModalType('agendamento'); setShowModal(true); }}>
            <Plus size={18} /> Novo Agendamento
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="spinner" size={32} />
          <p>Carregando dados do Supabase...</p>
        </div>
      ) : (
        <div className="agendamentos-list">
          {agendamentos.length === 0 ? (
            <div className="empty-state">
              <CalendarIcon size={48} />
              <h3>Nenhum agendamento encontrado</h3>
              <p>Cadastre um paciente e marque o primeiro agendamento!</p>
            </div>
          ) : (
            agendamentos.map(ag => (
              <div key={ag.id} className="agendamento-card">
                <div className="ag-time">
                  <Clock size={16} />
                  <span>{formatarData(ag.data_hora)}</span>
                </div>
                <div className="ag-details">
                  <h4>{ag.pacientes?.nome || 'Paciente não encontrado'}</h4>
                  <p>{ag.procedimento}</p>
                </div>
                <div className="ag-value">
                  R$ {ag.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className={`ag-status ${ag.status.toLowerCase()}`}>
                  {ag.status}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            {modalType === 'paciente' ? (
              <>
                <h3>Cadastrar Novo Paciente</h3>
                <form onSubmit={handleAddPaciente}>
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" value={nomePaciente} onChange={e => setNomePaciente(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-primary full-width">Salvar Paciente</button>
                </form>
              </>
            ) : (
              <>
                <h3>Novo Agendamento</h3>
                <form onSubmit={handleAddAgendamento}>
                  <div className="form-group">
                    <label>Paciente</label>
                    <select value={pacienteSelecionado} onChange={e => setPacienteSelecionado(e.target.value)} required>
                      <option value="">Selecione um paciente...</option>
                      {pacientes.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data e Hora</label>
                    <input type="datetime-local" value={dataHora} onChange={e => setDataHora(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Procedimento / Serviço</label>
                    <input type="text" value={procedimento} onChange={e => setProcedimento(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Valor Previsto (R$)</label>
                    <input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-primary full-width">Marcar Agendamento</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
