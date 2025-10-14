
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userType', data.userType); // 'admin' o 'paciente'
        if (data.userType === 'admin') {
          navigate('/blog-admin');
        } else if (data.userType === 'paciente') {
          navigate('/perfil');
        } else {
          navigate('/'); // fallback
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-white">
      <div className="w-full max-w-lg px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <User className="w-14 h-14 text-green-500 mb-3" />
            <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
          </div>
          <form onSubmit={handleSubmit} className="w-full">
            {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 text-base font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-800 shadow-lg transition-all duration-150 focus:scale-105"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div className="mb-8">
              <label className="block mb-2 text-gray-700 text-base font-medium">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-800 shadow-lg transition-all duration-150 focus:scale-105"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end mb-6 text-sm">
              <button
                type="button"
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={() => alert('Funcionalidad de recuperación próximamente')}
              >¿Olvidaste tu contraseña?</button>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
