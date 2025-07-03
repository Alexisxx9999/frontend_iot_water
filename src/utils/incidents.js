export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function getPriorityLabel(priority) {
  const map = {
    critico: 'Crítico',
    alto: 'Alto',
    medio: 'Medio',
    bajo: 'Bajo'
  };
  return map[priority] || priority;
}

export function getStatusLabel(status) {
  const map = {
    Abierto: 'Abierto',
    'En Proceso': 'En Proceso',
    Resuelto: 'Resuelto',
    Cerrado: 'Cerrado'
  };
  return map[status] || status;
} 