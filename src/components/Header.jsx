
import './Header.css'

function Header() {
  return (
    <header className="header">

      <div className="header-brand">
        <div className="header-logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3 9 5-9 5-9-5 9-5Z" />
            <path d="m3 8 9 5 9-5" />
            <path d="M12 13v8" />
            <path d="M3 8v9l9 5 9-5V8" />
          </svg>
        </div>

        <h1>Stocky</h1>
      </div>

      <div className="header-actions">

        <div className="header-search">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>

          <input
            type="text"
            placeholder="Rechercher..."
          />
        </div>

        <div className="user-profile">
          <div className="user-avatar">A</div>
          <span>Admin</span>
        </div>

      </div>

    </header>
  )
}

export default Header
