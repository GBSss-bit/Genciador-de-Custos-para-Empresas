import React, { useState, useEffect } from 'react';
import { Plus, Bell, TrendingUp, Clock, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const data = [
  { name: 'Jan', Receitas: 12000, Despesas: 4000 },
  { name: 'Fev', Receitas: 15000, Despesas: 5500 },
  { name: 'Mar', Receitas: 14000, Despesas: 4800 },
  { name: 'Abr', Receitas: 16500, Despesas: 6000 },
  { name: 'Mai', Receitas: 17000, Despesas: 6200 },
  { name: 'Jun', Receitas: 18420, Despesas: 6340 },
];

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    // Atraso de 200ms para renderizar o gráfico pesado da Recharts
    // Isso garante que a transição de tela do Onboarding seja instantânea
    const timer = setTimeout(() => setShowChart(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Visão Geral — Junho 2026</h2>
        <div className="header-actions">
          <button className="btn-icon">
            <Bell size={20} />
            <span className="indicator"></span>
          </button>
          <button className="btn-alert-prolabore">
            <ShieldAlert size={18} />
            Pró-labore Inteligente
          </button>
          <button className="btn-primary">
            <Plus size={18} />
            Nova Receita
          </button>
        </div>
      </header>

      <section className="kpi-cards">
        <div className="kpi-card">
          <span className="kpi-title">Receita do Mês</span>
          <h3 className="kpi-value">R$ 18.420</h3>
          <span className="kpi-trend positive"><TrendingUp size={14}/> +12% vs. maio</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Despesas</span>
          <h3 className="kpi-value">R$ 6.340</h3>
          <span className="kpi-trend negative"><TrendingUp size={14}/> +3% vs. maio</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Lucro Líquido</span>
          <h3 className="kpi-value">R$ 12.080</h3>
          <span className="kpi-trend positive"><TrendingUp size={14}/> +18% vs. maio</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Inadimplência</span>
          <h3 className="kpi-value">R$ 1.250</h3>
          <span className="kpi-trend negative"><Clock size={14}/> 3 cobranças pendentes</span>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="chart-section panel">
          <div className="panel-header">
            <h3>Receitas × Despesas (últimos 6 meses)</h3>
            <a href="#">Ver relatório</a>
          </div>
          <div className="chart-container">
            {showChart ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9292a0', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9292a0', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#272732', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff'}} />
                  <Bar dataKey="Receitas" fill="#7aa2f7" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="Despesas" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', animation: 'pulse 1.5s infinite' }}>
                Carregando visão financeira...
              </div>
            )}
            <div className="chart-legend">
              <div className="legend-item"><span className="dot dot-receita"></span> Receitas</div>
              <div className="legend-item"><span className="dot dot-despesa"></span> Despesas</div>
            </div>
          </div>
        </section>

        <section className="appointments-section panel">
          <div className="panel-header">
            <h3>Agendamentos de hoje</h3>
            <a href="#">Ver todos</a>
          </div>
          <div className="list-items">
            <div className="list-item">
              <span className="time">09:00</span>
              <div className="avatar bg-green">MC</div>
              <div className="details">
                <strong>Maria Costa</strong>
                <span>Limpeza dental</span>
              </div>
              <span className="value text-green">R$ 180</span>
            </div>
            <div className="list-item">
              <span className="time">10:30</span>
              <div className="avatar bg-purple">JP</div>
              <div className="details">
                <strong>João Pereira</strong>
                <span>Canal</span>
              </div>
              <span className="value text-green">R$ 850</span>
            </div>
            <div className="list-item">
              <span className="time">14:00</span>
              <div className="avatar bg-orange">AR</div>
              <div className="details">
                <strong>Ana Rocha</strong>
                <span>Clareamento</span>
              </div>
              <span className="value text-green">R$ 620</span>
            </div>
          </div>
        </section>

        <section className="transactions-section panel">
          <div className="panel-header">
            <h3>Últimas transações</h3>
            <a href="#">Ver todas</a>
          </div>
          <div className="list-items">
            <div className="list-item">
              <div className="icon-box bg-green-light text-green"><TrendingUp size={16}/></div>
              <div className="details">
                <strong>Consulta — Maria C.</strong>
                <span>Pix</span>
              </div>
              <span className="value text-green">+R$ 180</span>
            </div>
            <div className="list-item">
              <div className="icon-box bg-green-light text-green"><TrendingUp size={16}/></div>
              <div className="details">
                <strong>Clareamento — Ana R.</strong>
                <span>Cartão de Crédito</span>
              </div>
              <span className="value text-green">+R$ 620</span>
            </div>
          </div>
        </section>

        <section className="categories-section panel">
          <div className="panel-header">
            <h3>Receita por categoria</h3>
          </div>
          <div className="category-items">
            <div className="category-item">
              <span>Procedimentos</span>
              <div className="progress-bar"><div className="fill bg-purple" style={{width: '70%'}}></div></div>
              <strong>R$ 13.260</strong>
            </div>
            <div className="category-item">
              <span>Consultas</span>
              <div className="progress-bar"><div className="fill bg-green" style={{width: '30%'}}></div></div>
              <strong>R$ 5.160</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
