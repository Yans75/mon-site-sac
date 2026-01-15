import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Bon retour parmi nous !');
      navigate('/');
    } catch (error) {
      toast.error('Connexion échouée', {
        description: error.response?.data?.detail || 'Identifiants incorrects'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="max-w-md mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-4xl text-charcoal mb-2 text-center">
            Bon Retour
          </h1>
          <p className="font-body text-charcoal/60 text-center mb-8">
            Connectez-vous à votre compte
          </p>

          {/* Google Login */}
          <button
            onClick={loginWithGoogle}
            data-testid="google-login-btn"
            className="w-full border border-muted py-3 px-4 flex items-center justify-center gap-3 hover:bg-pale-sand transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-body text-sm">Continuer avec Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-stone-white px-4 font-body text-xs text-charcoal/50 uppercase tracking-wider">
                Ou par email
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-body text-sm text-charcoal/70 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="login-email"
                className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-body text-sm text-charcoal/70 mb-2 block">
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="login-password"
                className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit"
              className="btn-primary w-full py-3"
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </form>

          <p className="font-body text-sm text-charcoal/60 text-center mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-terracotta hover:underline">
              Créer un compte
            </Link>
          </p>

          <p className="font-body text-xs text-charcoal/40 text-center mt-4">
            Vous pouvez également commander en tant qu'invité
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
