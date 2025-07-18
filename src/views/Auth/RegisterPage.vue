<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-left">
        <h2 class="auth-title">Crear cuenta</h2>
        <form class="auth-form" @submit.prevent="handleRegister">
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" /></svg>
            </span>
            <input type="text" v-model="nombre" required placeholder="Nombre" />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" /></svg>
            </span>
            <input type="text" v-model="apellido" required placeholder="Apellido" />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7m0 0H9m3 0h3" /></svg>
            </span>
            <input type="email" v-model="email" required placeholder="Correo electrónico" />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0v-4z" /></svg>
            </span>
            <input type="tel" v-model="telefono" required placeholder="Teléfono" />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 0 1 8 0v2" /></svg>
            </span>
            <select v-model="departamento" required>
              <option value="" disabled selected>Departamento</option>
              <option v-for="dep in departamentos" :key="dep.id" :value="dep.id">{{ dep.nombre }}</option>
            </select>
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 0 1-8 0" /></svg>
            </span>
            <input type="text" v-model="posicion" required placeholder="Posición" />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
            </span>
            <input type="password" v-model="password" required placeholder="Contraseña" />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
            </span>
            <input type="password" v-model="confirmPassword" required placeholder="Confirmar contraseña" />
          </div>
          <button type="submit" class="auth-btn">Crear cuenta</button>
        </form>
      </div>
      <div class="auth-right">
        <img :src="logo1" alt="Logo IoT Water" class="auth-logo" />
        <h3 class="welcome-title">¿Ya tienes cuenta?</h3>
        <p class="welcome-desc">Inicia sesión para acceder al panel de administración de IoT Water</p>
        <router-link to="/auth/login" class="signup-btn">Iniciar sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo1 from '@/assets/images/logo.png';

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const nombre = ref('');
    const apellido = ref('');
    const email = ref('');
    const telefono = ref('');
    const departamento = ref('');
    const posicion = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    // Departamentos de ejemplo, puedes reemplazar por datos de la API
    const departamentos = ref([
      { id: 1, nombre: 'Administración' },
      { id: 2, nombre: 'Operaciones' },
      { id: 3, nombre: 'Soporte' }
    ]);

    const handleRegister = () => {
      if (password.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden');
        return;
      }
      // Aquí iría la lógica de registro
      console.log('Register:', {
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        telefono: telefono.value,
        departamento: departamento.value,
        posicion: posicion.value,
        password: password.value
      });
      // Por ahora, redirigir al login
      router.push('/auth/login');
    };

    return {
      nombre,
      apellido,
      email,
      telefono,
      departamento,
      posicion,
      password,
      confirmPassword,
      departamentos,
      handleRegister,
      logo1
    };
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/main.scss' as *;

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}
.auth-card {
  display: flex;
  background: var(--bg-primary);
  border-radius: 22px;
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  min-width: 900px;
  max-width: 1200px;
}
.auth-left {
  flex: 1 1 420px;
  padding: 3rem 3rem 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg-primary);
}
.auth-title {
  font-size: 2.2rem;
  font-weight: var(--font-weight-bold, 700);
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.input-group {
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  border: 1px solid var(--border-color);
  transition: border-color 0.2s;
  &:focus-within {
    border-color: var(--primary-color);
  }
  .input-icon {
    margin-right: 0.7rem;
    color: var(--primary-color);
    display: flex;
    align-items: center;
  }
  input, select {
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    flex: 1;
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    &::placeholder {
      color: var(--text-muted);
    }
  }
  select {
    appearance: none;
    padding-right: 1.5rem;
  }
}
.auth-btn {
  width: 100%;
  @extend .btn;
  @extend .btn-primary;
  font-size: 1.15rem;
  font-weight: var(--font-weight-semibold, 600);
  gap: 0.5rem;
  padding: 0.95rem 0;
}
.auth-right {
  flex: 1 1 420px;
  background: var(--bg-secondary);
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  text-align: center;
}
.auth-logo {
  width: 120px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 2px 8px var(--primary-color, rgba(34, 91, 140, 0.15)));
}
.welcome-title {
  font-size: 1.8rem;
  font-weight: var(--font-weight-bold, 700);
  margin-bottom: 1rem;
  letter-spacing: 1px;
  color: var(--primary-color);
  font-family: 'Inter', sans-serif;
}
.welcome-desc {
  font-size: 1.13rem;
  margin-bottom: 2.2rem;
  color: var(--primary-color);
}
.signup-btn {
  background: var(--bg-primary);
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold, 600);
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2.5rem;
  font-size: 1.13rem;
  box-shadow: var(--shadow-soft);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
  }
}
@media (max-width: 1100px) {
  .auth-card {
    min-width: 320px;
    max-width: 98vw;
    flex-direction: column;
  }
  .auth-right {
    padding: 2rem 1.2rem;
  }
  .auth-left {
    padding: 2rem 1.2rem 2rem 1.2rem;
  }
}
</style>
