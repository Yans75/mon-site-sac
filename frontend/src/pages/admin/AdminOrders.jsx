import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ShoppingCart, Euro, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, adminLogout, getAuthHeaders } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/admin/orders`, getAuthHeaders());
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
          <CheckCircle size={12} />
          Payée
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded">
          <Clock size={12} />
          En attente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
        {status}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-pale-sand flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
      </div>
    );
  }

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
              className="py-4 border-b-2 border-transparent font-body text-sm text-charcoal/60 hover:text-charcoal"
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
              className="py-4 border-b-2 border-terracotta font-body text-sm text-charcoal"
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
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-charcoal">Commandes</h1>
          <p className="font-body text-charcoal/60">{orders.length} commande(s)</p>
        </div>

        {/* Orders Table */}
        <div className="bg-stone-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-pale-sand">
              <tr>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Commande</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Client</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Articles</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Total</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Statut</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order.order_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-muted hover:bg-pale-sand/50"
                >
                  <td className="py-4 px-6">
                    <span className="font-body text-sm text-charcoal">{order.order_id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-sm text-charcoal">{order.email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-sm text-charcoal/60">
                      {order.items?.length || 0} article(s)
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-charcoal">{order.total?.toFixed(2)} €</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(order.status, order.payment_status)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-sm text-charcoal/60">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="text-charcoal/20 mx-auto mb-4" />
              <p className="font-body text-charcoal/60">Aucune commande pour le moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
