import React from 'react';
import { jsPDF } from 'jspdf';
import { Download, Award, FileText } from 'lucide-react';

const PDFCertificateGenerator = ({ impactData, user }) => {
  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== BACKGROUND =====
    // Gradient effect using rectangles (simple simulation)
    doc.setFillColor(240, 253, 244); // Very light green
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    doc.setDrawColor(22, 163, 74); // Green-600
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // ===== HEADER =====
    // Logo/Icon area
    doc.setFillColor(22, 163, 74);
    doc.circle(pageWidth / 2, 35, 15, 'F');
    
    // Award icon (simplified)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('♻️', pageWidth / 2, 40, { align: 'center' });

    // Title
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('SERTIFIKAT DAMPAK LINGKUNGAN', pageWidth / 2, 60, { align: 'center' });

    // Subtitle
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Certificate of Environmental Impact', pageWidth / 2, 68, { align: 'center' });

    // ===== DIVIDER LINE =====
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.line(40, 75, pageWidth - 40, 75);

    // ===== CONTENT =====
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Diberikan kepada:', pageWidth / 2, 88, { align: 'center' });

    // Company Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(impactData.user_name || user?.name || 'Unknown', pageWidth / 2, 100, { align: 'center' });

    // Role
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(75, 85, 99);
    const roleText = impactData.role === 'producer' ? 'Penghasil Limbah' : 'Pengolah Limbah';
    doc.text(`sebagai ${roleText}`, pageWidth / 2, 108, { align: 'center' });

    // Achievement text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const achievementText = 'Atas kontribusi nyata dalam mewujudkan ekonomi sirkular dan pembangunan berkelanjutan';
    doc.text(achievementText, pageWidth / 2, 118, { align: 'center', maxWidth: 220 });

    // ===== IMPACT STATS BOX =====
    const boxY = 130;
    const boxHeight = 45;
    
    // Main stats box
    doc.setFillColor(16, 185, 129); // Green-500
    doc.roundedRect(40, boxY, pageWidth - 80, boxHeight, 3, 3, 'F');

    // Stats content
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DAMPAK LINGKUNGAN YANG DIHASILKAN:', pageWidth / 2, boxY + 10, { align: 'center' });

    // Three columns for stats
    const col1X = 70;
    const col2X = pageWidth / 2;
    const col3X = pageWidth - 70;
    const statsY = boxY + 22;

    // Stat 1: Total Waste
    doc.setFontSize(20);
    doc.text(`${impactData.total_waste_managed_kg?.toFixed(1) || 0}`, col1X, statsY, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Kg Limbah', col1X, statsY + 6, { align: 'center' });
    doc.text('Dikelola', col1X, statsY + 11, { align: 'center' });

    // Stat 2: CO2 Prevented
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${impactData.co2_emissions_prevented_kg?.toFixed(1) || 0}`, col2X, statsY, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Kg CO₂', col2X, statsY + 6, { align: 'center' });
    doc.text('Dicegah', col2X, statsY + 11, { align: 'center' });

    // Stat 3: Trees Equivalent
    const treesEquivalent = Math.floor(impactData.co2_emissions_prevented_kg / 0.5) || 0;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${treesEquivalent}`, col3X, statsY, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Pohon', col3X, statsY + 6, { align: 'center' });
    doc.text('Ekuivalen', col3X, statsY + 11, { align: 'center' });

    // ===== FOOTER =====
    const footerY = boxY + boxHeight + 15;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const today = new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    doc.text(`Diterbitkan pada: ${today}`, pageWidth / 2, footerY, { align: 'center' });

    // Digital Signature
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74);
    doc.text('Lumbung Sirkular', pageWidth / 2, footerY + 10, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Platform Ekonomi Sirkular B2B', pageWidth / 2, footerY + 16, { align: 'center' });

    // Verification code
    const verificationCode = `LS-${Date.now()}-${user?.id || 'XXX'}`;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kode Verifikasi: ${verificationCode}`, pageWidth / 2, footerY + 22, { align: 'center' });

    // ===== WATERMARK =====
    doc.setTextColor(229, 231, 235); // Gray-200
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('♻️', pageWidth / 2, pageHeight / 2 + 20, { 
      align: 'center',
      angle: 45,
      renderingMode: 'fill',
      charSpace: 0
    });

    // ===== SAVE PDF =====
    const filename = `Sertifikat_Dampak_${impactData.user_name?.replace(/\s+/g, '_')}_${today}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-6 border border-green-200">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="bg-green-600 p-3 rounded-full">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Sertifikat Dampak Lingkungan
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Unduh sertifikat resmi yang menunjukkan kontribusi Anda dalam mewujudkan ekonomi sirkular. 
            Cocok untuk laporan CSR, presentasi stakeholder, atau dokumentasi sustainability program.
          </p>

          {/* Stats Preview */}
          <div className="bg-white rounded-lg p-4 mb-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {impactData.total_waste_managed_kg?.toFixed(1) || 0}
              </div>
              <div className="text-xs text-gray-600">Kg Limbah</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {impactData.co2_emissions_prevented_kg?.toFixed(1) || 0}
              </div>
              <div className="text-xs text-gray-600">Kg CO₂</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(impactData.co2_emissions_prevented_kg / 0.5) || 0}
              </div>
              <div className="text-xs text-gray-600">Pohon</div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={generateCertificate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download Sertifikat PDF
          </button>

          {/* Info */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 Sertifikat ini dapat digunakan untuk keperluan dokumentasi dan pelaporan CSR
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFCertificateGenerator;