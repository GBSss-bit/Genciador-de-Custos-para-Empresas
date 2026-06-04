import React from 'react';
import { LayoutDashboard, Calendar, Users, DollarSign, ArrowDownCircle, AlertCircle, FileText, Settings, Square, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onReset }) => {
  const handleNav = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Square size={20} fill="currentColor" />
        </div>
        <div className="brand-text">
          <h2>FinClinic</h2>
          <span>Gestão Financeira</span>
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">DS</div>
        <div className="profile-info">
          <h3>Dra. Silva</h3>
          <span>Odontologia — Admin</span>
        </div>
        <button className="btn-logout" onClick={onReset} title="Sair / Nova Empresa">
          <LogOut size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4>PRINCIPAL</h4>
          <ul>
            <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => handleNav('Dashboard')}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </li>
            <li className={activeTab === 'Agendamentos' ? 'active' : ''} onClick={() => handleNav('Agendamentos')}>
              <Calendar size={18} />
              <span>Agendamentos</span>
              <span className="badge">8</span>
            </li>
            <li className={activeTab === 'Pacientes / Clientes' ? 'active' : ''} onClick={() => handleNav('Pacientes / Clientes')}>
              <Users size={18} />
              <span>Pacientes / Clientes</span>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h4>FINANCEIRO</h4>
          <ul>
            <li className={activeTab === 'Receitas' ? 'active' : ''} onClick={() => handleNav('Receitas')}>
              <DollarSign size={18} />
              <span>Receitas</span>
            </li>
            <li className={activeTab === 'Despesas' ? 'active' : ''} onClick={() => handleNav('Despesas')}>
              <ArrowDownCircle size={18} />
              <span>Despesas</span>
            </li>
            <li className={activeTab === 'Cobranças' ? 'active' : ''} onClick={() => handleNav('Cobranças')}>
              <AlertCircle size={18} />
              <span>Cobranças</span>
            </li>
            <li className={activeTab === 'Relatórios' ? 'active' : ''} onClick={() => handleNav('Relatórios')}>
              <FileText size={18} />
              <span>Relatórios</span>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <h4>CONFIGURAÇÕES</h4>
          <ul>
            <li className={activeTab === 'Preferências' ? 'active' : ''} onClick={() => handleNav('Preferências')}>
              <Settings size={18} />
              <span>Preferências</span>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
