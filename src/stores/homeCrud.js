import { defineStore } from 'pinia';
import { getHomeContent, createHomeContent, updateHomeContent } from '@/services/homeCrud';

export const useHomeCrudStore = defineStore('homeCrud', {
  state: () => ({
    content: null,
    loading: false,
    error: null,
    success: null
  }),
  actions: {
    async fetchHomeContent() {
      this.loading = true;
      this.error = null;
      try {
        this.content = await getHomeContent();
      } catch (e) {
        this.error = 'Error al cargar el contenido';
      } finally {
        this.loading = false;
      }
    },
    async createHomeContent(data) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        this.content = await createHomeContent(data);
        this.success = 'Contenido creado exitosamente';
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async updateHomeContent(data) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        this.content = await updateHomeContent(data);
        this.success = 'Cambios guardados exitosamente';
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    }
  }
});
