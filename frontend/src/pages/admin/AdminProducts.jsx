import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogOut, Star, Package } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminProducts = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, adminLogout, getAuthHeaders } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/admin/products`, getAuthHeaders());
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return;
    }

    try {
      await axios.delete(`${API}/admin/products/${productId}`, getAuthHeaders());
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
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
              className="py-4 border-b-2 border-terracotta font-body text-sm text-charcoal"
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
          <div>
            <h1 className="font-heading text-3xl text-charcoal">Produits</h1>
            <p className="font-body text-charcoal/60">{products.length} produit(s)</p>
          </div>
          <Link 
            to="/admin/products/new"
            data-testid="new-product-btn"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Nouveau Produit
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-stone-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-pale-sand">
              <tr>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Produit</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Catégorie</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Prix</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Stock</th>
                <th className="text-left py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Vedette</th>
                <th className="text-right py-4 px-6 font-body text-sm text-charcoal/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.product_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-muted hover:bg-pale-sand/50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pale-sand overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0].startsWith('/api') 
                              ? `${process.env.REACT_APP_BACKEND_URL}${product.images[0]}`
                              : product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-charcoal/30" />
                          </div>
                        )}
                      </div>
                      <span className="font-body text-charcoal">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-sm text-charcoal/60 capitalize">{product.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-charcoal">{product.price?.toFixed(2)} €</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-body text-sm ${product.stock <= 3 ? 'text-terracotta' : 'text-charcoal'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {product.featured && (
                      <Star size={16} className="text-terracotta fill-terracotta" />
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${product.product_id}`}
                        data-testid={`edit-${product.product_id}`}
                        className="p-2 hover:bg-pale-sand rounded transition-colors"
                      >
                        <Edit size={16} className="text-charcoal/60" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.product_id, product.name)}
                        data-testid={`delete-${product.product_id}`}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="text-charcoal/20 mx-auto mb-4" />
              <p className="font-body text-charcoal/60">Aucun produit pour le moment</p>
              <Link 
                to="/admin/products/new"
                className="inline-block mt-4 text-terracotta hover:underline font-body text-sm"
              >
                Créer votre premier produit
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
