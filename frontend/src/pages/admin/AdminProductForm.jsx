import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, LogOut, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditing = !!productId;
  const { isAdmin, loading: authLoading, adminLogout, getAuthHeaders, adminToken } = useAdmin();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'tote',
    material: '',
    craftsmanship_time: '',
    limited_pieces: 10,
    stock: 10,
    featured: false,
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'tote', label: 'Cabas' },
    { value: 'clutch', label: 'Pochette' },
    { value: 'shoulder', label: 'Sac à Épaule' },
    { value: 'crossbody', label: 'Bandoulière' },
    { value: 'mini', label: 'Mini Sac' },
    { value: 'weekender', label: 'Week-end' },
  ];

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isEditing && isAdmin) {
      fetchProduct();
    }
  }, [isEditing, isAdmin]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${productId}`);
      const product = response.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || 'tote',
        material: product.material || '',
        craftsmanship_time: product.craftsmanship_time || '',
        limited_pieces: product.limited_pieces || 10,
        stock: product.stock || 10,
        featured: product.featured || false,
        images: product.images || []
      });
    } catch (error) {
      toast.error('Erreur lors du chargement du produit');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const newImages = [...formData.images];

    for (const file of files) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await axios.post(`${API}/upload/image`, formDataUpload, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        newImages.push(response.data.url);
      } catch (error) {
        toast.error(`Erreur lors de l'upload de ${file.name}`);
      }
    }

    setFormData(prev => ({ ...prev, images: newImages }));
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        limited_pieces: parseInt(formData.limited_pieces) || 10,
        stock: parseInt(formData.stock) || 10
      };

      if (isEditing) {
        await axios.put(`${API}/admin/products/${productId}`, productData, getAuthHeaders());
        toast.success('Produit mis à jour');
      } else {
        await axios.post(`${API}/admin/products`, productData, getAuthHeaders());
        toast.success('Produit créé');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  if (authLoading) {
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link 
          to="/admin/products"
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal mb-6"
        >
          <ArrowLeft size={16} />
          <span className="font-body text-sm">Retour aux produits</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-white p-8"
        >
          <h1 className="font-heading text-3xl text-charcoal mb-8">
            {isEditing ? 'Modifier le Produit' : 'Nouveau Produit'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Nom du produit *
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="product-name"
                  className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none"
                  placeholder="Cabas Luna"
                />
              </div>

              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Prix (€) *
                </Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  data-testid="product-price"
                  className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none"
                  placeholder="485.00"
                />
              </div>
            </div>

            <div>
              <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                Description *
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                data-testid="product-description"
                className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none resize-none"
                placeholder="Une silhouette intemporelle confectionnée..."
              />
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Catégorie
                </Label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  data-testid="product-category"
                  className="w-full bg-stone-white border border-muted p-3 font-body text-charcoal"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Matière
                </Label>
                <Input
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  data-testid="product-material"
                  className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none"
                  placeholder="Fil de Coton Biologique"
                />
              </div>

              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Temps de confection
                </Label>
                <Input
                  name="craftsmanship_time"
                  value={formData.craftsmanship_time}
                  onChange={handleChange}
                  data-testid="product-time"
                  className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none"
                  placeholder="40+ heures"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Stock
                </Label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  data-testid="product-stock"
                  className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none"
                />
              </div>

              <div>
                <Label className="font-body text-sm text-charcoal/70 mb-2 block">
                  Pièces limitées
                </Label>
                <Input
                  name="limited_pieces"
                  type="number"
                  value={formData.limited_pieces}
                  onChange={handleChange}
                  data-testid="product-limited"
                  className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  data-testid="product-featured"
                />
                <Label htmlFor="featured" className="font-body text-sm text-charcoal cursor-pointer">
                  Produit en vedette
                </Label>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="font-body text-sm text-charcoal/70 mb-4 block">
                Images
              </Label>
              
              {/* Uploaded Images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-pale-sand">
                    <img 
                      src={img.startsWith('/api') ? `${process.env.REACT_APP_BACKEND_URL}${img}` : img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Buttons */}
              <div className="flex flex-wrap gap-4">
                <label className="cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 bg-charcoal text-stone-white px-4 py-2 font-body text-sm hover:bg-charcoal/80 transition-colors">
                    <Upload size={16} />
                    {uploading ? 'Upload en cours...' : 'Télécharger des images'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="inline-flex items-center gap-2 border border-charcoal text-charcoal px-4 py-2 font-body text-sm hover:bg-charcoal hover:text-stone-white transition-colors"
                >
                  <ImageIcon size={16} />
                  Ajouter une URL
                </button>
              </div>

              <p className="font-body text-xs text-charcoal/50 mt-2">
                Formats acceptés : JPG, PNG, WebP, GIF. Vous pouvez aussi utiliser des URLs externes.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                data-testid="product-submit"
                className="btn-primary flex items-center gap-2"
              >
                <Save size={16} />
                {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le produit')}
              </button>
              <Link
                to="/admin/products"
                className="btn-secondary"
              >
                Annuler
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminProductForm;
