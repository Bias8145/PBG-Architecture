import React from 'react';
import { Play, ExternalLink, Info } from 'lucide-react';
import { isVideo } from '../utils/mediaHelper';
import { motion } from 'framer-motion';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  onClick?: () => void;
  className?: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  imageUrl,
  category,
  onClick,
  className = ''
}: ProjectCardProps) {
  return (
    <motion.div
      layoutId={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`
        group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:-translate-y-1 cursor-pointer
        ${className}
      `}
    >
      {/* Image Container - Aspect Video */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-900">
        {isVideo(imageUrl) ? (
          <video
            src={imageUrl}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10 flex items-center shadow-sm">
            {category}
            {isVideo(imageUrl) && <Play className="h-3 w-3 ml-2 fill-current" />}
          </span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
            <span>View Details</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
          Read more <Info className="ml-1 h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}
