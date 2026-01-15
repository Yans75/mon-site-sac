import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '../context/AdminContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdmin } = useAdmin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  if (isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      toast.success('Bienvenue dans l\'administration');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center bg-charcoal">
      <div className="max-w-md mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-white p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-terracotta" />
            </div>
            <h1 className="font-heading text-3xl text-charcoal mb-2">
              Administration
            </h1>
            <p className="font-body text-charcoal/60 text-sm">
              Accès réservé aux administrateurs
            </p>
          </div>

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
                data-testid="admin-email"
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
                data-testid="admin-password"
                className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="admin-login-submit"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
