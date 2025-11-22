import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Award, FileText, Factory, Recycle } from 'lucide-react';

const PDFCertificateGenerator = ({ impactData, user }) => {
  const [logoBase64, setLogoBase64] = useState(null);

  // Load logo as base64 on mount
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/logo.png');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    loadLogo();
  }, []);

  const isProducer = impactData.role === 'producer';

  // Fix trees calculation - use CO2 / 21 (as per backend)
  const treesEquivalent = impactData.trees_equivalent || Math.floor((impactData.co2_emissions_prevented_kg || 0) / 21);

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors based on role
    const primaryColor = isProducer ? [34, 197, 94] : [16, 185, 129]; // Green-500 vs Emerald-500
    const secondaryColor = isProducer ? [22, 163, 74] : [5, 150, 105]; // Green-600 vs Emerald-600
    const accentColor = isProducer ? [21, 128, 61] : [4, 120, 87]; // Green-700 vs Emerald-700
    const bgColor = isProducer ? [240, 253, 244] : [236, 253, 245]; // Green-50 vs Emerald-50

    // ===== BACKGROUND =====
    doc.setFillColor(...bgColor);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer Border
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(3);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Inner Border
    doc.setLineWidth(1);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Corner decorations
    const cornerSize = 15;
    doc.setFillColor(...secondaryColor);
    // Top-left
    doc.triangle(12, 12, 12 + cornerSize, 12, 12, 12 + cornerSize, 'F');
    // Top-right
    doc.triangle(pageWidth - 12, 12, pageWidth - 12 - cornerSize, 12, pageWidth - 12, 12 + cornerSize, 'F');
    // Bottom-left
    doc.triangle(12, pageHeight - 12, 12 + cornerSize, pageHeight - 12, 12, pageHeight - 12 - cornerSize, 'F');
    // Bottom-right
    doc.triangle(pageWidth - 12, pageHeight - 12, pageWidth - 12 - cornerSize, pageHeight - 12, pageWidth - 12, pageHeight - 12 - cornerSize, 'F');

    // ===== HEADER WITH LOGO =====
    // Logo circle background
    doc.setFillColor(...primaryColor);
    doc.circle(pageWidth / 2, 35, 18, 'F');

    // Add logo if loaded
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', pageWidth / 2 - 12, 23, 24, 24);
    }

    // Title
    doc.setTextColor(...accentColor);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SERTIFIKAT DAMPAK LINGKUNGAN', pageWidth / 2, 62, { align: 'center' });

    // Subtitle
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Certificate of Environmental Impact', pageWidth / 2, 70, { align: 'center' });

    // Role-specific subtitle
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    const roleSubtitle = isProducer ? 'Sertifikat Penghasil Limbah' : 'Sertifikat Pengolah Limbah';
    doc.text(roleSubtitle, pageWidth / 2, 77, { align: 'center' });

    // ===== DECORATIVE LINE =====
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(50, 82, pageWidth - 50, 82);

    // Small diamond in center
    doc.setFillColor(...primaryColor);
    const diamondX = pageWidth / 2;
    const diamondY = 82;
    const diamondSize = 3;
    doc.triangle(diamondX, diamondY - diamondSize, diamondX + diamondSize, diamondY, diamondX, diamondY + diamondSize, 'F');
    doc.triangle(diamondX, diamondY - diamondSize, diamondX - diamondSize, diamondY, diamondX, diamondY + diamondSize, 'F');

    // ===== CONTENT =====
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Dengan ini diberikan penghargaan kepada:', pageWidth / 2, 92, { align: 'center' });

    // Company/User Name
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    const userName = impactData.user_name || user?.name || 'Unknown';
    doc.text(userName, pageWidth / 2, 105, { align: 'center' });

    // Role Badge
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...secondaryColor);
    const roleText = isProducer ? 'Sebagai Penghasil Limbah Bertanggung Jawab' : 'Sebagai Pengolah Limbah Profesional';
    doc.text(roleText, pageWidth / 2, 114, { align: 'center' });

    // Achievement description - different for each role
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    const achievementText = isProducer
      ? 'Atas kontribusi dalam menyediakan limbah untuk daur ulang dan mendukung ekonomi sirkular'
      : 'Atas kontribusi dalam mengolah limbah menjadi sumber daya baru dan mencegah pencemaran lingkungan';
    doc.text(achievementText, pageWidth / 2, 122, { align: 'center', maxWidth: 200 });

    // ===== IMPACT STATS BOX =====
    const boxY = 132;
    const boxHeight = 42;

    // Stats box background
    doc.setFillColor(...primaryColor);
    doc.roundedRect(45, boxY, pageWidth - 90, boxHeight, 5, 5, 'F');

    // Stats header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const statsHeader = isProducer ? 'DAMPAK LIMBAH YANG DISALURKAN:' : 'DAMPAK LIMBAH YANG DIOLAH:';
    doc.text(statsHeader, pageWidth / 2, boxY + 10, { align: 'center' });

    // Three columns for stats
    const col1X = 80;
    const col2X = pageWidth / 2;
    const col3X = pageWidth - 80;
    const statsY = boxY + 22;

    // Stat 1: Total Waste
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${(impactData.total_waste_managed_kg || 0).toFixed(1)}`, col1X, statsY, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const stat1Label = isProducer ? 'Kg Limbah Disalurkan' : 'Kg Limbah Diolah';
    doc.text(stat1Label, col1X, statsY + 8, { align: 'center' });

    // Stat 2: CO2 Prevented
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${(impactData.co2_emissions_prevented_kg || 0).toFixed(1)}`, col2X, statsY, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Kg CO2 Dicegah', col2X, statsY + 8, { align: 'center' });

    // Stat 3: Trees Equivalent
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${treesEquivalent}`, col3X, statsY, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Pohon Ekuivalen', col3X, statsY + 8, { align: 'center' });

    // ===== FOOTER =====
    const footerY = boxY + boxHeight + 12;

    // Date
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Diterbitkan pada: ${today}`, pageWidth / 2, footerY, { align: 'center' });

    // Signature line
    doc.setDrawColor(156, 163, 175);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 30, footerY + 12, pageWidth / 2 + 30, footerY + 12);

    // Organization Name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text('Lumbung Sirkular', pageWidth / 2, footerY + 5, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Platform Ekonomi Sirkular B2B Indonesia', pageWidth / 2, footerY + 10, { align: 'center' });

    // Verification code
    const verificationCode = `LS-${isProducer ? 'PRD' : 'RCY'}-${Date.now().toString(36).toUpperCase()}-${(user?.id || 0).toString().padStart(4, '0')}`;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(`Kode Verifikasi: ${verificationCode}`, pageWidth / 2, footerY + 28, { align: 'center' });

    // ===== SAVE PDF =====
    const rolePrefix = isProducer ? 'Penghasil' : 'Pengolah';
    const filename = `Sertifikat_${rolePrefix}_${userName.replace(/\s+/g, '_')}_${today.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  };

  return (
    <div className={`rounded-xl shadow-md p-4 sm:p-6 border ${isProducer ? 'bg-gradient-to-r from-green-50 to-lime-50 border-green-200' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'}`}>
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 flex items-center gap-3 sm:block">
          <div className={`p-2.5 sm:p-3 rounded-full ${isProducer ? 'bg-green-600' : 'bg-emerald-600'}`}>
            {isProducer ? (
              <Factory className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            ) : (
              <Recycle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            )}
          </div>
          {/* Title on mobile - next to icon */}
          <h3 className="text-base font-bold text-gray-900 sm:hidden flex items-center gap-2">
            <FileText className={`w-4 h-4 ${isProducer ? 'text-green-600' : 'text-emerald-600'}`} />
            Sertifikat Dampak
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          {/* Title - hidden on mobile, shown on larger screens */}
          <h3 className="hidden sm:flex text-lg font-bold text-gray-900 mb-2 items-center gap-2">
            <FileText className={`w-5 h-5 ${isProducer ? 'text-green-600' : 'text-emerald-600'}`} />
            Sertifikat Dampak {isProducer ? 'Penghasil' : 'Pengolah'} Limbah
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            {isProducer
              ? 'Unduh sertifikat kontribusi Anda sebagai penghasil limbah dalam ekonomi sirkular.'
              : 'Unduh sertifikat kontribusi Anda sebagai pengolah limbah dalam menjaga lingkungan.'
            }
          </p>

          {/* Stats Preview */}
          <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <div className={`text-lg sm:text-2xl font-bold ${isProducer ? 'text-green-600' : 'text-emerald-600'}`}>
                {(impactData.total_waste_managed_kg || 0).toFixed(1)}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600">Kg Limbah</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {(impactData.co2_emissions_prevented_kg || 0).toFixed(1)}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600">Kg CO2</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {treesEquivalent}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600">Pohon</div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={generateCertificate}
            disabled={!logoBase64}
            className={`w-full font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
              isProducer
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            {logoBase64 ? 'Download Sertifikat PDF' : 'Memuat...'}
          </button>

          {/* Info */}
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3 text-center flex items-center justify-center gap-1">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Sertifikat ini dapat digunakan untuk dokumentasi dan pelaporan CSR</span>
            <span className="sm:hidden">Untuk dokumentasi & CSR</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFCertificateGenerator;
