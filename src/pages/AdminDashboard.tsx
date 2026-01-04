import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase, PortfolioItem } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Upload, Video, Layers, Search } from 'lucide-react';
import { isVideo } from '../utils/mediaHelper';
import ConfirmationModal from '../components/ConfirmationModal';
import SEO from '../components/SEO';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Architecture');
  
  // Gallery Management
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Unified Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'danger' | 'info' | 'success' | 'warning';
    mode: 'confirm' | 'alert';
    title: string;
    message: string;
    confirmText: string;
    action?: () => Promise<void> | void;
  }>({
    isOpen: false,
    type: 'info',
    mode: 'confirm',
    title: '',
    message: '',
    confirmText: 'OK',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const showAlert = (message: string, type: 'warning' | 'danger' | 'success' = 'warning') => {
    setModalState({
      isOpen: true,
      type,
      mode: 'alert',
      title: type === 'danger' ? 'Error' : type === 'success' ? 'Success' : 'Attention',
      message,
      confirmText: 'OK',
      action: () => setModalState(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      showAlert("Mohon lengkapi Judul dan Deskripsi proyek.", 'warning');
      return;
    }
    if (galleryUrls.length === 0 && newFiles.length === 0) {
      showAlert("Mohon unggah minimal satu foto atau video untuk proyek ini.", 'warning');
      return;
    }

    setModalState({
      isOpen: true,
      type: 'info',
      mode: 'confirm',
      title: editingItem ? 'Update Proyek?' : 'Publikasikan Proyek?',
      message: editingItem 
        ? `Apakah Anda yakin ingin memperbarui "${title}"? Perubahan akan langsung terlihat.`
        : `Apakah Anda yakin ingin mempublikasikan "${title}" ke portofolio?`,
      confirmText: editingItem ? 'Update' : 'Publikasikan',
      action: performSave
    });
  };

  const performSave = async () => {
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const url = await handleFileUpload(file);
        uploadedUrls.push(url);
      }

      const finalGallery = [...galleryUrls, ...uploadedUrls];
      const mainImageUrl = finalGallery[0];

      const payload = {
        title,
        description,
        image_url: mainImageUrl,
        gallery: finalGallery,
        category,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('portfolio')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio')
          .insert([payload]);
        if (error) throw error;
      }

      closeModal();
      fetchItems();
      setModalState(prev => ({ ...prev, isOpen: false }));
      
    } catch (error) {
      console.error('Error saving item:', error);
      setModalState(prev => ({ ...prev, isOpen: false }));
      setTimeout(() => showAlert('Gagal menyimpan proyek. Silakan coba lagi.', 'danger'), 300);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (item: PortfolioItem) => {
    setModalState({
      isOpen: true,
      type: 'danger',
      mode: 'confirm',
      title: 'Hapus Proyek?',
      message: `Apakah Anda yakin ingin menghapus permanen "${item.title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus',
      action: async () => await performDelete(item.id)
    });
  };

  const performDelete = async (id: string) => {
    setIsUploading(true);
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchItems();
      setModalState(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error('Error deleting item:', error);
      setModalState(prev => ({ ...prev, isOpen: false }));
      setTimeout(() => showAlert('Gagal menghapus item.', 'danger'), 300);
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setDescription(item.description);
      setCategory(item.category);
      setGalleryUrls(item.gallery && item.gallery.length > 0 ? item.gallery : [item.image_url]);
    } else {
      setEditingItem(null);
      setTitle('');
      setDescription('');
      setCategory('Architecture');
      setGalleryUrls([]);
    }
    setNewFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const removeGalleryItem = (indexToRemove: number) => {
    setGalleryUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeNewFile = (indexToRemove: number) => {
    setNewFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <SEO title="Admin Dashboard" />
      
      {/* Global Confirmation/Alert Modal */}
      <ConfirmationModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalState.action}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        mode={modalState.mode}
        confirmText={modalState.confirmText}
        cancelText={t.admin.cancel}
        isLoading={isUploading}
      />

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.admin.dashboardTitle}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
        >
          <Plus className="h-5 w-5" />
          <span>{t.admin.addProject}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search projects..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Media</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t.admin.projectTitle}</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t.admin.category}</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        {isVideo(item.image_url) ? (
                          <div className="h-12 w-16 bg-black rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <img src={item.image_url} alt={item.title} className="h-12 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600" />
                        )}
                        {item.gallery && item.gallery.length > 1 && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-slate-800 flex items-center shadow-sm">
                            <Layers className="h-3 w-3 mr-0.5" />
                            {item.gallery.length}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.title}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Edit/Create Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700 ring-1 ring-white/10 animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingItem ? t.admin.editProject : t.admin.addProject}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveClick} className="p-6 space-y-6 overflow-y-auto">
              {/* Form content same as before, just ensuring styling consistency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.projectTitle}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="e.g. Modern Villa Design"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.category}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Structure">Structure</option>
                    <option value="MEP">MEP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.admin.gallery}</label>
                
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all bg-slate-50 dark:bg-slate-900/50 mb-4 cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.dropzone}</span>
                    <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, MP4</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {galleryUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      {isVideo(url) ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {newFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-blue-500/50 dark:border-blue-500/50 shadow-sm">
                      {file.type.startsWith('video/') ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      ) : (
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.projectDesc}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Describe the project details..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform active:scale-95"
                >
                  <Save className="h-4 w-4" />
                  <span>{t.admin.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
