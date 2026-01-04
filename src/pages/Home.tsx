import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Home as HomeIcon, Zap, ArrowRight, Play, Info, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase, PortfolioItem } from '../lib/supabase';
import { isVideo } from '../utils/mediaHelper';

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (id: string) => {
    if (selectedProjectId === id) {
      // Second click: Navigate to detail page
      navigate(`/project/${id}`);
    } else {
      // First click: Show description overlay
      setSelectedProjectId(id);
    }
  };

  const services = [
    {
      icon: <HomeIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: t.services.arch.title,
      desc: t.services.arch.desc,
    },
    {
      icon: <Ruler className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: t.services.structure.title,
      desc: t.services.structure.desc,
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: t.services.mep.title,
      desc: t.services.mep.desc,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2070" 
            alt="Architecture Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900"></div>
        </div>

        {/* Animated Grid Lines (Futuristic Touch) */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }}>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
              Professional Engineering Services
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white tracking-tight">
              {t.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              {t.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/6282113372895" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center justify-center"
              >
                {t.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#portfolio"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-600 hover:border-white text-slate-300 hover:text-white font-semibold rounded-lg transition-all flex items-center justify-center"
              >
                View Projects
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">{t.services.title}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">{t.portfolio.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.portfolio.subtitle}</p>
          </div>

          {loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
          ) : portfolioItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  onClick={() => handleProjectClick(item.id)}
                  className={`group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] bg-slate-900 cursor-pointer border border-slate-200 dark:border-slate-800 transition-all duration-300 ${selectedProjectId === item.id ? 'ring-4 ring-blue-500/50' : ''}`}
                >
                  {/* Media */}
                  {isVideo(item.image_url) ? (
                    <video 
                      src={item.image_url} 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10 flex items-center">
                      {item.category}
                      {isVideo(item.image_url) && <Play className="h-3 w-3 ml-2 fill-current" />}
                    </span>
                  </div>

                  {/* Overlay - Always visible on hover for desktop, or when selected */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent flex flex-col justify-end p-6 transition-all duration-300 ${selectedProjectId === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    
                    {/* Description Preview */}
                    <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    {/* Action Hint */}
                    <div className="flex items-center text-blue-400 text-sm font-semibold">
                      {selectedProjectId === item.id ? (
                        <>
                          <span>Click again to view details</span>
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <span>Click for info</span>
                          <Info className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">{t.portfolio.empty}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
