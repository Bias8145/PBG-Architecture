import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase, PortfolioItem } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Save, Upload, Link as LinkIcon, Image as ImageIcon, Video, Layers } from 'lucide-react';
import { isVideo } from '../utils/mediaHelper';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Architecture');
  
  // Gallery Management
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsUploading(true);

    try {
      // 1. Upload new files
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const url = await handleFileUpload(file);
        uploadedUrls.push(url);
      }

      // 2. Combine existing URLs with new uploaded URLs
      const finalGallery = [...galleryUrls, ...uploadedUrls];
      
      // Ensure we have at least one image
      if (finalGallery.length === 0) {
        throw new Error("Please add at least one image or video.");
      }

      // 3. The first image in the gallery becomes the main thumbnail
      const mainImageUrl = finalGallery[0];

      const payload = {
        title,
        description,
        image_url: mainImageUrl, // Backward compatibility & Thumbnail
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
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setDescription(item.description);
      setCategory(item.category);
      // Initialize gallery with existing data
      // Fallback to [image_url] if gallery is empty (legacy data)
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

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-8 pt-20">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.admin.dashboardTitle}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>{t.admin.addProject}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
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
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      {isVideo(item.image_url) ? (
                        <div className="h-12 w-16 bg-black rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <img src={item.image_url} alt={item.title} className="h-12 w-16 object-cover rounded border border-slate-200 dark:border-slate-600" />
                      )}
                      {item.gallery && item.gallery.length > 1 && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-slate-800 flex items-center">
                          <Layers className="h-3 w-3 mr-0.5" />
                          {item.gallery.length}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.title}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-100 dark:border-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openModal(item)}
                      className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingItem ? t.admin.editProject : t.admin.addProject}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.projectTitle}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.category}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Structure">Structure</option>
                    <option value="MEP">MEP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.admin.gallery}</label>
                
                {/* File Dropzone */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-slate-50 dark:bg-slate-900/50 mb-4">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple // Enable multiple files
                    onChange={(e) => {
                      if (e.target.files) {
                        setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-2" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{t.admin.dropzone}</span>
                  </label>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {/* Existing Gallery Items */}
                  {galleryUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {isVideo(url) ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Existing
                      </div>
                    </div>
                  ))}

                  {/* New Files to Upload */}
                  {newFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-blue-400 dark:border-blue-600">
                      {file.type.startsWith('video/') ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      ) : (
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-1">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.admin.projectDesc}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {t.admin.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>{isUploading ? t.admin.uploading : t.admin.saving}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{t.admin.save}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
