import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Share2, ZoomIn, Download, X, ChevronLeft, ChevronRight, Play, Hand } from 'lucide-react';
import { supabase, PortfolioItem } from '../lib/supabase';
import { isVideo } from '../utils/mediaHelper';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchProject(id);
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!project?.gallery) return;
    setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!project?.gallery) return;
    setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `project-${project?.title}-${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
      // Fallback: Open in new tab
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) return null;

  // Use gallery if available, otherwise fallback to single image
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image_url];
  const currentMedia = gallery[currentImageIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8 sticky top-20 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-100 dark:border-slate-800">
          <Link 
            to="/#portfolio" 
            className="inline-flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold group"
          >
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="hidden sm:inline">{t.project.back}</span>
          </Link>
          
          <div className="flex items-center space-x-3">
             <button 
                onClick={() => handleDownload(currentMedia)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-sm font-bold transition-colors"
             >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t.project.download}</span>
             </button>
             <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors shadow-lg shadow-blue-500/30">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t.project.share}</span>
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Gallery Slider */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video w-full bg-slate-100 dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group"
            >
              {/* Main Media Display */}
              <div 
                className="w-full h-full cursor-zoom-in relative"
                onClick={() => setIsLightboxOpen(true)}
              >
                {isVideo(currentMedia) ? (
                  <video 
                    src={currentMedia} 
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img 
                    src={currentMedia} 
                    alt={`${project.title} - view ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                  />
                )}
                
                {/* Hover Overlay Hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                   <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center shadow-lg">
                      <ZoomIn className="h-4 w-4 mr-2" />
                      {t.project.zoomHint}
                   </div>
                </div>
              </div>

              {/* Slider Controls */}
              {gallery.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 border border-white/20 hidden md:block"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all hover:scale-110 border border-white/20 hidden md:block"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {gallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>

                  {/* Mobile Swipe Hint */}
                  <div className="absolute bottom-4 right-4 md:hidden bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center animate-pulse">
                    <Hand className="h-3 w-3 mr-1" />
                    Swipe
                  </div>
                </>
              )}
            </motion.div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {gallery.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    {isVideo(url) ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Project Info */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 sticky top-32 shadow-sm"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold tracking-wide flex items-center border border-blue-200 dark:border-blue-800">
                  <Tag className="h-3 w-3 mr-2" />
                  {project.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {project.title}
              </h1>

              <div className="prose prose-slate dark:prose-invert mb-8">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Interested in this?</h4>
                <a 
                  href="https://wa.me/6282113372895" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-1"
                >
                  {t.project.consult}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
              <span className="text-white/80 text-sm font-medium ml-4">
                {currentImageIndex + 1} / {gallery.length}
              </span>
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(currentMedia); }}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Download"
                >
                  <Download className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image */}
            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center">
              {isVideo(currentMedia) ? (
                <video 
                  src={currentMedia} 
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img 
                  src={currentMedia} 
                  alt="Full screen view" 
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                />
              )}
            </div>

            {/* Navigation Arrows (Lightbox) */}
            {gallery.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
              </>
            )}
            
            {/* Bottom Thumbnails (Lightbox) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-[90vw] p-2 scrollbar-hide" onClick={(e) => e.stopPropagation()}>
               {gallery.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentImageIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    {isVideo(url) ? (
                       <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Play className="h-4 w-4 text-white"/></div>
                    ) : (
                       <img src={url} className="w-full h-full object-cover" />
                    )}
                  </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
