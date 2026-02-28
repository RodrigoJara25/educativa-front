import AdminSidebar from '../AdminSidebar/AdminSidebar'
import AdminTopbar from '../AdminTopbar/AdminTopbar'
import './AdminLayout.scss'

function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main">
                <AdminTopbar />
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
