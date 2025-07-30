<template>
  <div class="lectura-list-page">
    <div class="lectura-list-header">
      <h1>Lecturas</h1>
      <router-link to="/app/lecturas/create" class="btn btn-primary">+ Nueva Lectura</router-link>
    </div>
    <div class="lectura-table-container">
      <table class="lectura-table">
        <thead>
          <tr>
            <th>Lectura</th>
            <th>Valor</th>
            <th>Fecha</th>
            <th>Medidor</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lectura in lecturas" :key="lectura.id">
            <td>{{ lectura.lectura }}</td>
            <td>{{ lectura.valorLectura }}</td>
            <td>{{ lectura.fechaLectura }}</td>
            <td>{{ lectura.medidorNombre }}</td>
            <td>{{ tipoLecturaLabel(lectura.tipoLectura) }}</td>
            <td>
              <router-link :to="`/app/lecturas/update/${lectura.id}`" class="btn btn-secondary btn-sm">Editar</router-link>
              <button @click="eliminarLectura(lectura.id)" class="btn btn-danger btn-sm ml-2">Eliminar</button>
            </td>
          </tr>
          <tr v-if="lecturas.length === 0">
            <td colspan="5" class="text-center text-gray-400">No hay lecturas registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import lecturaService from '../../services/lectura.service'

const lecturas = ref([])

const cargarLecturas = async () => {
  lecturas.value = await lecturaService.getLecturas()
}

onMounted(cargarLecturas)

const eliminarLectura = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta lectura?')) {
    await lecturaService.deleteLectura(id)
    await cargarLecturas()
  }
}

const tipoLecturaLabel = (tipo) => {
  switch (tipo) {
    case 'consumo': return 'Consumo';
    case 'presion': return 'Presión';
    case 'caudal': return 'Caudal';
    case 'nivel': return 'Nivel';
    default: return tipo;
  }
}
</script>
<style scoped>
.lectura-list-page {
  max-width: 1200px;
  margin: 40px 15px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
  padding: 32px 24px;
}
.lectura-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.lectura-list-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #23272f;
}
.btn {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
}
.btn-primary {
  background: #0ea5e9;
  color: #fff;
}
.btn-primary:hover {
  background: #0369a1;
}
.btn-secondary {
  background: #e5e7eb;
  color: #23272f;
}
.btn-secondary:hover {
  background: #cbd5e1;
}
.btn-sm {
  padding: 0.3rem 0.8rem;
  font-size: 0.95rem;
}
.lectura-table-container {
  overflow-x: auto;
}
.lectura-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
.lectura-table th, .lectura-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;
  text-align: left;
}
.lectura-table th {
  background: #f8fafc;
  font-weight: 700;
  color: #0ea5e9;
  font-size: 1.05rem;
}
.lectura-table tr:last-child td {
  border-bottom: none;
}
.text-center {
  text-align: center;
}
.text-gray-400 {
  color: #94a3b8;
}
.btn-danger {
  background: #ef4444;
  color: #fff;
}
.btn-danger:hover {
  background: #b91c1c;
}
.ml-2 {
  margin-left: 0.5rem;
}
@media (max-width: 600px) {
  .lectura-list-page {
    padding: 16px 4px;
  }
  .lectura-list-header h1 {
    font-size: 1.3rem;
  }
  .lectura-table th, .lectura-table td {
    padding: 8px 6px;
    font-size: 0.95rem;
  }
}
</style> 