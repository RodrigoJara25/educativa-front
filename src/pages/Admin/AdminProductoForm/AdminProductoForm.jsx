import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './AdminProductoForm.scss'
import axiosInstance from '../../../config/axios'
import { useCategories } from '../../../context/CategoryContext'

function AdminProductoForm() {
    const navigate = useNavigate()
    const { id } = useParams()

    const esEdicion = Boolean(id)   // devuelve true si hay id, false si no

    const { categorias, loading } = useCategories()

    // Obteenemos solo las categorias de tipo LIBRO (solo categorias, no productos)
    const categoriasLibros = categorias.filter(cat => cat.tipo === "LIBRO")

    const [form, setForm] = useState({
        item: '',
        titulo: '',
        categoria: '',
    })
    const [imagen, setImagen] = useState(null)          // File object
    const [preview, setPreview] = useState(null)        // URL para previsualizar
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (!esEdicion) return
        const fetchProducto = async () => {
            try {
                const res = await axiosInstance.get(`/products/${id}`)
                const prod = res.data
                setForm({
                    item: prod.item || '',
                    titulo: prod.titulo || '',
                    categoria: prod.categoria?._id || '',
                })
                if (prod.fotoPortada) {
                    setPreview(prod.fotoPortada)
                }
            } catch (err) {
                console.error('Error al cargar producto:', err)
                setError('No se pudo cargar el producto')
            }
        }
        fetchProducto()
    }, [id, esEdicion])

    // Maneja cambios en los inputs de texto / select
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Maneja la selección de imagen
    const handleImagenChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImagen(file)
        setPreview(URL.createObjectURL(file))   // vista previa local
    }

    // Validación básica del formulario
    const validar = () => {
        if (!form.item.trim()) return 'El código del producto (Item) es obligatorio'
        if (!form.titulo.trim()) return 'El título es obligatorio'
        if (!form.categoria) return 'Debes seleccionar una categoría'
        if (!imagen && !esEdicion) return 'Debes seleccionar una imagen de portada'
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const mensajeError = validar()
        if (mensajeError) {
            setError(mensajeError)
            return
        }

        setIsSaving(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('item', form.item.trim())
            formData.append('titulo', form.titulo.trim())
            formData.append('categoria', form.categoria)
            formData.append('image', imagen)   // key 'image' según el backend

            if (esEdicion) {
                await axiosInstance.put(`/products/${id}`, formData)
            } else {
                await axiosInstance.post('/products', formData)
            }

            navigate('/admin/productos')   // volver a la lista al guardar
        } catch (err) {
            console.error(err)
            setError('Error al guardar el producto. Intenta de nuevo.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="admin-producto-form">

            <div className="form-header">
                <h1 className="form-titulo">{esEdicion ? 'Editar producto' : 'Agregar producto'}</h1>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} noValidate>

                    {/* Error global */}
                    {error && <p className="form-error">{error}</p>}

                    <div className="form-grid">

                        {/* Columna izquierda — campos de texto */}
                        <div className="form-campos">

                            <div className="campo-grupo">
                                <label htmlFor="item">Código (Item) *</label>
                                <input
                                    id="item"
                                    name="item"
                                    type="text"
                                    placeholder="Ej: LIB-031"
                                    value={form.item}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="titulo">Título *</label>
                                <input
                                    id="titulo"
                                    name="titulo"
                                    type="text"
                                    placeholder="Ej: El Principito"
                                    value={form.titulo}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="categoria">Categoría *</label>
                                <select
                                    id="categoria"
                                    name="categoria"
                                    value={form.categoria}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Selecciona una categoría --</option>
                                    {
                                        loading ? (
                                            <option disabled>Cargando categorias</option>
                                        ) : (
                                            categoriasLibros.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.nombre}
                                                </option>
                                            ))
                                        )
                                    }
                                </select>
                            </div>

                        </div>

                        {/* Columna derecha — imagen */}
                        <div className="form-imagen">
                            <label>Foto de portada *</label>
                            <div
                                className="imagen-preview"
                                onClick={() => document.getElementById('image').click()}
                            >
                                {preview
                                    ? <img src={preview} alt="Preview" />
                                    : <span className="imagen-placeholder">
                                        Haz clic para seleccionar imagen
                                    </span>
                                }
                            </div>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImagenChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                    </div>

                    {/* Botones */}
                    <div className="form-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => navigate('/admin/productos')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : (esEdicion ? 'Actualizar producto' : 'Guardar producto')}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default AdminProductoForm
