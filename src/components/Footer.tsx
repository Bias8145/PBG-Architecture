import React from 'react';
import { MapPin, Phone, Mail, Globe2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-slate-900 dark:bg-black text-white pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">Jasa Desain PBG</h3>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              {t.hero.subheadline}
            </p>
            <div className="flex items-center space-x-2 text-blue-400 bg-blue-900/20 px-4 py-2 rounded-lg inline-flex border border-blue-900/50">
              <Globe2 className="h-5 w-5" />
              <span className="font-medium">{t.contact.area}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-slate-800 pb-2 inline-block">
              {t.contact.title}
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-900/30 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm leading-relaxed">
                  Cipancur rt/rw 05/06 desa padaasih, kecamatan cisaat, kabupaten sukabumi
                </span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-900/30 transition-colors">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <a href="https://wa.me/6282113372895" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                  082113372895
                </a>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-900/30 transition-colors">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <a href="mailto:ahmadguruh989@gmail.com" className="text-slate-300 hover:text-white transition-colors">
                  ahmadguruh989@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Map Placeholder */}
          <div>
             <h4 className="text-lg font-semibold mb-6 text-white border-b border-slate-800 pb-2 inline-block">
              Location
            </h4>
            <div className="w-full h-48 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-500 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <MapPin className="h-12 w-12 text-blue-500 relative z-10" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Jasa Desain PBG. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
