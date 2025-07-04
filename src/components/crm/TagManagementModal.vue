<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Gestionar Etiquetas
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Añade o elimina etiquetas para organizar mejor esta conversación.
                </p>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas Actuales
                  </label>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span
                      v-for="tag in currentTags"
                      :key="tag"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ tag }}
                      <button
                        @click="removeTag(tag)"
                        class="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </span>
                    <span v-if="currentTags.length === 0" class="text-sm text-gray-400">
                      Sin etiquetas
                    </span>
                  </div>
                  
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Añadir Nueva Etiqueta
                  </label>
                  <div class="flex space-x-2">
                    <input
                      v-model="newTag"
                      type="text"
                      placeholder="Escribe una etiqueta..."
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      @keyup.enter="addTag"
                    />
                    <button
                      @click="addTag"
                      :disabled="!newTag.trim()"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas Sugeridas
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="suggestedTag in suggestedTags"
                      :key="suggestedTag"
                      @click="addSuggestedTag(suggestedTag)"
                      :disabled="currentTags.includes(suggestedTag)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ suggestedTag }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="saveTags"
            :disabled="isSaving"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              v-if="isSaving"
              class="w-4 h-4 mr-2 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCrmStore } from '@/stores/crm';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'updated']);

const crmStore = useCrmStore();
const newTag = ref('');
const isSaving = ref(false);
const currentTags = ref([]);

const conversation = computed(() => 
  crmStore.conversations.find(c => c.id === props.conversationId)
);

const suggestedTags = computed(() => 
  crmStore.tags.filter(tag => !currentTags.value.includes(tag))
);

const closeModal = () => {
  newTag.value = '';
  emit('close');
};

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase();
  if (tag && !currentTags.value.includes(tag)) {
    currentTags.value.push(tag);
    newTag.value = '';
  }
};

const addSuggestedTag = (tag) => {
  if (!currentTags.value.includes(tag)) {
    currentTags.value.push(tag);
  }
};

const removeTag = (tag) => {
  const index = currentTags.value.indexOf(tag);
  if (index > -1) {
    currentTags.value.splice(index, 1);
  }
};

const saveTags = async () => {
  isSaving.value = true;
  try {
    await crmStore.updateConversationTags(props.conversationId, currentTags.value);
    emit('updated', currentTags.value);
    closeModal();
  } catch (error) {
    console.error('Error al guardar etiquetas:', error);
  } finally {
    isSaving.value = false;
  }
};

// Reset tags when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue && conversation.value) {
    currentTags.value = [...conversation.value.tags];
  }
});
</script> 