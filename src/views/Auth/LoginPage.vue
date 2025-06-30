<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-left">
        <h2 class="auth-title">Inicia sesión</h2>
        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7m0 0H9m3 0h3" /></svg>
            </span>
            <input type="text" v-model="userOrEmail" required placeholder="Usuario o Email"  />
          </div>
          <div class="input-group">
            <span class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#66adf4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" /></svg>
            </span>
            <input type="password" v-model="password" required placeholder="Contraseña" />
          </div>
          <div class="auth-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" /> Recordarme
            </label>
            <router-link class="forgot-link" to="/auth/forgot-password">¿Olvidaste tu contraseña?</router-link>
          </div>
          <button type="submit" class="auth-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" /></svg>
            Iniciar sesión
          </button>
        </form>
      </div>
      <div class="auth-right">
        <img :src="logo1" alt="Logo IoT Water" class="auth-logo" />
        <h3 class="welcome-title">¡BIENVENIDO!</h3>
        <p class="welcome-desc">Ingresa tus datos y comienza tu experiencia con IoT Water</p>
        <router-link to="/auth/register" class="signup-btn">Registrarse</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo1 from '@/assets/images/logo.png';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const userOrEmail = ref('');
    const password = ref('');
    const rememberMe = ref(false);

    const handleLogin = () => {
      // Aquí iría la lógica de autenticación
      console.log('Login:', { userOrEmail: userOrEmail.value, password: password.value, rememberMe: rememberMe.value });
      // Por ahora, redirigir al dashboard
      router.push('/app/dashboard');
    };

    return {
      userOrEmail,
      password,
      rememberMe,
      handleLogin,
      logo1
    };
  }
};
</script>

<style lang="scss" scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #288aef
}
.auth-card {
  display: flex;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(34, 91, 140, 0.18);
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
  background: #fff;
}
.auth-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1.5rem;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.input-group {
  display: flex;
  align-items: center;
  background: #f4f8fb;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  border: 1px solid #e0e7ef;
  transition: border-color 0.2s;
  &:focus-within {
    border-color: #66adf4;
  }
  .input-icon {
    margin-right: 0.7rem;
    color: #66adf4;
    display: flex;
    align-items: center;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    flex: 1;
    color: #222;
    &::placeholder {
      color: #b0b8c1;
    }
  }
}
.auth-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  .remember-me {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #222;
  }
  .forgot-link {
    color: #66adf4;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.auth-btn {
  width: 100%;
  background: #66adf4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.95rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.10);
  transition: background 0.2s;
  &:hover {
    background: #225b8c;
  }
}
.auth-right {
  flex: 1 1 420px;
  background: rgb(233, 236, 237);
  color: #225b8c;
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
  filter: drop-shadow(0 2px 8px rgba(34, 91, 140, 0.15));
}
.welcome-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}
.welcome-desc {
  font-size: 1.13rem;
  margin-bottom: 2.2rem;
  color: #225b8c;
}
.signup-btn {
  background: #fff;
  color: #225b8c;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2.5rem;
  font-size: 1.13rem;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.10);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #eaf6ff;
    color: #3a7fc1;
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
