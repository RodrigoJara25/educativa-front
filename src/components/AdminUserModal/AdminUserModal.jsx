import { useState, useEffect } from 'react';
import './AdminUserModal.scss';

// EL MISMO MODAL INTELIGENTE RESPONDE Y CAMBIA SEGÚN LA PROP "tipo"
// tipo acepta "CLIENTE", "VENDEDOR" o "DISTRIBUIDOR"
function AdminUserModal({ isOpen, onClose, onSubmit, initialData, tipo }) {
    const isEditing = !!initialData;

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        dni: '',
        ruc_dni: '',
        celular: '',
        email: '',
        password: '',
        role: tipo === 'VENDEDOR' ? 'VENDEDOR' : 'USER',
        activo: true
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Modo Edición: Se cargan los datos de la fila de la tabla
                setFormData({
                    nombre: initialData.nombre || '',
                    apellidos: initialData.apellidos || '',
                    dni: initialData.dni || '',
                    ruc_dni: initialData.ruc_dni || '',
                    celular: initialData.celular || '',
                    email: initialData.email || '',
                    password: '', // Siempre vacío por seguridad al cargar
                    role: initialData.role || (tipo === 'VENDEDOR' ? 'VENDEDOR' : 'USER'),
                    activo: initialData.activo !== false
                });
            } else {
                // Modo Nuevo: Todo Limpio
                setFormData({
                    nombre: '', apellidos: '', dni: '', ruc_dni: '',
                    celular: '', email: '', password: '',
                    role: tipo === 'VENDEDOR' ? 'VENDEDOR' : 'USER',
                    activo: true
                });
            }
        }
    }, [isOpen, initialData, tipo]);

    // Ocultar si el state del papá dice que no está abierto
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Armamos el Paquete final para la base de datos limpiando lo que sobra
        const payload = { ...formData };
        if (tipo === 'DISTRIBUIDOR') {
            delete payload.apellidos;
            delete payload.dni;
            delete payload.role;
        } else {
            delete payload.ruc_dni;
            delete payload.activo;
        }

        if (isEditing && !payload.password) delete payload.password;

        onSubmit(payload); // Y lo enviamos al componente papá (La Tabla de Clientes/Vend/Dist)
    };

    return (
        <div className="admin-user-modal-overlay">
            <div className="admin-user-modal">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar' : 'Agregar'} {tipo === 'DISTRIBUIDOR' ? 'Distribuidor' : (tipo === 'VENDEDOR' ? 'Vendedor' : 'Cliente')}</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group-row">
                        <div className="form-group w-50">
                            <label>Nombre {tipo === 'DISTRIBUIDOR' && '/ Razón Social'}*</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        {tipo !== 'DISTRIBUIDOR' && (
                            <div className="form-group w-50">
                                <label>Apellidos</label>
                                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} />
                            </div>
                        )}
                    </div>

                    <div className="form-group-row">
                        {tipo !== 'DISTRIBUIDOR' ? (
                            <div className="form-group w-50">
                                <label>DNI *</label>
                                <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
                            </div>
                        ) : (
                            <div className="form-group w-50">
                                <label>RUC o DNI *</label>
                                <input type="text" name="ruc_dni" value={formData.ruc_dni} onChange={handleChange} required />
                            </div>
                        )}
                        <div className="form-group w-50">
                            <label>Celular *</label>
                            <input type="text" name="celular" value={formData.celular} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group-row">
                        <div className="form-group w-50">
                            <label>Contraseña {isEditing && '(Opcional)'}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                        </div>

                        {tipo !== 'DISTRIBUIDOR' && (
                            <div className="form-group w-50">
                                <label>Rol Principal</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="rol-select">
                                    <option value="USER">USER (Cliente)</option>
                                    <option value="VENDEDOR">VENDEDOR</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        )}

                        {tipo === 'DISTRIBUIDOR' && (
                            <div className="form-group checkbox-group w-50">
                                <label className="switch-label">
                                    <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
                                    <span>{formData.activo ? 'Distribuidor Activo' : 'Cuenta Suspendida'}</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-guardar">{isEditing ? 'Actualizar' : 'Registrar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminUserModal;