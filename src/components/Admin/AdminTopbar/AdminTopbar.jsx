import './AdminTopbar.scss'

function AdminTopbar() {
    return (
        <header className="admin-topbar">
            <div className="topbar-search">
                <span className="topbar-search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search"
                    className="topbar-input"
                />
            </div>

            <div className="topbar-user">
                <div className="topbar-avatar">M</div>
                <span className="topbar-username">Maritza</span>
            </div>
        </header>
    )
}

export default AdminTopbar