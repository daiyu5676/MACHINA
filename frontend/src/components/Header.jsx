function Header() {
  return (
    <header className="header">

      <div className="header-left">
        <h1 className="header-title">MACHINA</h1>
        <span className="header-subtitle">Predictive Maintenance</span>
      </div>

      <div className="header-right">
        <span className="status-indicator">
          <span className="status-dot status-dot--online"></span>
          SYSTEM OPERATIONAL
        </span>
      </div>

    </header>
  );
}

export default Header;
