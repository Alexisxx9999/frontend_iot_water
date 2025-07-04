<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'Editar Medidor' : 'Agregar Nuevo Medidor' }}</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-section">
          <label>Número de Serie *</label>
          <input v-model="form.serialNumber" required />
        </div>
        <div class="form-section">
          <label>Modelo *</label>
          <input v-model="form.model" required />
        </div>
        <div class="form-section">
          <label>Fabricante *</label>
          <input v-model="form.manufacturer" required />
        </div>
        <div class="form-section">
          <label>Parroquia *</label>
          <select v-model="form.parishId" required>
            <option value="">Seleccionar parroquia</option>
            <option v-for="parish in parishes" :key="parish.id" :value="parish.id">{{ parish.name }}</option>
          </select>
        </div>
        <div class="form-section">
          <label>Dirección</label>
          <input v-model="form.address" />
        </div>
        <div class="form-section">
          <label>Latitud *</label>
          <input v-model.number="form.coordinates[0]" type="number" step="0.000001" required />
        </div>
        <div class="form-section">
          <label>Longitud *</label>
          <input v-model.number="form.coordinates[1]" type="number" step="0.000001" required />
        </div>
        <div class="modal-footer">
          <button type="button" @click="closeModal">Cancelar</button>
          <button type="submit">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed, watch } from 'vue';
import { useMapStore } from '@/stores/map';
export default {
  name: 'MapMeterModal',
  props: {
    isVisible: Boolean,
    meter: Object
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const mapStore = useMapStore();
    const form = reactive({
      serialNumber: '',
      model: '',
      manufacturer: '',
      parishId: '',
      address: '',
      coordinates: [-0.2299, -78.5249]
    });
    const isEditing = computed(() => !!props.meter);
    const parishes = computed(() => mapStore.getParishes);
    watch(() => props.meter, (newMeter) => {
      if (newMeter) Object.assign(form, newMeter);
    }, { immediate: true });
    const handleSubmit = () => {
      emit('saved', { ...form });
      closeModal();
    };
    const closeModal = () => emit('close');
    return { form, parishes, isEditing, handleSubmit, closeModal };
  }
};
</script>
<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; border-radius: 8px; padding: 2rem; min-width: 320px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
.form-section { margin-bottom: 1rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
</style> 