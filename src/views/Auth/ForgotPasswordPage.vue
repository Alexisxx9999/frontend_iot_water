<template>
  <div class="forgot-password-page">
    <h2>Recuperar Contraseña</h2>
    <p class="forgot-subtitle">Ingresa tu correo electrónico para recibir instrucciones</p>

    <form class="forgot-form" @submit.prevent="handleForgotPassword">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required placeholder="tu@email.com" />
      </div>

      <button type="submit" class="forgot-button">
        Enviar Instrucciones
      </button>
    </form>

    <div class="forgot-links">
      <router-link to="/auth/login">Volver al inicio de sesión</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ForgotPasswordPage',
  setup() {
    const router = useRouter();
    const email = ref('');

    const handleForgotPassword = () => {
      // Aquí iría la lógica de recuperación de contraseña
      console.log('Forgot password:', { email: email.value });

      alert('Se han enviado las instrucciones a tu correo electrónico');

      // Redirigir al login
      router.push('/auth/login');
    };

    return {
      email,
      handleForgotPassword
    };
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/main.scss' as *;

.forgot-password-page {
  max-width: 400px;
  margin: 60px auto;
  background: var(--bg-primary);
  border-radius: 18px;
  box-shadow: var(--shadow-medium);
  padding: 2.5rem 2rem 2rem 2rem;
  text-align: center;

  h2 {
    font-size: 1.75rem;
    font-weight: var(--font-weight-bold, 600);
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-family: 'Montserrat', sans-serif;
  }

  .forgot-subtitle {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-family: 'Montserrat', sans-serif;
  }
}

.forgot-form {
  .form-group {
    margin-bottom: 1.5rem;
    text-align: left;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: var(--font-weight-medium, 500);
      color: var(--text-primary);
      font-family: 'Montserrat', sans-serif;
    }

    input {
      @extend .input;
      width: 100%;
      font-family: 'Montserrat', sans-serif;
    }
  }
}

.forgot-button {
  @extend .btn;
  @extend .btn-warning;
  width: 100%;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold, 600);
  font-family: 'Montserrat', sans-serif;
}

.forgot-links {
  margin-top: 1.5rem;

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 0.9rem;
    font-family: 'Montserrat', sans-serif;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
