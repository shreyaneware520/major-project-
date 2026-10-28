import { jsPDF } from 'jspdf';

/**
 * Generates a vector PDF for a given report object and triggers download.
 * @param {Object} report - Full report data model
 */
export const generateReportPDF = (report) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Primary palette colors
  const darkBg = [13, 22, 34]; // #0D1622
  const primaryGreen = [0, 204, 106]; // #00CC6A
  const textDark = [30, 41, 59]; // slate-800
  const textMuted = [100, 116, 139]; // slate-500
  const lightBg = [248, 250, 252]; // slate-50

  // Helper: Draw Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Brand title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('KRISHIDRISTI', margin, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...primaryGreen);
  doc.text('SMART FARMING MANAGEMENT SYSTEM • ENTERPRISE ANALYTICS', margin, 23);

  // Document metadata right-aligned in header
  doc.setTextColor(200, 210, 225);
  doc.setFontSize(8);
  doc.text(`REPORT ID: ${report.id || 'REP-2026-001'}`, pageWidth - margin, 14, { align: 'right' });
  doc.text(`DATE: ${report.date || new Date().toISOString().split('T')[0]}`, pageWidth - margin, 19, { align: 'right' });
  doc.text(`AUTHOR: ${report.author || 'System Operator'}`, pageWidth - margin, 24, { align: 'right' });

  y = 45;

  // Title Section
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(report.name || 'Farm Environmental & Crop Report', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textMuted);
  doc.text(`Facility: ${report.room || 'Hydroponics Alpha'}   |   Crop: ${report.crop || 'Romaine Lettuce'}   |   Type: ${report.type || 'Environmental'}`, margin, y);
  y += 10;

  // Horizontal Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Section 1: Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('1. EXECUTIVE SUMMARY & OVERVIEW', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);

  const summaryText = report.summary || 
    'This report contains crop health analysis, environmental readings, and irrigation performance metrics compiled for commercial greenhouse operations.';
  
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 4.5 + 8;

  // Section 2: Environmental Readings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('2. TELEMETRY & ENVIRONMENTAL READINGS', margin, y);
  y += 6;

  // Draw Grid Table for Environmental Parameters
  const readings = report.readings || {
    temperature: '23.4 °C',
    humidity: '68.2 %',
    soilMoisture: '74.5 %',
    soilPh: '6.4 pH',
    lightIntensity: '14,200 Lux',
    waterFlow: '4.2 L/min',
    airQuality: 'Good (AQI 22)',
  };

  const readingItems = [
    { label: 'Ambient Temperature', value: readings.temperature },
    { label: 'Relative Humidity', value: readings.humidity },
    { label: 'Soil Moisture Saturation', value: readings.soilMoisture },
    { label: 'Soil / Water pH', value: readings.soilPh },
    { label: 'Light Intensity (PAR)', value: readings.lightIntensity },
    { label: 'Irrigation Flow Rate', value: readings.waterFlow },
    { label: 'Air Quality Index', value: readings.airQuality || 'Optimal' },
    { label: 'Target System Status', value: report.status || 'Available' },
  ];

  const colWidth = contentWidth / 2 - 2;
  const rowHeight = 8;
  
  readingItems.forEach((item, index) => {
    const isSecondCol = index % 2 === 1;
    const currentX = isSecondCol ? margin + colWidth + 4 : margin;
    const currentY = y + Math.floor(index / 2) * rowHeight;

    // Fill background for row
    doc.setFillColor(...lightBg);
    doc.rect(currentX, currentY, colWidth, rowHeight - 1, 'F');

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(item.label, currentX + 3, currentY + 5);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text(String(item.value), currentX + colWidth - 3, currentY + 5, { align: 'right' });
  });

  y += Math.ceil(readingItems.length / 2) * rowHeight + 10;

  // Section 3: Crop Analysis & Yield Prediction
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('3. CROP ANALYSIS & YIELD PREDICTION', margin, y);
  y += 6;

  const cropAnalysis = report.cropAnalysis || {
    growthStage: 'Vegetative (Week 4 of 6)',
    cropHealth: '96% Optimal',
    diseaseStatus: 'No Pathogens Detected',
    yieldPrediction: '480 kg projected harvest',
    harvestReadiness: '12 Days Remaining',
  };

  const analysisItems = [
    { label: 'Current Growth Stage', value: cropAnalysis.growthStage },
    { label: 'Crop Health Index', value: cropAnalysis.cropHealth },
    { label: 'Pathogen / Disease Status', value: cropAnalysis.diseaseStatus },
    { label: 'Projected Yield Output', value: cropAnalysis.yieldPrediction },
    { label: 'Estimated Harvest Date', value: cropAnalysis.harvestReadiness },
  ];

  analysisItems.forEach((item) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 7, 'DF');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(item.label, margin + 4, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text(String(item.value), pageWidth - margin - 4, y + 4.5, { align: 'right' });

    y += 8;
  });

  y += 6;

  // Section 4: Actionable Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('4. AGRONOMIST RECOMMENDATIONS', margin, y);
  y += 6;

  const recommendations = report.recommendations || [
    'Maintain target automated irrigation schedule (4.2 L/min duty cycle).',
    'Slightly increase Red-spectrum LED lighting by 5% during peak photosynthetic hours.',
    'Monitor relative humidity thresholds every 2 hours to prevent tip-burn.',
    'Inspect EC and nutrient solution reservoir levels at scheduled shift change.',
  ];

  recommendations.forEach((rec, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);

    const bulletText = `${idx + 1}.  ${rec}`;
    const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 5);
    doc.text(splitBullet, margin + 2, y);
    y += splitBullet.length * 4.5 + 2;
  });

  // Footer on Page
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text('KrishiDristi Automated Telemetry Report • Confidential & Proprietary', margin, pageHeight - 9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, pageHeight - 9, { align: 'right' });

  // Save PDF file
  const sanitizedName = (report.name || 'Report')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `${sanitizedName}_${report.id || 'REP'}.pdf`;

  doc.save(filename);
};
