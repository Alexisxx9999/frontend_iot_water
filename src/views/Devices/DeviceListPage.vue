<template>
  <div class="min-h-screen w-full bg-white flex flex-col gap-4 py-4 px-2">
    <!-- Header -->
    <div class="flex items-center justify-between bg-gradient-to-r from-blue-800 to-cyan-600 rounded-xl shadow p-6 mb-4">
      <div>
        <h1 class="text-3xl font-bold text-white flex items-center gap-2">
          Gestión de Dispositivos
          <span class="bg-cyan-700 text-white px-3 py-1 rounded-lg text-lg font-semibold ml-2">LoRaWAN</span>
        </h1>
        <p class="text-blue-100 mt-1">Administre todos los elementos de su red IoT</p>
      </div>
      <div class="flex gap-2">
        <button @click="actualizarLista" class="px-4 py-2 bg-white text-blue-800 font-semibold rounded border border-blue-200 shadow hover:bg-blue-50 flex items-center gap-2 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582a1.5 1.5 0 001.415-1.415V4h5V2H4a2 2 0 00-2 2v7h2V4z" /></svg>
          Actualizar
        </button>
        <button @click="abrirModalAgregar" class="px-4 py-2 bg-cyan-700 text-white font-semibold rounded shadow hover:bg-cyan-800 flex items-center gap-2 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Agregar Dispositivo
        </button>
      </div>
    </div>
    <!-- Feedback visual -->
    <div v-if="mensaje" class="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-pop">{{ mensaje }}</div>
    <!-- Modal Agregar -->
    <div v-if="modalAgregar" class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-blue-800">Agregar Dispositivo</h2>
        <form @submit.prevent="guardarNuevo">
          <div class="mb-2">
            <label class="block text-sm font-semibold">Nombre</label>
            <input v-model="nuevo.nombre" required class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Número de Serie</label>
            <input v-model="nuevo.numeroSerie" required class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Tipo</label>
            <select v-model="nuevo.tipo" required class="w-full border border-gray-300 rounded px-2 py-1">
              <option value="Medidor">Medidor</option>
              <option value="Válvula">Válvula</option>
              <option value="Gateway">Gateway</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Modelo</label>
            <input v-model="nuevo.modelo" class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Estado</label>
            <select v-model="nuevo.estado" required class="w-full border border-gray-300 rounded px-2 py-1">
              <option value="Activo">Activo</option>
              <option value="Inestable">Inestable</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Sector</label>
            <input v-model="nuevo.sector" class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="cerrarModalAgregar" class="px-3 py-1 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" class="px-3 py-1 bg-cyan-700 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal Editar -->
    <div v-if="modalEditar" class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-blue-800">Editar Dispositivo</h2>
        <form @submit.prevent="guardarEdicion">
          <div class="mb-2">
            <label class="block text-sm font-semibold">Nombre</label>
            <input v-model="editando.nombre" required class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Número de Serie</label>
            <input v-model="editando.numeroSerie" required class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Tipo</label>
            <select v-model="editando.tipo" required class="w-full border border-gray-300 rounded px-2 py-1">
              <option value="Medidor">Medidor</option>
              <option value="Válvula">Válvula</option>
              <option value="Gateway">Gateway</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Modelo</label>
            <input v-model="editando.modelo" class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Estado</label>
            <select v-model="editando.estado" required class="w-full border border-gray-300 rounded px-2 py-1">
              <option value="Activo">Activo</option>
              <option value="Inestable">Inestable</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold">Sector</label>
            <input v-model="editando.sector" class="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="cerrarModalEditar" class="px-3 py-1 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" class="px-3 py-1 bg-cyan-700 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
    <div class="flex flex-1 gap-6">
      <!-- Sidebar: Lista de dispositivos -->
      <div class="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-2">
        <div class="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 border border-blue-100">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-blue-900">Dispositivos Conectados</span>
            <span class="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded">1,248</span>
          </div>
          <div class="flex gap-2 mb-2">
            <select v-model="filtroTipo" class="rounded border border-blue-200 px-2 py-1 text-sm bg-white">
              <option value="">Todos</option>
              <option value="Medidor">Medidores</option>
              <option value="Válvula">Válvulas</option>
              <option value="Gateway">Gateways</option>
            </select>
            <select v-model="filtroEstado" class="rounded border border-blue-200 px-2 py-1 text-sm bg-white">
              <option value="">Todos</option>
              <option value="Activo">Activos</option>
              <option value="Inestable">Inestables</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          </div>
          <div class="relative mb-2">
            <input v-model="busqueda" type="text" placeholder="Buscar dispositivos..." class="w-full rounded border border-blue-200 px-2 py-1 text-sm pr-8 bg-white" />
            <svg class="absolute right-2 top-2 h-4 w-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/></svg>
          </div>
          <div class="flex-1 overflow-y-auto max-h-[420px] custom-scrollbar">
            <div v-for="d in dispositivosFiltrados" :key="d.id" @click="seleccionarDispositivo(d)" :class="['rounded-xl p-3 mb-2 cursor-pointer flex flex-col gap-1 shadow-sm border transition', d.id === seleccionado.id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white hover:bg-blue-50 border-blue-100']">
              <div class="flex items-center gap-2">
                <span v-if="d.tipo==='Medidor'" class="text-2xl">💧</span>
                <span v-else-if="d.tipo==='Válvula'" class="text-2xl">🔧</span>
                <span v-else class="text-2xl">📡</span>
                <span class="font-bold">{{ d.nombre }}</span>
                <span class="ml-auto text-xs font-semibold" :class="d.estadoColor">{{ d.sector }}</span>
              </div>
              <div class="text-xs">SN: {{ d.numeroSerie }}</div>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="d.bajoMonitoreo" class="bg-cyan-100 text-cyan-800 text-xs px-2 py-0.5 rounded">Bajo monitoreo</span>
                <span v-if="d.estadoBadge" :class="d.estadoBadge.class">{{ d.estadoBadge.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Panel de detalle -->
      <div class="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-2">
        <div class="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-4 border border-blue-100">
          <div class="flex items-center gap-2 mb-2">
            <span class="font-bold text-xl text-blue-900">{{ seleccionado.nombre }}</span>
            <span class="text-xs text-blue-700">{{ seleccionado.numeroSerie }}</span>
            <span v-if="seleccionado.estado==='Conectado' || seleccionado.estado==='Activo'" class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded ml-2">Conectado</span>
            <span v-if="seleccionado.estado==='Inestable'" class="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded ml-2">Inestable</span>
            <span v-if="seleccionado.estado==='Inactivo'" class="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded ml-2">Inactivo</span>
            <button class="ml-auto px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 text-xs font-semibold transition" @click="abrirModalEditar(seleccionado)">Editar</button>
            <button class="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold transition">Eliminar</button>
          </div>
          <!-- Tabs -->
          <div class="flex gap-4 border-b border-blue-100 mb-2">
            <button v-for="tab in tabs" :key="tab" @click="tabSeleccionado = tab" :class="['pb-2 px-2 font-semibold transition', tabSeleccionado === tab ? 'border-b-2 border-cyan-700 text-cyan-800' : 'text-blue-700 hover:text-cyan-700']">{{ tab }}</button>
          </div>
          <div v-if="tabSeleccionado==='Detalles'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Información básica -->
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <h3 class="font-bold text-blue-800 mb-2">Información Básica</h3>
              <div class="text-sm mb-1"><b>Número de Serie:</b> {{ seleccionado.numeroSerie }}</div>
              <div class="text-sm mb-1"><b>Tipo:</b> {{ seleccionado.tipo }}</div>
              <div class="text-sm mb-1"><b>Modelo:</b> {{ seleccionado.modelo }}</div>
              <div class="text-sm mb-1"><b>Fabricante:</b> {{ seleccionado.fabricante }}</div>
              <div class="text-sm mb-1"><b>Fecha Instalación:</b> {{ seleccionado.fechaInstalacion }}</div>
              <div class="text-sm mb-1"><b>Estado:</b> <span :class="seleccionado.estadoColor">{{ seleccionado.estado }}</span></div>
              <div class="text-sm mb-1"><b>Batería:</b> {{ seleccionado.nivelBateria }}% ~2 años restantes</div>
              <div class="text-sm mb-1"><b>Señal LoRa:</b> {{ seleccionado.senalLoRa }}</div>
              <div class="text-sm mb-1"><b>Última Comunicación:</b> {{ seleccionado.ultimaComunicacion }}</div>
            </div>
            <!-- Ubicación y asignación -->
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <h3 class="font-bold text-blue-800 mb-2">Ubicación y Asignación</h3>
              <div class="text-sm mb-1"><b>Sector:</b> {{ seleccionado.sector }}</div>
              <div class="text-sm mb-1"><b>Dirección:</b> {{ seleccionado.direccion }}</div>
              <div class="text-sm mb-1"><b>Cliente Asociado:</b> {{ seleccionado.clienteAsociado }}</div>
              <div class="text-sm mb-1"><b>Gateway Principal:</b> {{ seleccionado.gatewayPrincipal }}</div>
              <div class="text-sm mb-1"><b>Coordenadas:</b> {{ seleccionado.latitud }}, {{ seleccionado.longitud }}</div>
            </div>
            <!-- Configuración -->
            <div class="md:col-span-2 bg-white rounded-xl p-4 border border-gray-100">
              <h3 class="font-bold text-blue-800 mb-2">Configuración</h3>
              <div class="text-sm mb-1"><b>Frecuencia Reporte:</b> {{ seleccionado.frecuenciaReporte }}</div>
              <div class="text-sm mb-1"><b>Umbral Alerta:</b> {{ seleccionado.umbralAlerta }}</div>
              <div class="text-sm mb-1"><b>Versión Firmware:</b> {{ seleccionado.versionFirmware }} <span v-if="seleccionado.firmwareActualizacion" class="bg-yellow-200 text-yellow-900 text-xs px-2 py-0.5 rounded ml-2">Actualización disponible</span></div>
              <div class="text-sm mb-1"><b>Configuración Personalizada:</b> <button class="ml-2 px-2 py-0.5 bg-cyan-700 text-white rounded text-xs">Ver Parámetros</button></div>
            </div>
          </div>
          <div v-else-if="tabSeleccionado==='Mantenimiento'">
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <h3 class="font-bold text-blue-800 mb-2">Historial de Mantenimientos</h3>
              <div class="text-sm text-blue-700">(Simulación de historial...)</div>
            </div>
          </div>
          <div v-else-if="tabSeleccionado==='Logs Técnicos'">
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <h3 class="font-bold text-blue-800 mb-2">Logs Técnicos</h3>
              <div class="text-sm text-blue-700">(Simulación de logs...)</div>
            </div>
          </div>
          <div v-else-if="tabSeleccionado==='Ubicación'">
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <h3 class="font-bold text-blue-800 mb-2">Ubicación</h3>
              <div class="text-sm text-blue-700">(Simulación de mapa o coordenadas...)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = ['Detalles', 'Mantenimiento', 'Logs Técnicos', 'Ubicación']
const tabSeleccionado = ref('Detalles')
const filtroTipo = ref('')
const filtroEstado = ref('')
const busqueda = ref('')

const dispositivos = ref([
  {
    id: 1,
    nombre: 'Medidor #WTR-4587-23',
    numeroSerie: 'LORA-MD-7845-2294',
    tipo: 'Medidor',
    modelo: 'AquaMeasure Pro X2',
    fabricante: 'HydroTech Solutions',
    fechaInstalacion: '15/03/2023',
    estado: 'Activo',
    estadoColor: 'text-green-700',
    estadoBadge: { text: 'Bajo monitoreo', class: 'bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded' },
    nivelBateria: 78,
    senalLoRa: 'Buena (RSSI: -87 dBm)',
    ultimaComunicacion: 'Hoy, 10:24 AM',
    sector: 'Sector Norte',
    direccion: 'Calle Principal #123, Manzana 5',
    clienteAsociado: 'Juan López (ID: 458792)',
    gatewayPrincipal: 'GTW-0012-45 (Torre Este)',
    latitud: '12.3456° N',
    longitud: '45.6789° W',
    frecuenciaReporte: '1 hora',
    umbralAlerta: '50 m³/día',
    versionFirmware: 'v2.4.1',
    firmwareActualizacion: true,
    configuracionPersonalizada: '{}',
    bajoMonitoreo: true,
  },
  {
    id: 2,
    nombre: 'Válvula #VLV-1254-87',
    numeroSerie: 'LORA-VL-4512-8874',
    tipo: 'Válvula',
    modelo: 'ValveX 200',
    fabricante: 'ValveTech',
    fechaInstalacion: '10/01/2022',
    estado: 'Inestable',
    estadoColor: 'text-yellow-700',
    estadoBadge: { text: 'En revisión', class: 'bg-yellow-200 text-yellow-900 text-xs px-2 py-0.5 rounded' },
    nivelBateria: 55,
    senalLoRa: 'Media (RSSI: -100 dBm)',
    ultimaComunicacion: 'Ayer, 18:00',
    sector: 'Sector Centro',
    direccion: 'Av. Central 456',
    clienteAsociado: 'Sin asignar',
    gatewayPrincipal: 'GTW-0012-45 (Torre Este)',
    latitud: '12.3400° N',
    longitud: '45.6700° W',
    frecuenciaReporte: '2 horas',
    umbralAlerta: '30 m³/día',
    versionFirmware: 'v2.3.0',
    firmwareActualizacion: false,
    configuracionPersonalizada: '{}',
    bajoMonitoreo: false,
  },
  {
    id: 3,
    nombre: 'Gateway #GTW-0012-45',
    numeroSerie: 'LORA-GW-0012-4578',
    tipo: 'Gateway',
    modelo: 'LoRaGate Pro',
    fabricante: 'GatewayCorp',
    fechaInstalacion: '01/12/2021',
    estado: 'Activo',
    estadoColor: 'text-green-700',
    estadoBadge: null,
    nivelBateria: null,
    senalLoRa: 'Excelente (RSSI: -70 dBm)',
    ultimaComunicacion: 'Hoy, 09:00 AM',
    sector: 'Torre Este',
    direccion: 'Torre Este, Piso 1',
    clienteAsociado: 'Sin asignar',
    gatewayPrincipal: '-',
    latitud: '12.3500° N',
    longitud: '45.6800° W',
    frecuenciaReporte: '-',
    umbralAlerta: '-',
    versionFirmware: 'v1.9.8',
    firmwareActualizacion: false,
    configuracionPersonalizada: '{}',
    bajoMonitoreo: false,
  },
  {
    id: 4,
    nombre: 'Medidor #WTR-7845-12',
    numeroSerie: 'LORA-MD-7845-1234',
    tipo: 'Medidor',
    modelo: 'AquaMeasure Pro X1',
    fabricante: 'HydroTech Solutions',
    fechaInstalacion: '20/07/2022',
    estado: 'Inactivo',
    estadoColor: 'text-red-700',
    estadoBadge: { text: 'Reemplazado', class: 'bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded' },
    nivelBateria: 0,
    senalLoRa: 'Sin señal',
    ultimaComunicacion: 'Hace 5 días',
    sector: 'Sector Sur',
    direccion: 'Calle Sur 789',
    clienteAsociado: 'Sin asignar',
    gatewayPrincipal: 'GTW-0012-45 (Torre Este)',
    latitud: '12.3200° N',
    longitud: '45.6600° W',
    frecuenciaReporte: '1 día',
    umbralAlerta: '60 m³/día',
    versionFirmware: 'v2.0.0',
    firmwareActualizacion: false,
    configuracionPersonalizada: '{}',
    bajoMonitoreo: false,
  },
  {
    id: 5,
    nombre: 'Válvula #VLV-7845-32',
    numeroSerie: 'LORA-VL-7845-3298',
    tipo: 'Válvula',
    modelo: 'ValveX 100',
    fabricante: 'ValveTech',
    fechaInstalacion: '05/11/2021',
    estado: 'Activo',
    estadoColor: 'text-green-700',
    estadoBadge: null,
    nivelBateria: 90,
    senalLoRa: 'Buena (RSSI: -85 dBm)',
    ultimaComunicacion: 'Hoy, 11:00 AM',
    sector: 'Sector Oeste',
    direccion: 'Av. Oeste 321',
    clienteAsociado: 'Sin asignar',
    gatewayPrincipal: 'GTW-0012-45 (Torre Este)',
    latitud: '12.3100° N',
    longitud: '45.6500° W',
    frecuenciaReporte: '3 horas',
    umbralAlerta: '40 m³/día',
    versionFirmware: 'v2.1.0',
    firmwareActualizacion: false,
    configuracionPersonalizada: '{}',
    bajoMonitoreo: false,
  },
])

const seleccionado = ref(dispositivos.value[0])

const dispositivosFiltrados = computed(() => {
  return dispositivos.value.filter(d => {
    const tipoOk = !filtroTipo.value || d.tipo === filtroTipo.value
    const estadoOk = !filtroEstado.value || d.estado === filtroEstado.value
    const busquedaOk = !busqueda.value || d.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) || d.numeroSerie.toLowerCase().includes(busqueda.value.toLowerCase())
    return tipoOk && estadoOk && busquedaOk
  })
})

function seleccionarDispositivo(d) {
  seleccionado.value = d
  tabSeleccionado.value = 'Detalles'
}

const modalAgregar = ref(false)
const modalEditar = ref(false)
const mensaje = ref('')
const nuevo = ref({ nombre: '', numeroSerie: '', tipo: 'Medidor', modelo: '', estado: 'Activo', sector: '' })
const editando = ref({})

function abrirModalAgregar() {
  Object.assign(nuevo.value, { nombre: '', numeroSerie: '', tipo: 'Medidor', modelo: '', estado: 'Activo', sector: '' })
  modalAgregar.value = true
}
function cerrarModalAgregar() { modalAgregar.value = false }
function guardarNuevo() {
  const id = Date.now()
  dispositivos.value.push({ ...nuevo.value, id, estadoColor: 'text-green-700', estadoBadge: null })
  modalAgregar.value = false
  mensaje.value = '¡Dispositivo agregado!'
  setTimeout(() => mensaje.value = '', 2000)
}
function abrirModalEditar(d) {
  editando.value = { ...d }
  modalEditar.value = true
}
function cerrarModalEditar() { modalEditar.value = false }
function guardarEdicion() {
  const idx = dispositivos.value.findIndex(d => d.id === editando.value.id)
  if (idx !== -1) {
    dispositivos.value[idx] = { ...editando.value, estadoColor: 'text-green-700', estadoBadge: null }
    seleccionado.value = dispositivos.value[idx]
  }
  modalEditar.value = false
  mensaje.value = '¡Dispositivo editado!'
  setTimeout(() => mensaje.value = '', 2000)
}
function actualizarLista() {
  mensaje.value = '¡Lista actualizada!'
  setTimeout(() => mensaje.value = '', 1500)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #b2ebf2;
  border-radius: 4px;
}
</style>
