
import { useState, useEffect, useRef } from 'react'
import './Sidebar.css'

const menuItems = [
  { name: 'Dashboard', icon: 'grid' },
  { name: 'Products', icon: 'package' },
  { name: 'Movements', icon: 'swap' },
  { name: 'Categories', icon: 'layers' },
  { name: 'Suppliers', icon: 'truck' },
  { name: 'Reports', icon: 'chart' }
]

function SidebarIcon({ type }) {
  const icons = {
    grid: <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>,
    package: <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v9" />
      <path d="m3 8v9l9 5 9-5V8" />
    </>,
    layers: <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>,
    truck: <>
      <path d="M3 6h12v12H3z" />
      <path d="M15 10h4l3 4v4h-7" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="18.5" cy="18" r="2" />
    </>,
    swap: <>
      <path d="M7 7h13" />
      <path d="m16 3 4 4-4 4" />
      <path d="M17 17H4" />
      <path d="m8 13-4 4 4 4" />
    </>,
    chart: <>
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 4 3 6-7" />
    </>,

    settings: <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.55v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 15a1.7 1.7 0 0 0-1.56-1.03H6.4v-2.55h.1a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5.4h2.55v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.1v2.55h-.1A1.7 1.7 0 0 0 19.4 15Z" />
    </>

  }

  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[type]}
    </svg>
  )
}

function Sidebar({ activePage, onNavigate }) {
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [isResizing, setIsResizing] = useState(false)

  const startX = useRef(0)
  const startWidth = useRef(240)

  const collapsed = sidebarWidth < 135

  function handleResizeStart(e) {
    e.preventDefault()
    startX.current = e.clientX
    startWidth.current = sidebarWidth
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isResizing) return

    function handleMouseMove(e) {
      const newWidth = startWidth.current + e.clientX - startX.current
      setSidebarWidth(Math.min(280, Math.max(76, newWidth)))
    }

    function handleMouseUp() {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.name}
            title={collapsed ? item.name : ''}
            className={`nav-item ${
              activePage === item.name ? 'active' : ''
            }`}
            onClick={() => onNavigate(item.name)}
          >
            <SidebarIcon type={item.icon} />
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          title={collapsed ? 'Settings' : ''}
          className={`nav-item ${
            activePage === 'Settings' ? 'active' : ''
          }`}
          onClick={() => onNavigate('Settings')}
        >
          <SidebarIcon type="settings" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>

      <div
        className={`sidebar-resize-handle ${isResizing ? 'resizing' : ''}`}
        onMouseDown={handleResizeStart}
        title="Glisser pour redimensionner"
      />
    </aside>
  )
}

export default Sidebar
