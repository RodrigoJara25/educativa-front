import { useState, useEffect } from 'react';
import './AdminUserModal.scss';
import ubigeo from "ubigeo-peru"; // NUEVO: Importamos para la cascada del ubigeo

function AdminUserModal({ isOpen, onClose, onSubmit, initialData, tipo }) {
    const isEditing = !!initialData;
    const dataUbigeo = ubigeo.reniec; // Base de datos local

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        dni: '',
        ruc_dni: '',
        celular: '',
        email: '',
        password: '',
        username: '',
        role: tipo === 'VENDEDOR' ? 'VENDEDOR' : 'USER',
        activo: true,
        // --- LOGÍSTICA ---
        departamento: '',
        provincia: '',
        distrito: '',
        direccion: '',
        agencia: '',
        referencia: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nombre: initialData.nombre || '',
                    apellidos: initialData.apellidos || '',
                    dni: initialData.dni || '',
                    ruc_dni: initialData.ruc_dni || '',
                    celular: initialData.celular || '',
                    email: initialData.email || '',
                    password: '',
                    username: initialData.username || '',
                    role: initialData.role || (tipo === 'VENDEDOR' ? 'VENDEDOR' : 'USER'),
                    activo: initialData.activo !== false,
                    departamento: initialData.departamento || '',
                    provincia: initialData.provincia || '',
                    distrito: initialData.distrito || '',
                    direccion: initialData.direccion || '',
                    agencia: initialData.agencia || '',
                    referencia: initialData.referencia || ''
                });
            } else {
                setFormData({
                    nombre: '', apellidos: '', dni: '', ruc_dni: '',
                    celular: '', email: '', password: '', username: '',
                    role: tipo === 'VENDEDOR' ? 'VENDEDOR' : 'USER',
                    activo: true,
                    departamento: '', provincia: '', distrito: '',
                    direccion: '', agencia: '', referencia: ''
                });
            }
        }
    }, [isOpen, initialData, tipo]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = name === 'username' ? value.toLowerCase() : value;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : finalValue });
    };

    // Función exclusiva para controlar el Ubigeo
    const handleUbigeoChange = (tipoSelector, e) => {
        const valor = e.target.value;
        if (tipoSelector === 'departamento') {
            setFormData(prev => ({ ...prev, departamento: valor, provincia: "", distrito: "" }));
        } else if (tipoSelector === 'provincia') {
            setFormData(prev => ({ ...prev, provincia: valor, distrito: "" }));
        } else {
            setFormData(prev => ({ ...prev, distrito: valor }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };

        if (tipo === 'DISTRIBUIDOR') {
            delete payload.apellidos;
            delete payload.dni;
            delete payload.role;

            if (!payload.username) {
                alert("El Username es obligatorio para los distribuidores.");
                return;
            }
            if (!isEditing) delete payload.activo;
        } else {
            delete payload.ruc_dni;
            delete payload.activo;
            delete payload.username;
            delete payload.departamento;
            delete payload.provincia;
            delete payload.distrito;
            delete payload.direccion;
            delete payload.agencia;
            delete payload.referencia;
        }

        if (isEditing && !payload.password) delete payload.password;

        onSubmit(payload);
    };

    // Listas dinámicas para los selectores dependiendo de qué eligieron antes
    const departamentos = dataUbigeo.filter(dep => dep.provincia === "00" && dep.distrito === "00");

    const provincias = dataUbigeo.filter(dep =>
        dep.departamento === formData.departamento &&
        dep.provincia !== "00" &&
        dep.distrito === "00"
    );

    const distritos = dataUbigeo.filter(dep =>
        dep.departamento === formData.departamento &&
        dep.provincia === formData.provincia &&
        dep.distrito !== "00"
    );

    return (
        <div className="admin-user-modal-overlay">
            <div className="admin-user-modal" style={{ maxWidth: tipo === 'DISTRIBUIDOR' ? '800px' : '500px' }}>
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar' : 'Agregar'} {tipo === 'DISTRIBUIDOR' ? 'Distribuidor' : (tipo === 'VENDEDOR' ? 'Vendedor' : 'Cliente')}</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>

                    {tipo === 'DISTRIBUIDOR' && <h4 style={{ margin: '0 0 15px 0', color: '#8FC93C', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Datos Principales</h4>}

                    <div className="form-group-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Nombre {tipo === 'DISTRIBUIDOR' && '/ Razón Social'}*</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        {tipo !== 'DISTRIBUIDOR' && (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Apellidos</label>
                                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} />
                            </div>
                        )}
                        {tipo === 'DISTRIBUIDOR' && (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Username de Acceso *</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="ej. carlos123" required />
                            </div>
                        )}
                    </div>

                    <div className="form-group-row">
                        {tipo !== 'DISTRIBUIDOR' ? (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>DNI *</label>
                                <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
                            </div>
                        ) : (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>RUC o DNI *</label>
                                <input type="text" name="ruc_dni" value={formData.ruc_dni} onChange={handleChange} required />
                            </div>
                        )}
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Celular *</label>
                            <input type="text" name="celular" value={formData.celular} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Contraseña {isEditing && '(Opcional)'}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                        </div>

                        {tipo !== 'DISTRIBUIDOR' && (
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Rol Principal</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="rol-select">
                                    <option value="USER">USER (Cliente)</option>
                                    <option value="VENDEDOR">VENDEDOR</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        )}

                        {tipo === 'DISTRIBUIDOR' && (
                            <div className="form-group checkbox-group" style={{ flex: 1, marginTop: '25px', justifyContent: 'flex-start' }}>
                                <label className="switch-label">
                                    <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
                                    <span>{formData.activo ? 'Distribuidor Activo' : 'Cuenta Suspendida'}</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN EXCLUSIVA DE LOGÍSTICA PARA DISTRIBUIDORES */}
                    {tipo === 'DISTRIBUIDOR' && (
                        <>
                            <h4 style={{ margin: '20px 0 15px 0', color: '#8FC93C', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Datos de Logística / Envío (Opcionales)</h4>

                            <div className="form-group-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Departamento</label>
                                    <select value={formData.departamento} onChange={(e) => handleUbigeoChange('departamento', e)}>
                                        <option value="">Selecciona...</option>
                                        {departamentos.map(d => <option key={d.departamento} value={d.departamento}>{d.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Provincia</label>
                                    <select value={formData.provincia} onChange={(e) => handleUbigeoChange('provincia', e)} disabled={!formData.departamento}>
                                        <option value="">Selecciona...</option>
                                        {provincias.map(p => <option key={p.provincia} value={p.provincia}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Distrito</label>
                                    <select value={formData.distrito} onChange={(e) => handleUbigeoChange('distrito', e)} disabled={!formData.provincia}>
                                        <option value="">Selecciona...</option>
                                        {distritos.map(d => <option key={d.distrito} value={d.distrito}>{d.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Dirección Exacta</label>
                                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Av. Principal 123" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Agencia de Preferencia</label>
                                    <input type="text" name="agencia" value={formData.agencia} onChange={handleChange} placeholder="Ej. Shalom, Marvisur" />
                                </div>
                            </div>

                            {/* REF: Cuadro de Referencia más grande y ancho */}
                            <div className="form-group">
                                <label>Referencia (Indicaciones adicionales)</label>
                                <textarea name="referencia" value={formData.referencia} onChange={handleChange} placeholder="Ej. Frente al parque, puerta verde de metal..." rows="3" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }} />
                            </div>
                        </>
                    )}

                    <div className="modal-footer" style={{ marginTop: '20px' }}>
                        <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-guardar">{isEditing ? 'Actualizar' : 'Registrar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminUserModal;