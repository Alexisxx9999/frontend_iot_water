// Servicio simulado para CRUD de lecturas
// Simulación de medidores
export const medidores = [
  { id: 1, nombre: 'Medidor Principal 1' },
  { id: 2, nombre: 'Medidor Secundario 2' },
  { id: 3, nombre: 'Medidor Tanque 3' }
]

let lecturas = []
let idCounter = 1

const getLecturas = async () => {
  // Devuelve la lectura con el nombre del medidor
  return lecturas.map(l => ({
    ...l,
    medidorNombre: medidores.find(m => m.id === Number(l.medidorId))?.nombre || 'Desconocido'
  }))
}

const getLecturaById = async (id) => {
  return lecturas.find(l => l.id === Number(id))
}

const createLectura = async (data) => {
  // Validaciones
  if (!data.medidorId) throw new Error('Debe seleccionar un medidor')
  if (!data.tipoLectura) throw new Error('Debe seleccionar el tipo de lectura')
  if (typeof data.valorLectura !== 'number' || data.valorLectura < 0) throw new Error('El valor debe ser un número positivo')
  if (!data.fechaLectura || new Date(data.fechaLectura) > new Date()) throw new Error('La fecha no puede ser futura')
  const nueva = { ...data, id: idCounter++ }
  lecturas.push(nueva)
  return nueva
}

const updateLectura = async (id, data) => {
  // Validaciones
  if (!data.medidorId) throw new Error('Debe seleccionar un medidor')
  if (!data.tipoLectura) throw new Error('Debe seleccionar el tipo de lectura')
  if (typeof data.valorLectura !== 'number' || data.valorLectura < 0) throw new Error('El valor debe ser un número positivo')
  if (!data.fechaLectura || new Date(data.fechaLectura) > new Date()) throw new Error('La fecha no puede ser futura')
  const idx = lecturas.findIndex(l => l.id === Number(id))
  if (idx !== -1) {
    lecturas[idx] = { ...lecturas[idx], ...data }
    return lecturas[idx]
  }
  return null
}

const deleteLectura = async (id) => {
  lecturas = lecturas.filter(l => l.id !== Number(id))
  return true
}

export default {
  getLecturas,
  getLecturaById,
  createLectura,
  updateLectura,
  deleteLectura
} 