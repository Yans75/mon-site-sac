import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, ShoppingCart, Users, MessageSquare, 
  Euro, Plus, LogOut, Settings, TrendingUp 
} from 'lucide-react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, adminLogout, getAuthHeaders } = useAdmin();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, getAuthHeaders()),
        axios.get(`${API}/admin/orders`, getAuthHeaders())
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-pale-sand flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    { label: 'Produits', value: stats?.products || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Commandes', value: stats?.orders || 0, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Clients', value: stats?.users || 0, icon: Users, color: 'bg-purple-500' },
    { label: 'Messages', value: stats?.messages || 0, icon: MessageSquare, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-pale-sand">
      {/* Admin Header */}
      <header className="bg-charcoal text-stone-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-heading text-2xl">ArtemCreations</Link>
              <span className="bg-terracotta px-3 py-1 text-xs uppercase tracking-wider rounded-full">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="font-body text-sm text-stone-white/70 hover:text-stone-white">
                Voir le site
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-stone-white/70 hover:text-stone-white"
              >
                <LogOut size={16} />
                <span className="font-body text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Nav */}
      <nav className="bg-stone-white border-b border-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <Link 
              to="/admin/dashboard" 
              className="py-4 border-b-2 border-terracotta font-body text-sm text-charcoal"
            >
              Tableau de bord
            </Link>
            <Link 
              to="/admin/products" 
              className="py-4 border-b-2 border-transparent font-body text-sm text-charcoal/60 hover:text-charcoal"
            >
              Produits
            </Link>
            <Link 
              to="/admin/orders" 
              className="py-4 border-b-2 border-transparent font-body text-sm text-charcoal/60 hover:text-charcoal"
            >
              Commandes
            </Link>
            <Link 
              to="/admin/messages" 
              className="py-4 border-b-2 border-transparent font-body text-sm text-charcoal/60 hover:text-charcoal"
            >
              Messages
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl text-charcoal">Tableau de Bord</h1>
          <Link 
            to="/admin/products/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Nouveau Produit
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-stone-white p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
              <p className="font-heading text-3xl text-charcoal">{stat.value}</p>
              <p className="font-body text-sm text-charcoal/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-charcoal text-stone-white p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center">
              <Euro size={24} />
            </div>
            <div>
              <p className="font-body text-sm text-stone-white/60">Chiffre d'affaires total</p>
              <p className="font-heading text-4xl">{stats?.revenue?.toFixed(2) || '0.00'} €</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/admin/products"
            className="bg-stone-white p-6 hover:shadow-md transition-shadow group"
          >
            <Package size={24} className="text-terracotta mb-4" />
            <h3 className="font-heading text-xl text-charcoal mb-2 group-hover:text-terracotta transition-colors">
              Gérer les Produits
            </h3>
            <p className="font-body text-sm text-charcoal/60">
              Ajouter, modifier ou supprimer des produits
            </p>
          </Link>

          <Link 
            to="/admin/orders"
            className="bg-stone-white p-6 hover:shadow-md transition-shadow group"
          >
            <ShoppingCart size={24} className="text-terracotta mb-4" />
            <h3 className="font-heading text-xl text-charcoal mb-2 group-hover:text-terracotta transition-colors">
              Voir les Commandes
            </h3>
            <p className="font-body text-sm text-charcoal/60">
              Consulter et gérer les commandes clients
            </p>
          </Link>

          <Link 
            to="/admin/messages"
            className="bg-stone-white p-6 hover:shadow-md transition-shadow group"
          >
            <MessageSquare size={24} className="text-terracotta mb-4" />
            <h3 className="font-heading text-xl text-charcoal mb-2 group-hover:text-terracotta transition-colors">
              Messages
            </h3>
            <p className="font-body text-sm text-charcoal/60">
              Lire les messages du formulaire de contact
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
