const API_URL = '/api/incidents';

export async function fetchIncidents(params = {}) {
  // params: filtros, paginación, etc.
  // return await fetch(`${API_URL}?${new URLSearchParams(params)}`).then(r => r.json());
  return [];
}

export async function fetchIncidentById(id) {
  // return await fetch(`${API_URL}/${id}`).then(r => r.json());
  return null;
}

export async function createIncident(data) {
  // return await fetch(API_URL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
  return {};
}

export async function updateIncident(id, data) {
  // return await fetch(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
  return {};
}

export async function deleteIncident(id) {
  // return await fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(r => r.json());
  return true;
}

export async function assignTechnician(id, technicianId) {
  // return await fetch(`${API_URL}/${id}/assign`, { method: 'POST', body: JSON.stringify({ technicianId }), headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
  return {};
}

export async function addLogEntry(id, entry) {
  // return await fetch(`${API_URL}/${id}/log`, { method: 'POST', body: JSON.stringify(entry), headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
  return {};
}
