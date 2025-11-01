export interface ExportColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: any) => string;
}

export class ExportService {
  /**
   * Export data to CSV
   */
  static toCSV<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn<T>[],
    filename: string
  ) {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Create CSV header
    const headers = columns.map((col) => col.label);
    
    // Create CSV rows
    const rows = data.map((item) =>
      columns.map((col) => {
        const value = item[col.key];
        const formatted = col.format ? col.format(value) : value;
        
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(formatted ?? '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
    );

    // Combine headers and rows
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM for Excel
    this.downloadBlob(blob, `${filename}.csv`);
  }

  /**
   * Export data to Excel (using CSV format compatible with Excel)
   */
  static toExcel<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn<T>[],
    filename: string
  ) {
    // For now, use CSV format (most compatible)
    // For true .xlsx, you'd need a library like xlsx or exceljs
    this.toCSV(data, columns, filename);
  }

  /**
   * Export table to PDF (requires jsPDF)
   */
  static async toPDF(
    elementId: string,
    filename: string,
    options?: {
      orientation?: 'portrait' | 'landscape';
      title?: string;
    }
  ) {
    // You'll need to install: npm install jspdf jspdf-autotable
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({
      orientation: options?.orientation || 'landscape',
    });

    if (options?.title) {
      doc.setFontSize(16);
      doc.text(options.title, 14, 15);
    }

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Extract table data
    const table = element.querySelector('table');
    if (!table) {
      throw new Error('No table found in element');
    }

    autoTable(doc, {
      html: table,
      startY: options?.title ? 25 : 20,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`${filename}.pdf`);
  }

  /**
   * Helper to download blob
   */
  private static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

//   const handleExportCSV = () => {
//     try {
//       const columns: ExportColumn<Product>[] = [
//         { key: 'productId', label: 'Product ID' },
//         { key: 'categoryName', label: 'Category' },
//         { key: 'productName', label: 'Product Name' },
//         { 
//           key: 'basePrice', 
//           label: 'Base Price',
//           format: (value) => Formatters.rupiah(value),
//         },
//         { 
//           key: 'sellingPrice', 
//           label: 'Selling Price',
//           format: (value) => Formatters.rupiah(value),
//         },
//         { key: 'unit', label: 'Unit' },
//         { key: 'status', label: 'Status' },
//       ];

//       ExportService.toCSV(data, columns, `products-${Date.now()}`);
//       toast.success('Products exported successfully');
//     } catch (error) {
//       toast.error(error);
//     }
//   };

//   const handleExportPDF = async () => {
//     try {
//       await ExportService.toPDF('product-table', `products-${Date.now()}`, {
//         orientation: 'landscape',
//         title: 'Product List',
//       });
//       toast.success('PDF exported successfully');
//     } catch (error) {
//       toast.error(error);
//     }
//   };
}