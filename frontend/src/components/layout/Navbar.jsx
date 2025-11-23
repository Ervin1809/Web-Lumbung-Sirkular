// 1. TAMBAHKAN useMemo DISINI
import React, { useState, useEffect, useRef, useMemo } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Package, ShoppingBag, Home, Store, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  
  const navRef = useRef(null);
  const itemsRef = useRef([]);

  // --- PERBAIKAN DISINI ---
  // Kita gunakan useMemo agar variable ini tidak dibuat ulang setiap kali render
  // Ini memutus rantai infinite loop
  const visibleNavItems = useMemo(() => {
    const allNavItems = [
      { path: '/', label: 'Home', icon: <Home size={18} /> },
      { path: '/marketplace', label: 'Marketplace', icon: <Store size={18} /> },
      { path: '/my-wastes', label: 'Limbah Saya', icon: <Package size={18} />, role: 'producer' },
      { path: '/my-bookings', label: 'Booking Saya', icon: <ShoppingBag size={18} />, role: 'recycler' },
      { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, authOnly: true },
    ];

    return allNavItems.filter(item => {
      if (item.authOnly && !isAuthenticated) return false;
      if (item.role && user?.role !== item.role) return false;
      return true;
    });
  }, [isAuthenticated, user?.role]); // Hanya hitung ulang jika status login/role berubah

  // --- LOGIKA Scroll & Indicator ---

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const activeIndex = visibleNavItems.findIndex(item => item.path === location.pathname);
    
    if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
      const currentEl = itemsRef.current[activeIndex];
      setIndicatorStyle({
        left: currentEl.offsetLeft,
        width: currentEl.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, visibleNavItems]); // Sekarang aman karena visibleNavItems stabil berkat useMemo

  // Handler Resize agar indicator tetap responsif
  useEffect(() => {
      const handleResize = () => {
        const activeIndex = visibleNavItems.findIndex(item => item.path === location.pathname);
        if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
          const currentEl = itemsRef.current[activeIndex];
          setIndicatorStyle({
            left: currentEl.offsetLeft,
            width: currentEl.offsetWidth,
            opacity: 1
          });
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname, visibleNavItems]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-[#064e3b]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10' 
          : 'bg-[#064e3b] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          
          {/* LOGO AREA */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-2 bg-emerald-500/50 rounded-full opacity-0 group-hover:opacity-40 blur-md transition duration-500"></div>
              <img src="/logo.png" alt="Lumbung Sirkular" className="relative w-9 h-9 sm:w-10 sm:h-10 transform group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight leading-none drop-shadow-md">
                Lumbung<span className="text-emerald-400">Sirkular</span>
              </span>
              <span className="text-[10px] text-emerald-200 tracking-widest uppercase hidden sm:block">Sustainable Waste Solution</span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center ml-8 relative" ref={navRef}>
            
            {/* Sliding Indicator */}
            <div 
              className="absolute h-full top-0 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
                boxShadow: '0 4px 20px -2px rgba(16, 185, 129, 0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)'
              }}
            >
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-emerald-400 rounded-t-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            </div>

            {/* Menu Items */}
            {visibleNavItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  ref={el => itemsRef.current[index] = el}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-emerald-100 hover:text-white'
                  }`}
                >
                  <span className={`transition-all duration-300 ${isActive ? 'text-emerald-300 scale-110' : 'group-hover:text-emerald-300'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {isAuthenticated ? (
               <button
               onClick={handleLogout}
               className="ml-6 relative px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-medium transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-white flex items-center gap-2 backdrop-blur-sm group"
             >
               <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
               <span>Logout</span>
             </button>
            ) : (
              <div className="flex items-center gap-3 ml-8 border-l border-white/10 pl-6">
                <Link to="/login" className="px-4 py-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/5 transition-all font-medium">
                  Login
                </Link>
                <Link to="/register" className="relative px-5 py-2 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-100 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION LIST */}
        <div 
          className={`md:hidden absolute left-0 right-0 top-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
          }`}
        >
          <div className="mx-4 my-2 rounded-2xl bg-[#064e3b]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 space-y-1">
            {visibleNavItems.map((item, index) => (
               <MobileLink 
                 key={index} 
                 to={item.path} 
                 icon={item.icon} 
                 text={item.label} 
                 closeMenu={() => setIsMenuOpen(false)} 
                 active={location.pathname === item.path} 
               />
            ))}
             <div className="h-px bg-white/10 my-2" />
             {isAuthenticated ? (
               <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 flex items-center gap-3 font-medium">
                 <LogOut size={18} /> Logout
               </button>
             ) : (
               <div className="grid grid-cols-2 gap-2 p-2">
                 <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex justify-center py-3 rounded-xl bg-white/5 text-emerald-100 border border-white/10">Login</Link>
                 <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex justify-center py-3 rounded-xl bg-emerald-500 text-white">Daftar</Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper Component MobileLink
const MobileLink = ({ to, icon, text, closeMenu, active }) => (
  <Link
    to={to}
    onClick={closeMenu}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
      active ? 'bg-white/10 text-white border border-white/10' : 'text-emerald-100 hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-emerald-400' : 'text-emerald-500/70'}>{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
    {active && <ChevronRight size={16} className="text-emerald-400" />}
  </Link>
);

export default Navbar;