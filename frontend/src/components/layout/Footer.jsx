import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Tentang Kami', path: '/about' },
      { name: 'Cara Kerja', path: '/how-it-works' },
      { name: 'Marketplace', path: '/marketplace' },
      { name: 'Dashboard', path: '/dashboard' },
    ],
    resources: [
      { name: 'Panduan Penghasil', path: '/guide/producer' },
      { name: 'Panduan Pengolah', path: '/guide/recycler' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Blog', path: '/blog' },
    ],
    legal: [
      { name: 'Syarat & Ketentuan', path: '/terms' },
      { name: 'Kebijakan Privasi', path: '/privacy' },
      { name: 'Kebijakan Cookie', path: '/cookies' },
      { name: 'Kontak', path: '/contact' },
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, url: 'https://facebook.com', name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com', name: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/rzkaaa.08', name: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com', name: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Lumbung Sirkular</h3>
                <p className="text-xs text-gray-400">Circular Economy</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Platform marketplace B2B untuk ekonomi sirkular yang menghubungkan penghasil limbah dengan pengolah limbah, menciptakan nilai dari material yang berkelanjutan.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-green-500" />
                <a href="mailto:info@lumbungsirkular.id" className="hover:text-green-500 transition-colors">
                  info@lumbungsirkular.id
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-green-500" />
                <a href="tel:+6281234567890" className="hover:text-green-500 transition-colors">
                  +62 812-3456-7890
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-400">
                  Makassar, Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Sumber Daya</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Legal</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
              <h5 className="text-white font-semibold mb-2 text-sm">Newsletter</h5>
              <p className="text-xs text-gray-400 mb-3">
                Dapatkan update terbaru tentang ekonomi sirkular
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              © {currentYear} Lumbung Sirkular. All rights reserved. Made with
              <Heart className="w-4 h-4 text-red-500 inline animate-pulse" />
              for a sustainable future.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 text-gray-400 hover:text-white p-2.5 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600"></div>
    </footer>
  );
};

export default Footer;
