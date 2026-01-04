import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

export default function Map() {
  // Encoded address for Sukabumi location
  const address = encodeURIComponent("Cipancur rt/rw 05/06 desa padaasih, kecamatan cisaat, kabupaten sukabumi");
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.987654321!2d106.9!3d-6.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${address}!5e0!3m2!1sen!2sid!4v1234567890`;
  const directLink = `https://www.google.com/maps/search/?api=1&query=${address}`;

  return (
    <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden border border-slate-700 shadow-lg group">
      {/* Clickable Wrapper */}
      <a 
        href={directLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors duration-300 cursor-pointer"
        aria-label="Open in Google Maps"
      >
        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2 rounded-full font-bold shadow-xl flex items-center space-x-2 border border-slate-200 dark:border-slate-700">
          <ExternalLink className="h-4 w-4" />
          <span>Buka di Google Maps</span>
        </div>
      </a>

      {/* Map Embed */}
      <iframe
        src={`https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full pointer-events-none grayscale hover:grayscale-0 transition-all duration-500"
        title="Location Map"
      ></iframe>

      {/* Static Overlay for Design */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <MapPin className="h-5 w-5 text-red-500" />
      </div>
    </div>
  );
}
