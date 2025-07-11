// Servicio simulado para HomeCrud
let homeContent = null;

export function getHomeContent() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(homeContent);
    }, 500);
  });
}

export function createHomeContent(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data.nombre) {
        reject({ nombre: 'El nombre es obligatorio' });
      } else {
        homeContent = { ...data };
        resolve(homeContent);
      }
    }, 500);
  });
}

export function updateHomeContent(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data.nombre) {
        reject({ nombre: 'El nombre es obligatorio' });
      } else {
        homeContent = { ...data };
        resolve(homeContent);
      }
    }, 500);
  });
}
