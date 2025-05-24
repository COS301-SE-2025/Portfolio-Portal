import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'register'
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', loginData);
    navigate('/home');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    } else {
      console.log('Registering with:', registerData);
      navigate('/home')
    }
  };

  const switchToRegister = () => setCurrentPage('register');
  const switchToLogin = () => setCurrentPage('login');

  return (
    <div className="app-container">
      {currentPage === 'login' ? (
        <LoginForm 
          loginData={loginData}
          setLoginData={setLoginData}
          handleLogin={handleLogin}
          switchToRegister={switchToRegister}
        />
      ) : (
        <RegisterForm
          registerData={registerData}
          setRegisterData={setRegisterData}
          handleRegister={handleRegister}
          switchToLogin={switchToLogin}
        />
      )}
    </div>
  );
};

// Login Component
function LoginForm({ loginData, setLoginData, handleLogin, switchToRegister }) {
  return (
    <div className="login-box">
      <h1>Welcome Back!</h1>
      <p className="subtitle">Log in to transform your CV into a living, immersive portfolio.</p>
      
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="login"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="login-btn">
          Sign In
        </button>
      </form>
      
      <p className="signup-text">
        Don't have an account? <button onClick={switchToRegister} className="signup-link">Sign up</button>
      </p>
    </div>
  );
}

// Register Component
function RegisterForm({ registerData, setRegisterData, handleRegister, switchToLogin }) {
  return (
    <div className="login-box">
      <h1>Create Account</h1>
      <p className="subtitle">Join us to create your immersive portfolio experience.</p>
      
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={registerData.fullName}
            onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="login-btn">
          Create Account
        </button>
      </form>
      
      <p className="signup-text">
        Already have an account? <button onClick={switchToLogin} className="signup-link">Sign in</button>
      </p>
    </div>
  );
}

export default Login;

// CSS styles
const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f0c29;
}

.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
}

.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(at 20% 30%, rgba(112, 66, 255, 0.35) 0%, transparent 50%),
    radial-gradient(at 80% 20%, rgba(255, 99, 172, 0.3) 0%, transparent 50%),
    radial-gradient(at 50% 90%, rgba(66, 255, 255, 0.25) 0%, transparent 50%);
  z-index: 0;
  pointer-events: none;
}

.login-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  position: relative;
}

input {
  width: 100%;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
  background: linear-gradient(135deg, #ff5252, #d84315);
}

.login-btn:active {
  transform: translateY(0);
}

.signup-text {
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.signup-link {
  color: #ff6b6b;
  text-decoration: none;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
}

.signup-link:hover {
  color: #ff5252;
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-box {
    margin: 1rem;
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}