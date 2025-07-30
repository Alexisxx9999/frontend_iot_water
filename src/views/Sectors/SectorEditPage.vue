<template>
  <div class="role-edit sector-edit">
    <div class="institutional-video-banner">
      <video
        class="banner-video"
        autoplay
        loop
        muted
        playsinline
        poster="/src/assets/images/logo.png"
      >
        <source src="/videos/istockphoto-1438537439-640_adpp_is.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <div class="banner-overlay"></div>
      <div class="banner-caption">
        <h2>Editar Sector</h2>
        <p>Modifica la información del sector seleccionado</p>
      </div>
    </div>

    <div class="header">
      <h1>
        <font-awesome-icon :icon="['fas', 'edit']" />
        Editar Sector
      </h1>
      <router-link to="/app/sectors" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        Volver
      </router-link>
    </div>

    <LoadingSpinner v-if="loading" message="Cargando información del sector..." />

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadSector" class="btn btn-submit" style="margin-top: 1rem;">
        <font-awesome-icon :icon="['fas', 'redo-alt']" /> Intentar de nuevo
      </button>
    </div>

    <div v-else-if="form" class="content">
      <div class="form-container">
        <form @submit.prevent="handleSubmit" class="role-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nombreSector" class="form-label">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" /> Nombre del Sector *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'edit']" /></span>
                <input
                  id="nombreSector"
                  v-model="form.nombreSector"
                  type="text"
                  class="form-input"
                  placeholder="Ej: Centro Histórico"
                  @blur="validateField('nombreSector')"
                  :class="{ 'input-error': errors.nombreSector }"
                  autocomplete="off"
                  required
                />
              </div>
              <small v-if="errors.nombreSector" class="form-help" style="color:#ef4444;">
                {{ errors.nombreSector }}
              </small>
            </div>

            <div class="form-group">
              <label for="codigoPostalSector" class="form-label">
                <font-awesome-icon :icon="['fas', 'barcode']" /> Código Postal *
              </label>
              <div class="input-icon-group">
                <span class="input-icon"><font-awesome-icon :icon="['fas', 'hashtag']" /></span>
                <input
                  id="codigoPostalSector"
                  v-model="form.codigoPostalSector"
                  type="text"
                  maxlength="6"
                  class="form-input"
                  placeholder="Ej: 170101"
                  @blur="validateField('codigoPostalSector')"
                  :class="{ 'input-error': errors.codigoPostalSector }"
                  autocomplete="off"
                  required
                />
              </div>
              <small v-if="errors.codigoPostalSector" class="form-help" style="color:#ef4444;">
                {{ errors.codigoPostalSector }}
              </small>
            </div>
          </div>

          <div class="form-group">
            <label for="descripcionSector" class="form-label">
              <font-awesome-icon :icon="['fas', 'align-left']" /> Descripción *
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'comment']" /></span>
              <textarea
                id="descripcionSector"
                v-model="form.descripcionSector"
                class="form-input"
                placeholder="Describe el sector..."
                rows="3"
                @blur="validateField('descripcionSector')"
                :class="{ 'input-error': errors.descripcionSector }"
                required
              ></textarea>
            </div>
            <small v-if="errors.descripcionSector" class="form-help" style="color:#ef4444;">
              {{ errors.descripcionSector }}
            </small>
          </div>

          <div class="form-group">
            <label for="estado" class="form-label">
              <font-awesome-icon :icon="['fas', 'toggle-on']" /> Estado
            </label>
            <div class="input-icon-group">
              <span class="input-icon"><font-awesome-icon :icon="['fas', 'power-off']" /></span>
              <select
                id="estado"
                v-model="form.estado"
                class="form-input"
                required
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="goBack"
              class="btn btn-cancel"
              :disabled="loading"
            >
              <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-submit"
              :disabled="loading || !isFormValid || !hasChanges"
            >
              <font-awesome-icon v-if="loading" :icon="['fas', 'spinner']" spin /> 
              <font-awesome-icon v-else :icon="['fas', 'save']" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal éxito -->
    <div
      v-if="showSuccessModal"
      class="modal-overlay"
      @click="showSuccessModal = false"
    >
      <div class="modal-content success-modal" @click.stop>
        <div class="modal-header">
          <font-awesome-icon
            class="success-icon"
            :icon="['fas', 'check-circle']"
          />
          <h3>¡Sector actualizado!</h3>
        </div>
        <div class="modal-body">
          <p>
            El sector <strong>{{ form.nombreSector }}</strong> fue actualizado
            correctamente.
          </p>
        </div>
        <div class="modal-footer">
          <button @click="goToList" class="btn btn-submit">
            <font-awesome-icon :icon="['fas', 'list']" /> Ver lista
          </button>
          <button
            @click="showSuccessModal = false"
            class="btn btn-cancel"
          >
            <font-awesome-icon :icon="['fas', 'edit']" /> Seguir editando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { useSectorsStore } from "@/stores/sectors";
import { useToast } from "@/composables/useToast";

export default {
  name: "SectorEditPage",
  components: { LoadingSpinner },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const sectorsStore = useSectorsStore();
    const { showToast } = useToast();

    const loading = ref(true);
    const error = ref(null);
    const showSuccessModal = ref(false);

    // Form data reactive
    const form = reactive({
      nombreSector: "",
      codigoPostalSector: "",
      descripcionSector: "",
      estado: "active",
    });

    // Original form to check changes
    const originalForm = reactive({
      nombreSector: "",
      codigoPostalSector: "",
      descripcionSector: "",
      estado: "active",
    });

    // Errors reactive
    const errors = reactive({
      nombreSector: "",
      codigoPostalSector: "",
      descripcionSector: "",
    });

    // Validations
    const validations = {
      nombreSector(value) {
        if (!value.trim()) return "El nombre del sector es requerido";
        if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
        if (value.trim().length > 100) return "El nombre no puede exceder 100 caracteres";
        return "";
      },
      codigoPostalSector(value) {
        if (!value.trim()) return "El código postal es requerido";
        if (!/^\d{6}$/.test(value.trim()))
          return "El código postal debe tener 6 dígitos";
        return "";
      },
      descripcionSector(value) {
        if (!value.trim()) return "La descripción es requerida";
        if (value.trim().length < 10)
          return "La descripción debe tener al menos 10 caracteres";
        if (value.trim().length > 500)
          return "La descripción no puede exceder 500 caracteres";
        return "";
      },
    };

    // Validate one field
    const validateField = (field) => {
      errors[field] = validations[field](form[field]);
    };

    // Validate all fields
    const validateForm = () => {
      let valid = true;
      for (const key in validations) {
        errors[key] = validations[key](form[key]);
        if (errors[key]) valid = false;
      }
      return valid;
    };

    // Computed valid form
    const isFormValid = computed(() => {
      return (
        form.nombreSector.trim() &&
        form.codigoPostalSector.trim() &&
        form.descripcionSector.trim() &&
        !errors.nombreSector &&
        !errors.codigoPostalSector &&
        !errors.descripcionSector
      );
    });

    // Computed to check if changes were made
    const hasChanges = computed(() => {
      return (
        form.nombreSector !== originalForm.nombreSector ||
        form.codigoPostalSector !== originalForm.codigoPostalSector ||
        form.descripcionSector !== originalForm.descripcionSector ||
        form.estado !== originalForm.estado
      );
    });

    // Load sector data
    const loadSector = async () => {
      loading.value = true;
      error.value = null;
      try {
        const sectorId = route.params.id;
        if (!sectorId) {
          throw new Error("ID de sector no válido");
        }
        const sectorData = await sectorsStore.getItem(sectorId);
        form.nombreSector = sectorData.nombreSector;
        form.codigoPostalSector = sectorData.codigoPostalSector;
        form.descripcionSector = sectorData.descripcionSector;
        form.estado = sectorData.estado || "active";

        originalForm.nombreSector = sectorData.nombreSector;
        originalForm.codigoPostalSector = sectorData.codigoPostalSector;
        originalForm.descripcionSector = sectorData.descripcionSector;
        originalForm.estado = sectorData.estado || "active";
      } catch (err) {
        error.value = err.message || "Error al cargar el sector";
        console.error("Error cargando sector:", err);
      } finally {
        loading.value = false;
      }
    };

    // Go back to list
    const goBack = () => {
      router.push("/app/sectors");
    };

    // Submit handler
    const handleSubmit = async () => {
      if (!validateForm()) {
        showToast("Por favor, corrige los errores en el formulario", "error");
        return;
      }
      if (!hasChanges.value) {
        showToast("No hay cambios para guardar", "warning");
        return;
      }
      loading.value = true;
      try {
        const updated = await sectorsStore.updateItem(route.params.id, {
          nombreSector: form.nombreSector.trim(),
          codigoPostalSector: form.codigoPostalSector.trim(),
          descripcionSector: form.descripcionSector.trim(),
          estado: form.estado,
        });

        originalForm.nombreSector = updated.nombreSector;
        originalForm.codigoPostalSector = updated.codigoPostalSector;
        originalForm.descripcionSector = updated.descripcionSector;
        originalForm.estado = updated.estado;

        showSuccessModal.value = true;
        showToast("Sector actualizado exitosamente", "success");
      } catch (err) {
        showToast(err.message || "Error al actualizar el sector", "error");
        console.error("Error actualizando sector:", err);
      } finally {
        loading.value = false;
      }
    };

    // Go to list from modal
    const goToList = () => {
      showSuccessModal.value = false;
      router.push("/app/sectors");
    };

    onMounted(() => {
      loadSector();
    });

    return {
      form,
      errors,
      loading,
      error,
      showSuccessModal,
      isFormValid,
      hasChanges,
      validateField,
      handleSubmit,
      loadSector,
      goBack,
      goToList,
    };
  },
};
</script>

<style scoped>
/* Copiado y adaptado desde el primer código, con el agregado para inputs con error */

.sector-edit {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.1);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 1400px;
  min-width: 320px;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #225b8c;
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  display: flex;
  justify-content: center;
}

.form-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.05);
}

.role-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #225b8c;
  font-size: 1rem;
}

.input-icon-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #66adf4;
  font-size: 16px;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e7ef;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #66adf4;
  box-shadow: 0 0 0 3px rgba(102, 173, 244, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
  padding-left: 40px;
}

/* error input style */
.form-input.input-error {
  border-color: #ef4444;
  background: #fff0f0;
}

.form-help {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-help[style*="color:#ef4444"] {
  color: #ef4444;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e7ef;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-submit {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #495057;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
  margin: 1rem 0;
}

.institutional-video-banner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
  position: relative;
  min-height: 220px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(34, 91, 140, 0.10);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-video {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 18px;
  z-index: 0;
  display: block;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(20,40,60,0.55) 60%, rgba(0,0,0,0.35) 100%);
  z-index: 1;
}

.banner-caption {
  position: absolute;
  left: 2rem;
  bottom: 1.8rem;
  color: #fff;
  z-index: 2;
}

.banner-caption h2 {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.banner-caption p {
  font-size: 1.25rem;
  font-weight: 400;
  opacity: 0.85;
}

/* Modal de éxito */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(30, 41, 59, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px #225b8c33;
  max-width: 380px;
  width: 100%;
  padding: 2rem 2rem 1.5rem;
  text-align: center;
}

.success-modal .modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.success-icon {
  color: #22c55e;
  font-size: 3rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 767px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .banner-caption {
    left: 1rem;
    bottom: 1.5rem;
  }
}
</style>
