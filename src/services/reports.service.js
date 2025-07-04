import api from './api'

export const reportsService = {
  // Generar reporte
  async generateReport(config) {
    try {
      const response = await api.post('/reports/generate', config)
      return response.data
    } catch (error) {
      console.error('Error generando reporte:', error)
      throw error
    }
  },

  // Guardar configuración de reporte
  async saveReportConfig(config) {
    try {
      const response = await api.post('/reports/config', config)
      return response.data
    } catch (error) {
      console.error('Error guardando configuración de reporte:', error)
      throw error
    }
  },

  // Obtener reportes guardados
  async getSavedReports() {
    try {
      const response = await api.get('/reports/saved')
      return response.data
    } catch (error) {
      console.error('Error obteniendo reportes guardados:', error)
      throw error
    }
  },

  // Eliminar reporte guardado
  async deleteSavedReport(reportId) {
    try {
      const response = await api.delete(`/reports/saved/${reportId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando reporte guardado:', error)
      throw error
    }
  },

  // Exportar reporte
  async exportReport(data, format) {
    try {
      const response = await api.post('/reports/export', {
        data,
        format
      }, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exportando reporte:', error)
      throw error
    }
  },

  // Programar reporte
  async scheduleReport(scheduleConfig) {
    try {
      const response = await api.post('/reports/schedule', scheduleConfig)
      return response.data
    } catch (error) {
      console.error('Error programando reporte:', error)
      throw error
    }
  },

  // Obtener reportes programados
  async getScheduledReports() {
    try {
      const response = await api.get('/reports/scheduled')
      return response.data
    } catch (error) {
      console.error('Error obteniendo reportes programados:', error)
      throw error
    }
  },

  // Actualizar reporte programado
  async updateScheduledReport(scheduleId, config) {
    try {
      const response = await api.put(`/reports/scheduled/${scheduleId}`, config)
      return response.data
    } catch (error) {
      console.error('Error actualizando reporte programado:', error)
      throw error
    }
  },

  // Eliminar reporte programado
  async deleteScheduledReport(scheduleId) {
    try {
      const response = await api.delete(`/reports/scheduled/${scheduleId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando reporte programado:', error)
      throw error
    }
  },

  // Obtener tipos de reporte disponibles
  async getReportTypes() {
    try {
      const response = await api.get('/reports/types')
      return response.data
    } catch (error) {
      console.error('Error obteniendo tipos de reporte:', error)
      throw error
    }
  },

  // Obtener filtros disponibles para un tipo de reporte
  async getReportFilters(reportType) {
    try {
      const response = await api.get(`/reports/filters/${reportType}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo filtros de reporte:', error)
      throw error
    }
  },

  // Obtener columnas disponibles para un tipo de reporte
  async getReportColumns(reportType) {
    try {
      const response = await api.get(`/reports/columns/${reportType}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo columnas de reporte:', error)
      throw error
    }
  },

  // Obtener opciones de agrupamiento para un tipo de reporte
  async getReportGroupingOptions(reportType) {
    try {
      const response = await api.get(`/reports/grouping/${reportType}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo opciones de agrupamiento:', error)
      throw error
    }
  }
}

export default reportsService 