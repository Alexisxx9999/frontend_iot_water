<template>
  <div class="auth-container split-layout">
    <div class="login-left-panel">
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
      </div>
    </div>
    <div class="login-right-panel">
      <video autoplay loop muted playsinline class="login-bg-video">
        <source src="/videos/istockphoto-1390664973-640_adpp_is.mp4" type="video/mp4" />
      </video>
      <div class="login-bg-overlay"></div>
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
      router.push('/app/devices');
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
@use '@/assets/styles/main.scss' as *;

.split-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}
.login-left-panel {
  flex: 1 1 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  z-index: 2;
  min-height: 100vh;
}
.login-right-panel {
  flex: 1 1 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 100vh;
}
.login-bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  filter: blur(4px) brightness(0.85) saturate(1.1);
  transition: filter 0.4s;
}
.login-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, rgba(20,40,60,0.78) 70%, rgba(0,0,0,0.55) 100%);
  z-index: 1;
}
.auth-card {
  background: rgba(255,255,255,0.98);
  border-radius: 32px;
  box-shadow: 0 12px 40px rgba(34, 91, 140, 0.18), 0 2px 12px rgba(0,0,0,0.10);
  overflow: hidden;
  min-width: 400px;
  max-width: 420px;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  z-index: 3;
  animation: fadeInUp 0.8s cubic-bezier(.23,1.01,.32,1) both;
  border: 1.5px solid #e3e8f0;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.auth-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.auth-title {
  font-size: 2.2rem;
  font-weight: var(--font-weight-bold, 700);
  color: #225b8c;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', 'Inter', sans-serif;
  text-align: center;
  letter-spacing: -0.5px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.2rem;
}
.input-group {
  display: flex;
  align-items: center;
  background: #f4f8fb;
  border-radius: 10px;
  padding: 0.8rem 1.1rem;
  border: 1.5px solid #e3e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(34, 91, 140, 0.04);
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f633;
  }
  .input-icon {
    margin-right: 0.7rem;
    color: #3b82f6;
    display: flex;
    align-items: center;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.08rem;
    flex: 1;
    color: #23272f;
    font-family: 'Montserrat', 'Inter', sans-serif;
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
    color: var(--text-primary);
  }
  .forgot-link {
    color: var(--primary-color);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.auth-btn {
  width: 100%;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 1rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.10);
  transition: background 0.2s;
  margin-top: 0.7rem;
  &:hover {
    background: #225b8c;
  }
}
.auth-right {
  flex: 1 1 420px;
  background: rgba(0,0,0,0.35);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  text-align: center;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  z-index: 2;
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
  color: #fff;
  font-family: 'Montserrat', 'Inter', sans-serif;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.welcome-desc {
  font-size: 1.13rem;
  margin-bottom: 2.2rem;
  color: #e0e6f0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.signup-btn {
  background: #fff;
  color: #225b8c;
  font-weight: var(--font-weight-semibold, 600);
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2.5rem;
  font-size: 1.13rem;
  box-shadow: 0 2px 8px rgba(34, 91, 140, 0.10);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  margin-top: 1.2rem;
  &:hover {
    background: #eaf6ff;
    color: #3a7fc1;
  }
}
@media (max-width: 1100px) {
  .split-layout {
    flex-direction: column;
  }
  .login-left-panel, .login-right-panel {
    flex: 1 1 100%;
    min-height: 50vh;
    max-width: 100vw;
  }
  .auth-card {
    min-width: 90vw;
    max-width: 98vw;
    margin: 2rem auto;
  }
}
@media (max-width: 700px) {
  .split-layout {
    flex-direction: column;
  }
  .login-left-panel, .login-right-panel {
    flex: 1 1 100%;
    min-height: unset;
    max-width: 100vw;
  }
  .login-right-panel {
    display: none;
  }
  .auth-card {
    min-width: 98vw;
    max-width: 99vw;
    margin: 1.2rem auto;
    border-radius: 18px;
    padding: 1.2rem 0.7rem;
  }
}
</style>
