import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { type Employee } from '../types';
import { type IdCardDesignConfig } from '@/features/settings/id-card-templates/types';

async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = error => reject(error);
    img.src = imageUrl;
  });
}

export async function generateIdCardsPdf(employees: Employee[], config: IdCardDesignConfig): Promise<string> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: [2.125, 3.375] });

  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i];
    if (i > 0) doc.addPage();

    doc.setFillColor(config.primary_color || '#171f27');
    doc.rect(0, 0, 2.125, 3.375, 'F');

    doc.setFillColor('#ffffff');
    doc.rect(0, 1.68, 2.125, 1.697, 'F');

    if (config.logo_url) {
      try {
        doc.addImage(config.logo_url, 'PNG', 0.76, 0.1, 0.6, 0.23);
      } catch (e) { console.warn("Logo failed to load"); }
    }

    doc.setFillColor('#ffffff');
    doc.circle(1.063, 1.447, 0.473, 'F');

    if (employee.image_url) {
      try {
        const base64Img = await getBase64ImageFromUrl(employee.image_url);
        doc.addImage(base64Img, 'PNG', 0.633, 1.015, 0.86, 0.86);
      } catch (e) {
        console.warn("Profile image failed");
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(config.primary_color || '#171f27');
    doc.text(employee.name.toUpperCase(), 1.0625, 2.15, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.text(employee.designation?.name || 'Employee', 1.0625, 2.267, { align: 'center' });

    doc.setFontSize(6);
    const startY = 2.45;
    const lineHeight = 0.12;
    const details = [{ label: 'Staff Id', value: employee.staff_id }];

    if (config.show_address && employee.address) details.push({ label: 'Address', value: employee.address });
    if (config.show_phone && employee.phone_number) details.push({ label: 'Phone', value: employee.phone_number });

    details.forEach((detail, idx) => {
      const y = startY + (idx * lineHeight);
      doc.setFont('helvetica', 'bold');
      doc.text(detail.label + ':', 0.1, y);
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value, 0.5, y);
    });

    if (config.show_qr_code && employee.staff_id) {
      try {
        const qrDataUrl = await QRCode.toDataURL(employee.staff_id, { margin: 1 });
        doc.addImage(qrDataUrl, 'PNG', 1.6, 2.8, 0.4, 0.4);
      } catch (e) { console.warn("QR Code failed"); }
    }
  }

  // Force explicitly converting to a string
  return String(doc.output('bloburl'));
}