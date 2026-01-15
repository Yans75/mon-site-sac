import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, MessageSquare, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminMessages = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, adminLogout, getAuthHeaders } = useAdmin();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/admin/messages`, getAuthHeaders());
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
              className="py-4 border-b-2 border-transparent font-body text-sm text-charcoal/60 hover:text-charcoal"
            >
              Commandes
            </Link>
            <Link 
              to="/admin/messages" 
              className="py-4 border-b-2 border-terracotta font-body text-sm text-charcoal"
            >
              Messages
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl text-charcoal">Messages</h1>
          <p className="font-body text-charcoal/60">{messages.length} message(s)</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-2">
            {messages.map((message, index) => (
              <motion.button
                key={message.message_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left p-4 transition-colors ${
                  selectedMessage?.message_id === message.message_id 
                    ? 'bg-charcoal text-stone-white' 
                    : 'bg-stone-white hover:bg-pale-sand'
                }`}
              >
                <p className={`font-body text-sm font-medium ${
                  selectedMessage?.message_id === message.message_id ? 'text-stone-white' : 'text-charcoal'
                }`}>
                  {message.name}
                </p>
                <p className={`font-body text-xs ${
                  selectedMessage?.message_id === message.message_id ? 'text-stone-white/70' : 'text-charcoal/60'
                }`}>
                  {message.subject || 'Sans sujet'}
                </p>
                <p className={`font-body text-xs mt-1 ${
                  selectedMessage?.message_id === message.message_id ? 'text-stone-white/50' : 'text-charcoal/40'
                }`}>
                  {message.created_at ? new Date(message.created_at).toLocaleDateString('fr-FR') : '-'}
                </p>
              </motion.button>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 bg-stone-white">
                <MessageSquare size={48} className="text-charcoal/20 mx-auto mb-4" />
                <p className="font-body text-charcoal/60">Aucun message pour le moment</p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.message_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-stone-white p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-heading text-2xl text-charcoal">
                      {selectedMessage.subject || 'Sans sujet'}
                    </h2>
                    <p className="font-body text-charcoal/60">
                      De : {selectedMessage.name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-charcoal/60">
                    <Mail size={14} />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-terracotta">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/60">
                    <Calendar size={14} />
                    <span>
                      {selectedMessage.created_at 
                        ? new Date(selectedMessage.created_at).toLocaleString('fr-FR') 
                        : '-'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-muted pt-6">
                  <p className="font-body text-charcoal whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-muted">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Votre message'}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Répondre par email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="bg-stone-white p-8 text-center">
                <MessageSquare size={48} className="text-charcoal/20 mx-auto mb-4" />
                <p className="font-body text-charcoal/60">
                  Sélectionnez un message pour le lire
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
