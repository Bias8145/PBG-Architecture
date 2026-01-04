import React from 'react';
import { MapPin, Phone, Mail, Globe2, ArrowUpRight, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Map from './Map';

interface FooterLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

export default function Footer() {
  const { t } = useLanguage();

  const contactLinks: FooterLink[] = [
    { label: 'WhatsApp', href: 'https://wa.me/6282113372895', icon: Phone },
    { label: 'Email', href: 'mailto:ahmadguruh989@gmail.com', icon: Mail },
  ];

  return (
    <footer id="contact" className="bg-slate-50 dark:bg-black pt-20 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Container */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Brand & Info Column */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Jasa Desain PBG
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  {t.hero.subheadline}
                </p>
              </div>

              <div className="flex items-center gap-x-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-2xl w-fit border border-blue-100 dark:border-blue-900/30">
                <Globe2 className="h-5 w-5" />
                <span className="font-semibold">{t.contact.area}</span>
              </div>

              {/* Social/Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group font-medium"
                    aria-label={link.label}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Address Column */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                  {t.contact.address}
                </h4>
                <div className="flex items-start gap-x-4 group">
                  <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                    Cipancur rt/rw 05/06 desa padaasih, <br/>
                    kecamatan cisaat, <br/>
                    kabupaten sukabumi
                  </p>
                </div>
              </div>
              
              {/* Decorative Line for Desktop */}
              <div className="hidden lg:block h-px w-full bg-slate-100 dark:bg-slate-800 mt-8"></div>
            </div>

            {/* Map Column */}
            <div className="lg:col-span-4 h-64 lg:h-auto">
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 ring-4 ring-slate-50 dark:ring-slate-800/50">
                <Map />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} Jasa Desain PBG. All rights reserved.</p>
            <div className="flex gap-x-6">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
