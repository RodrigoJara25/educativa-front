import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLaminaForm.scss'
import { laminasMock } from '../../../data/laminasMock'
import axiosInstance from '../../../config/axios'
import { useCategories } from '../../../context/CategoryContext'

function AdminLaminaForm() {
    const navigate = useNavigate()

    const { categorias, subcategorias, loading: loadingCat } = useCategories()

    // Buscamos la única categoría tipo LAMINA
    const categoriaLaminaUnica = categorias.find(cat => cat.tipo === 'LAMINA')

    // Subcategorías disponibles para Láminas
    const subcategoriasDisponibles = subcategorias.filter(sub => {
        const idCat = sub.categoria?._id || sub.categoria
        return idCat === categoriaLaminaUnica?._id
    })

    const [form, setForm] = useState({
        item: '',
        categoria: categoriaLaminaUnica?._id || '', // Pre-seleccionada
        subcategoria: '',
    })
    const [imagen, setImagen] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    // Esta funcion se encarga de pre-seleccionar la categoria LAMINA en el formulario
    // Esto se hace para que el usuario no tenga que seleccionar la categoria LAMINA
    // ya que esta pre-seleccionada por defecto
    useEffect(() => {
        if (categoriaLaminaUnica) {
            setForm(prev => ({ ...prev, categoria: categoriaLaminaUnica._id }))
        }
    }, [categoriaLaminaUnica])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleImagenChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImagen(file)
        setPreview(URL.createObjectURL(file))
    }

    const validar = () => {
        if (!form.item.trim()) return 'El código (Item) es obligatorio'
        if (!form.categoria) return 'Error: No se encontró la categoría Láminas'
        if (!form.subcategoria) return 'Debes seleccionar una subcategoría'
        if (!imagen) return 'Debes seleccionar la imagen de la lámina'
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const mensajeError = validar()
        if (mensajeError) {
            setError(mensajeError)
            return
        }

        setLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('item', form.item.trim())
            formData.append('categoria', form.categoria)
            formData.append('subcategoria', form.subcategoria)
            formData.append('image', imagen)

            await axiosInstance.post('/products', formData)
            navigate('/admin/laminas')
        } catch (err) {
            console.error(err)
            setError('Error al guardar la lámina. Verifica la consola.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-lamina-form">

            <div className="form-header">
                <h1 className="form-titulo">Agregar nueva lámina</h1>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} noValidate>

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-grid">

                        <div className="form-campos">
                            <div className="campo-grupo">
                                <label htmlFor="item">Código de lámina (Item) *</label>
                                <input
                                    id="item"
                                    name="item"
                                    type="text"
                                    placeholder="Ej: LAM-HIST-01"
                                    value={form.item}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Categoría fija (Read Only) */}
                            <div className="campo-grupo">
                                <label>Categoría *</label>
                                <input
                                    type="text"
                                    value={categoriaLaminaUnica?.nombre || 'Láminas'}
                                    disabled
                                    className="input-disabled"
                                />
                                <input type="hidden" name="categoria" value={form.categoria} />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="subcategoria">Subcategoría *</label>
                                <select
                                    id="subcategoria"
                                    name="subcategoria"
                                    value={form.subcategoria}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Selecciona subcategoría --</option>
                                    {subcategoriasDisponibles.map(sub => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-imagen">
                            <label>Imagen de la lámina *</label>
                            <div
                                className="imagen-preview"
                                onClick={() => document.getElementById('image-lamina').click()}
                            >
                                {preview
                                    ? <img src={preview} alt="Preview" />
                                    : <div className="imagen-placeholder">
                                        <span className="icon">🖼️</span>
                                        <p>Seleccionar lámina</p>
                                    </div>
                                }
                            </div>
                            <input
                                id="image-lamina"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImagenChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                    </div>

                    <div className="form-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => navigate('/admin/laminas')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar lámina'}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default AdminLaminaForm
