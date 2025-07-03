<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Eliminar Medidor</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <p>¿Está seguro que desea eliminar este medidor? Esta acción no se puede deshacer.</p>
        <div class="modal-footer">
          <button type="button" @click="closeModal">Cancelar</button>
          <button type="button" @click="handleDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DeleteMeterModal',
  props: {
    isVisible: Boolean,
    meter: Object
  },
  emits: ['close', 'deleted'],
  setup(props, { emit }) {
    const handleDelete = () => emit('deleted', props.meter?.id);
    const closeModal = () => emit('close');
    return { handleDelete, closeModal };
  }
};
</script>
<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; border-radius: 8px; padding: 2rem; min-width: 320px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
.modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
</style> 