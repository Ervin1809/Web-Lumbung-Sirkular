import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tentang Kami', path: '/about' },
    { name: 'Kontak', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-4 h-4" />, url: 'https://facebook.com', name: 'Facebook' },
    { icon: <Twitter className="w-4 h-4" />, url: 'https://twitter.com', name: 'Twitter' },
    { icon: <Instagram className="w-4 h-4" />, url: 'https://instagram.com/rzkaaa.08', name: 'Instagram' },
    { icon: <Linkedin className="w-4 h-4" />, url: 'https://linkedin.com', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Mobile: Compact Layout */}
        <div className="lg:hidden">
          {/* Brand & Social */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Lumbung Sirkular" className="w-8 h-8" />
              <span className="text-lg font-bold text-white">Lumbung Sirkular</span>
            </Link>
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white p-2 rounded-lg transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - 2 columns */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-sm text-gray-400 hover:text-green-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Contact - Compact */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-6">
            <a href="mailto:info@lumbungsirkular.id" className="flex items-center gap-1.5 hover:text-green-500">
              <Mail className="w-3.5 h-3.5" />
              info@lumbungsirkular.id
            </a>
            <a href="tel:+6281234567890" className="flex items-center gap-1.5 hover:text-green-500">
              <Phone className="w-3.5 h-3.5" />
              +62 812-3456-7890
            </a>
          </div>

          {/* Copyright Mobile */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
            © {currentYear} Lumbung Sirkular. Made with <Heart className="w-3 h-3 text-red-500 inline" /> for sustainability.
          </div>
        </div>

        {/* Desktop: Full Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <img
                  src="/logo.png"
                  alt="Lumbung Sirkular"
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">Lumbung Sirkular</h3>
                  <p className="text-xs text-gray-400">Circular Economy</p>
                </div>
              </Link>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Platform marketplace B2B untuk ekonomi sirkular yang menghubungkan penghasil dengan pengolah limbah.
              </p>
              <div className="space-y-2">
                <a href="mailto:info@lumbungsirkular.id" className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500">
                  <Mail className="w-4 h-4 text-green-500" />
                  info@lumbungsirkular.id
                </a>
                <a href="tel:+6281234567890" className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-500">
                  <Phone className="w-4 h-4 text-green-500" />
                  +62 812-3456-7890
                </a>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Makassar, Indonesia
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                {['Marketplace', 'Dashboard', 'Tentang Kami', 'Cara Kerja'].map((name, i) => (
                  <li key={i}>
                    <Link to={`/${name.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-400 hover:text-green-500 transition-colors">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Sumber Daya</h4>
              <ul className="space-y-2">
                {['Panduan Penghasil', 'Panduan Pengolah', 'FAQ', 'Blog'].map((name, i) => (
                  <li key={i}>
                    <Link to="#" className="text-sm text-gray-400 hover:text-green-500 transition-colors">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-3">
                Dapatkan update terbaru tentang ekonomi sirkular
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-2 mt-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white p-2 rounded-lg transition-all"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              © {currentYear} Lumbung Sirkular. Made with
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              for a sustainable future.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-green-500">Syarat & Ketentuan</Link>
              <Link to="/privacy" className="hover:text-green-500">Privasi</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600"></div>
    </footer>
  );
};

export default Footer;
