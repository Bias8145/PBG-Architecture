import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

type Translations = {
  [key in Language]: {
    nav: {
      home: string;
      services: string;
      portfolio: string;
      contact: string;
      login: string;
      dashboard: string;
      logout: string;
    };
    hero: {
      headline: string;
      subheadline: string;
      cta: string;
    };
    services: {
      title: string;
      arch: {
        title: string;
        desc: string;
      };
      structure: {
        title: string;
        desc: string;
      };
      mep: {
        title: string;
        desc: string;
      };
    };
    portfolio: {
      title: string;
      subtitle: string;
      empty: string;
    };
    contact: {
      title: string;
      address: string;
      phone: string;
      email: string;
      area: string;
    };
    admin: {
      loginTitle: string;
      email: string;
      password: string;
      signIn: string;
      dashboardTitle: string;
      addProject: string;
      editProject: string;
      projectTitle: string;
      projectDesc: string;
      image: string;
      uploadImage: string;
      orUrl: string;
      imageUrl: string;
      category: string;
      save: string;
      saving: string;
      cancel: string;
      delete: string;
      actions: string;
      uploading: string;
      gallery: string;
      dropzone: string;
      remove: string;
    };
    project: {
      back: string;
      share: string;
      consult: string;
      download: string;
      zoomHint: string;
    }
  };
};

const translations: Translations = {
  id: {
    nav: {
      home: 'Beranda',
      services: 'Layanan',
      portfolio: 'Portofolio',
      contact: 'Kontak',
      login: 'Masuk Admin',
      dashboard: 'Dashboard',
      logout: 'Keluar',
    },
    hero: {
      headline: 'Wujudkan Bangunan Impian Anda Bersama Ahli',
      subheadline: 'Jasa Desain Arsitektur, Perhitungan Struktur, dan MEP Terpercaya untuk Hunian Komersil & Non-Komersil.',
      cta: 'Konsultasi Sekarang',
    },
    services: {
      title: 'Layanan Kami',
      arch: {
        title: 'Desain Arsitektur',
        desc: 'Perencanaan estetika dan fungsi ruang untuk rumah tinggal, ruko, dan bangunan komersil lainnya.',
      },
      structure: {
        title: 'Perhitungan Struktur',
        desc: 'Analisis kekuatan bangunan untuk memastikan keamanan dan ketahanan jangka panjang.',
      },
      mep: {
        title: 'Perhitungan MEP',
        desc: 'Perencanaan Mekanikal, Elektrikal, dan Plumbing yang efisien dan sesuai standar.',
      },
    },
    portfolio: {
      title: 'Proyek Sukses',
      subtitle: 'Bukti nyata dedikasi kami dalam setiap pembangunan.',
      empty: 'Belum ada proyek yang ditampilkan.',
    },
    contact: {
      title: 'Hubungi Kami',
      address: 'Alamat',
      phone: 'WhatsApp / Telp',
      email: 'Email',
      area: 'Jangkauan Layanan: Seluruh Indonesia',
    },
    admin: {
      loginTitle: 'Login Admin',
      email: 'Email',
      password: 'Kata Sandi',
      signIn: 'Masuk',
      dashboardTitle: 'Manajemen Portofolio',
      addProject: 'Tambah Proyek Baru',
      editProject: 'Edit Proyek',
      projectTitle: 'Judul Proyek',
      projectDesc: 'Deskripsi',
      image: 'Foto Utama (Thumbnail)',
      uploadImage: 'Unggah File',
      orUrl: 'atau URL',
      imageUrl: 'URL Media',
      category: 'Kategori',
      save: 'Simpan',
      saving: 'Menyimpan...',
      cancel: 'Batal',
      delete: 'Hapus',
      actions: 'Aksi',
      uploading: 'Mengunggah...',
      gallery: 'Galeri Proyek (Multi-Upload)',
      dropzone: 'Klik untuk memilih banyak foto/video sekaligus',
      remove: 'Hapus',
    },
    project: {
      back: 'Kembali',
      share: 'Bagikan',
      consult: 'Konsultasi Sekarang',
      download: 'Simpan',
      zoomHint: 'Klik gambar untuk memperbesar',
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
      login: 'Admin Login',
      dashboard: 'Dashboard',
      logout: 'Logout',
    },
    hero: {
      headline: 'Build Your Dream Structure with Experts',
      subheadline: 'Trusted Architectural Design, Structural Calculation, and MEP Services for Commercial & Non-Commercial Buildings.',
      cta: 'Consult Now',
    },
    services: {
      title: 'Our Services',
      arch: {
        title: 'Architectural Design',
        desc: 'Aesthetic and functional planning for residential homes, shophouses, and other commercial buildings.',
      },
      structure: {
        title: 'Structural Calculation',
        desc: 'Building strength analysis to ensure long-term safety and durability.',
      },
      mep: {
        title: 'MEP Calculation',
        desc: 'Efficient Mechanical, Electrical, and Plumbing planning compliant with standards.',
      },
    },
    portfolio: {
      title: 'Success Projects',
      subtitle: 'Real proof of our dedication in every construction.',
      empty: 'No projects displayed yet.',
    },
    contact: {
      title: 'Contact Us',
      address: 'Address',
      phone: 'WhatsApp / Phone',
      email: 'Email',
      area: 'Service Area: All Across Indonesia',
    },
    admin: {
      loginTitle: 'Admin Login',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      dashboardTitle: 'Portfolio Management',
      addProject: 'Add New Project',
      editProject: 'Edit Project',
      projectTitle: 'Project Title',
      projectDesc: 'Description',
      image: 'Main Photo (Thumbnail)',
      uploadImage: 'Upload File',
      orUrl: 'or URL',
      imageUrl: 'Media URL',
      category: 'Category',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      delete: 'Delete',
      actions: 'Actions',
      uploading: 'Uploading...',
      gallery: 'Project Gallery (Multi-Upload)',
      dropzone: 'Click to select multiple photos/videos',
      remove: 'Remove',
    },
    project: {
      back: 'Back',
      share: 'Share',
      consult: 'Consult Now',
      download: 'Save',
      zoomHint: 'Click image to zoom',
    }
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations['id'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('id');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
