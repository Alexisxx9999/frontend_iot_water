<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ device?.serialNumber || 'Cargando...' }}
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                {{ device?.type }} - {{ device?.model }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="openMaintenanceModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Mantenimiento
            </button>
            <button
              @click="editDevice"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Cargando dispositivo...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Error al cargar dispositivo</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <button
            @click="loadDevice"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>

      <!-- Device Content -->
      <div v-else-if="device" class="space-y-6">
        <!-- Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Estado</dt>
                    <dd class="text-lg font-medium text-gray-900">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusBadgeClass(device.status)">
                        {{ DEVICE_STATUS[device.status] || device.status }}
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Batería</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ device.batteryLevel || 0 }}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Señal LoRa</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ device.loraSignal || 'N/A' }} dBm</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Última Comunicación</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatLastCommunication(device.lastCommunication) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white shadow rounded-lg">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- Información Tab -->
            <div v-if="activeTab === 'info'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Información Básica -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
                  <dl class="space-y-3">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Número de Serie</dt>
                      <dd class="text-sm text-gray-900">{{ device.serialNumber }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Tipo</dt>
                      <dd class="text-sm text-gray-900">{{ DEVICE_TYPES[device.type] || device.type }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Modelo</dt>
                      <dd class="text-sm text-gray-900">{{ device.model }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Fabricante</dt>
                      <dd class="text-sm text-gray-900">{{ device.manufacturer }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Fecha de Instalación</dt>
                      <dd class="text-sm text-gray-900">{{ formatDate(device.installationDate) }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Configuración -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
                  <dl class="space-y-3">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Frecuencia de Reporte</dt>
                      <dd class="text-sm text-gray-900">{{ device.reportFrequency || 'N/A' }} minutos</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Umbral de Alerta</dt>
                      <dd class="text-sm text-gray-900">{{ device.alertThreshold || 'N/A' }}%</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Versión de Firmware</dt>
                      <dd class="text-sm text-gray-900">{{ device.firmwareVersion || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Gateway Principal</dt>
                      <dd class="text-sm text-gray-900">{{ device.gateway?.name || 'Sin asignar' }}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <!-- Ubicación -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Ubicación</h3>
                <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Sector</dt>
                    <dd class="text-sm text-gray-900">{{ device.sector?.name || 'Sin asignar' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd class="text-sm text-gray-900">{{ device.address || 'No especificada' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Coordenadas</dt>
                    <dd class="text-sm text-gray-900">
                      {{ device.latitude && device.longitude ? `${device.latitude}, ${device.longitude}` : 'No especificadas' }}
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Cliente Asociado -->
              <div v-if="device.client">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Cliente Asociado</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Nombre</dt>
                    <dd class="text-sm text-gray-900">{{ device.client.name }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="text-sm text-gray-900">{{ device.client.email }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd class="text-sm text-gray-900">{{ device.client.phone }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Mantenimiento Tab -->
            <div v-if="activeTab === 'maintenance'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Historial de Mantenimientos</h3>
                <button
                  @click="openMaintenanceModal"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Nuevo Mantenimiento
                </button>
              </div>

              <div v-if="maintenanceLoading" class="flex items-center justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <div v-else-if="maintenance.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay mantenimientos</h3>
                <p class="mt-1 text-sm text-gray-500">Aún no se han registrado mantenimientos para este dispositivo.</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="item in maintenance"
                  :key="item.id"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="getMaintenanceTypeClass(item.type)">
                          {{ MAINTENANCE_TYPES[item.type] || item.type }}
                        </span>
                        <span class="text-sm text-gray-500">{{ formatDate(item.date) }}</span>
                      </div>
                      <h4 class="font-medium text-gray-900">{{ item.description }}</h4>
                      <p class="text-sm text-gray-600 mt-1">{{ item.technician }}</p>
                      <div class="mt-2 text-sm text-gray-500">
                        <span>Duración: {{ item.duration }}h</span>
                        <span v-if="item.cost" class="ml-4">Costo: ${{ item.cost }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Logs Tab -->
            <div v-if="activeTab === 'logs'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Logs Técnicos</h3>
                <div class="flex space-x-2">
                  <select
                    v-model="logFilter"
                    @change="loadLogs"
                    class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los tipos</option>
                    <option v-for="(label, key) in LOG_TYPES" :key="key" :value="key">
                      {{ label }}
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="logsLoading" class="flex items-center justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <div v-else-if="logs.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay logs</h3>
                <p class="mt-1 text-sm text-gray-500">Aún no se han registrado logs para este dispositivo.</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="log in logs"
                  :key="log.id"
                  class="border-l-4 border-gray-200 pl-4 py-2"
                  :class="getLogBorderClass(log.type)"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="getLogTypeClass(log.type)">
                          {{ LOG_TYPES[log.type] || log.type }}
                        </span>
                        <span class="text-sm text-gray-500">{{ formatDateTime(log.timestamp) }}</span>
                      </div>
                      <p class="text-sm text-gray-900">{{ log.message }}</p>
                      <p v-if="log.details" class="text-sm text-gray-600 mt-1">{{ log.details }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ubicación Tab -->
            <div v-if="activeTab === 'location'" class="space-y-6">
              <h3 class="text-lg font-medium text-gray-900">Ubicación en Mapa</h3>
              
              <div v-if="device.latitude && device.longitude" class="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">Mapa interactivo</p>
                  <p class="text-xs text-gray-400">Coordenadas: {{ device.latitude }}, {{ device.longitude }}</p>
                </div>
              </div>

              <div v-else class="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Sin ubicación</h3>
                  <p class="mt-1 text-sm text-gray-500">No se han configurado coordenadas para este dispositivo.</p>
                </div>
              </div>

              <!-- Estadísticas de la Zona -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <dt class="text-sm font-medium text-gray-500">Dispositivos en Sector</dt>
                  <dd class="text-2xl font-bold text-gray-900">{{ zoneStats.devicesInSector || 0 }}</dd>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <dt class="text-sm font-medium text-gray-500">Activos</dt>
                  <dd class="text-2xl font-bold text-green-600">{{ zoneStats.active || 0 }}</dd>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <dt class="text-sm font-medium text-gray-500">Con Alertas</dt>
                  <dd class="text-2xl font-bold text-red-600">{{ zoneStats.withAlerts || 0 }}</dd>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <dt class="text-sm font-medium text-gray-500">Consumo Promedio</dt>
                  <dd class="text-2xl font-bold text-blue-600">{{ zoneStats.avgConsumption || 0 }} L</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <DeviceModal
      :is-open="showDeviceModal"
      :device="device"
      @close="closeDeviceModal"
      @saved="handleDeviceSaved"
    />

    <MaintenanceModal
      :is-open="showMaintenanceModal"
      :device="device"
      @close="closeMaintenanceModal"
      @saved="handleMaintenanceSaved"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDevicesStore } from '@/stores/devices'
import DeviceModal from '@/components/devices/DeviceModal.vue'
import MaintenanceModal from '@/components/devices/MaintenanceModal.vue'

export default {
  name: 'DeviceDetailPage',
  components: {
    DeviceModal,
    MaintenanceModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const devicesStore = useDevicesStore()
    
    // Estado local
    const loading = ref(false)
    const error = ref(null)
    const activeTab = ref('info')
    const maintenanceLoading = ref(false)
    const logsLoading = ref(false)
    const logFilter = ref('')
    
    // Modales
    const showDeviceModal = ref(false)
    const showMaintenanceModal = ref(false)
    
    // Estadísticas de zona
    const zoneStats = ref({
      devicesInSector: 0,
      active: 0,
      withAlerts: 0,
      avgConsumption: 0
    })

    // Tabs
    const tabs = [
      { id: 'info', name: 'Información' },
      { id: 'maintenance', name: 'Mantenimiento' },
      { id: 'logs', name: 'Logs Técnicos' },
      { id: 'location', name: 'Ubicación' }
    ]

    // Computed
    const device = computed(() => devicesStore.getCurrentDevice)
    const maintenance = computed(() => devicesStore.getDeviceMaintenance)
    const logs = computed(() => devicesStore.getDeviceLogs)
    const { DEVICE_TYPES, DEVICE_STATUS, MAINTENANCE_TYPES, LOG_TYPES } = devicesStore

    // Métodos
    const loadDevice = async () => {
      if (!route.params.id) return
      
      loading.value = true
      error.value = null
      
      try {
        await devicesStore.fetchDeviceById(route.params.id)
      } catch (err) {
        error.value = err.message || 'Error al cargar dispositivo'
      } finally {
        loading.value = false
      }
    }

    const loadMaintenance = async () => {
      if (!device.value?.id) return
      
      maintenanceLoading.value = true
      try {
        await devicesStore.fetchDeviceMaintenance(device.value.id)
      } catch (err) {
        console.error('Error loading maintenance:', err)
      } finally {
        maintenanceLoading.value = false
      }
    }

    const loadLogs = async () => {
      if (!device.value?.id) return
      
      logsLoading.value = true
      try {
        await devicesStore.fetchDeviceLogs(device.value.id, { type: logFilter.value })
      } catch (err) {
        console.error('Error loading logs:', err)
      } finally {
        logsLoading.value = false
      }
    }

    const loadZoneStats = async () => {
      if (!device.value?.sectorId) return
      
      try {
        // Simular estadísticas de zona
        zoneStats.value = {
          devicesInSector: Math.floor(Math.random() * 50) + 10,
          active: Math.floor(Math.random() * 40) + 5,
          withAlerts: Math.floor(Math.random() * 10),
          avgConsumption: Math.floor(Math.random() * 1000) + 100
        }
      } catch (err) {
        console.error('Error loading zone stats:', err)
      }
    }

    // Acciones de dispositivos
    const editDevice = () => {
      showDeviceModal.value = true
    }

    const openMaintenanceModal = () => {
      showMaintenanceModal.value = true
    }

    const closeDeviceModal = () => {
      showDeviceModal.value = false
    }

    const closeMaintenanceModal = () => {
      showMaintenanceModal.value = false
    }

    const handleDeviceSaved = () => {
      loadDevice()
    }

    const handleMaintenanceSaved = () => {
      loadMaintenance()
    }

    // Utilidades
    const getStatusBadgeClass = (status) => {
      const classes = {
        ACTIVO: 'bg-green-100 text-green-800',
        INACTIVO: 'bg-gray-100 text-gray-800',
        MANTENIMIENTO: 'bg-yellow-100 text-yellow-800',
        FALLA: 'bg-red-100 text-red-800',
        DESCONECTADO: 'bg-orange-100 text-orange-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getMaintenanceTypeClass = (type) => {
      const classes = {
        PREVENTIVO: 'bg-blue-100 text-blue-800',
        CORRECTIVO: 'bg-red-100 text-red-800',
        CALIBRACION: 'bg-yellow-100 text-yellow-800',
        ACTUALIZACION: 'bg-purple-100 text-purple-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }

    const getLogTypeClass = (type) => {
      const classes = {
        ALERTA: 'bg-red-100 text-red-800',
        COMUNICACION: 'bg-blue-100 text-blue-800',
        CONFIGURACION: 'bg-green-100 text-green-800',
        ERROR: 'bg-red-100 text-red-800',
        MANTENIMIENTO: 'bg-yellow-100 text-yellow-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }

    const getLogBorderClass = (type) => {
      const classes = {
        ALERTA: 'border-red-400',
        COMUNICACION: 'border-blue-400',
        CONFIGURACION: 'border-green-400',
        ERROR: 'border-red-400',
        MANTENIMIENTO: 'border-yellow-400'
      }
      return classes[type] || 'border-gray-400'
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-ES')
    }

    const formatDateTime = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleString('es-ES')
    }

    const formatLastCommunication = (date) => {
      if (!date) return 'Nunca'
      
      const now = new Date()
      const lastComm = new Date(date)
      const diffMs = now - lastComm
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'Ahora'
      if (diffMins < 60) return `${diffMins}m`
      if (diffHours < 24) return `${diffHours}h`
      return `${diffDays}d`
    }

    // Watchers
    watch(() => route.params.id, () => {
      if (route.params.id) {
        loadDevice()
      }
    })

    watch(() => device.value, (newDevice) => {
      if (newDevice) {
        loadMaintenance()
        loadLogs()
        loadZoneStats()
      }
    })

    // Lifecycle
    onMounted(() => {
      loadDevice()
    })

    return {
      // Estado
      loading,
      error,
      activeTab,
      maintenanceLoading,
      logsLoading,
      logFilter,
      showDeviceModal,
      showMaintenanceModal,
      zoneStats,
      
      // Computed
      device,
      maintenance,
      logs,
      tabs,
      DEVICE_TYPES,
      DEVICE_STATUS,
      MAINTENANCE_TYPES,
      LOG_TYPES,
      
      // Métodos
      loadDevice,
      loadMaintenance,
      loadLogs,
      editDevice,
      openMaintenanceModal,
      closeDeviceModal,
      closeMaintenanceModal,
      handleDeviceSaved,
      handleMaintenanceSaved,
      getStatusBadgeClass,
      getMaintenanceTypeClass,
      getLogTypeClass,
      getLogBorderClass,
      formatDate,
      formatDateTime,
      formatLastCommunication
    }
  }
}
</script> 