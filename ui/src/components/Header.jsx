function Header({ activePage, onNavigate }) {
  return (
    <header className="header">
      <h1 className="logo">COZY</h1>
      <nav className="nav">
        <button
          type="button"
          className={`nav-link ${activePage === 'order' ? 'active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button
          type="button"
          className={`nav-link ${activePage === 'admin' ? 'active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}

export default Header
