import axios from 'axios';

// Datos mock en memoria
let nodes = [
  {
    id: 1,
    codigo: 'NODO-001',
    tipo: 'Sensor de Temperatura',
    fechaInstalacion: '2024-01-01',
    bateria: 85,
    activo: true
  },
  {
    id: 2,
    codigo: 'NODO-002',
    tipo: 'Actuador de Riego',
    fechaInstalacion: '2024-02-15',
    bateria: 60,
    activo: false
  }
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const nodeService = {
  async getAllNodes() {
    await delay(300); // Simula latencia
    // Aquí puedes usar axios.get('/api/nodes') en el futuro
    return [...nodes];
  },
  async getNodeById(id) {
    await delay(200);
    return nodes.find(n => n.id === Number(id)) || null;
  },
  async createNode(data) {
    await delay(300);
    const newId = nodes.length ? Math.max(...nodes.map(n => n.id)) + 1 : 1;
    const newNode = { ...data, id: newId };
    nodes.push(newNode);
    return newNode;
  },
  async updateNode(id, data) {
    await delay(300);
    const idx = nodes.findIndex(n => n.id === Number(id));
    if (idx !== -1) {
      nodes[idx] = { ...nodes[idx], ...data };
      return nodes[idx];
    }
    throw new Error('Nodo no encontrado');
  },
  async deleteNode(id) {
    await delay(200);
    nodes = nodes.filter(n => n.id !== Number(id));
    return true;
  },
  async activateNode(id) {
    await delay(200);
    const node = nodes.find(n => n.id === Number(id));
    if (node) node.activo = true;
    return node;
  },
  async deactivateNode(id) {
    await delay(200);
    const node = nodes.find(n => n.id === Number(id));
    if (node) node.activo = false;
    return node;
  },
  generateNodeCode() {
    // Genera un código tipo NODO-00X
    const next = nodes.length ? Math.max(...nodes.map(n => parseInt(n.codigo.replace('NODO-', '')))) + 1 : 1;
    return `NODO-${String(next).padStart(3, '0')}`;
  }
}; 