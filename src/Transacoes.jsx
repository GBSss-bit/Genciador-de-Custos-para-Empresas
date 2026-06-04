import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Plus, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
import './Transacoes.css';

export default function Transacoes({ tipo }) {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');

  const isReceita = tipo === 'RECEITA';

  useEffect(() => {
    fetchTransacoes();
  }, [tipo]);

  async function fetchTransacoes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('tipo', tipo)
        .order('data', { ascending: false });

      if (error) throw error;
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTransacao(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('transacoes')
        .insert([{
          tipo,
          descricao,
          valor: parseFloat(valor),
          categoria
        }]);

      if (error) throw error;

      setDescricao('');
      setValor('');
      setCategoria('');
      setShowModal(false);
      fetchTransacoes();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error.message);
    }
  }

  const formatarData = (isoStr) => {
    return new Date(isoStr).toLocaleDateString('pt-BR');
  };

  const total = transacoes.reduce((acc, curr) => acc + Number(curr.valor), 0);

  return (
    <div className="transacoes-container">
      <header className="transacoes-header">
        <div>
          <h2>{isReceita ? 'Receitas' : 'Despesas'}</h2>
          <p>Gerencie o fluxo financeiro da clínica</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nova {isReceita ? 'Receita' : 'Despesa'}
        </button>
      </header>

      <div className="resumo-card">
        <div className="resumo-icon" style={{ color: isReceita ? 'var(--success)' : 'var(--danger)' }}>
          {isReceita ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
        </div>
        <div className="resumo-info">
          <span>Total de {isReceita ? 'Receitas' : 'Despesas'} no período</span>
          <h3>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="spinner" size={32} />
          <p>Carregando dados do Supabase...</p>
        </div>
      ) : (
        <div className="transacoes-list">
          {transacoes.length === 0 ? (
            <div className="empty-state">
              {isReceita ? <ArrowUpCircle size={48} /> : <ArrowDownCircle size={48} />}
              <h3>Nenhuma {isReceita ? 'receita' : 'despesa'} encontrada</h3>
              <p>Comece a adicionar os registros financeiros.</p>
            </div>
          ) : (
            transacoes.map(t => (
              <div key={t.id} className="transacao-item">
                <div className="t-info">
                  <h4>{t.descricao}</h4>
                  <span>{t.categoria || 'Sem categoria'}</span>
                </div>
                <div className="t-data">
                  {formatarData(t.data)}
                </div>
                <div className={`t-valor ${isReceita ? 'positivo' : 'negativo'}`}>
                  {isReceita ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
            <h3>Nova {isReceita ? 'Receita' : 'Despesa'}</h3>
            <form onSubmit={handleAddTransacao}>
              <div className="form-group">
                <label>Descrição</label>
                <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} required placeholder="Ex: Limpeza dental - Maria" />
              </div>
              <div className="form-group">
                <label>Valor (R$)</label>
                <input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} required placeholder="150,00" />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Procedimentos, Conta de Luz" />
              </div>
              <button type="submit" className="btn-primary full-width">Salvar {isReceita ? 'Receita' : 'Despesa'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
