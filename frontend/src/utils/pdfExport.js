import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
/**
 * Directly downloads an HTML element as a clean A4 PDF file using jsPDF and html2canvas.
 * This completely bypasses any iframe print restrictions or browser popup blocks.
 */
export async function downloadElementAsPdf(elementOrSelector, fileName = 'PK_Workspace_Document.pdf') {
    try {
        let el = null;
        if (typeof elementOrSelector === 'string') {
            el = document.querySelector(elementOrSelector) || document.getElementById(elementOrSelector);
        }
        else {
            el = elementOrSelector;
        }
        if (!el) {
            el = document.querySelector('main') || document.body;
        }
        // Hide no-print elements temporarily
        const noPrintNodes = el.querySelectorAll('.no-print');
        const originalDisplays = [];
        noPrintNodes.forEach((node, i) => {
            originalDisplays[i] = node.style.display;
            node.style.display = 'none';
        });
        const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 1200,
        });
        // Restore no-print elements
        noPrintNodes.forEach((node, i) => {
            node.style.display = originalDisplays[i] || '';
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pdfWidth - margin * 2;
        const contentHeight = (canvas.height * contentWidth) / canvas.width;
        let heightLeft = contentHeight;
        let position = margin;
        // First page
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - margin * 2);
        // Multi-page handling
        while (heightLeft > 0) {
            pdf.addPage();
            position = heightLeft - contentHeight + margin;
            pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
            heightLeft -= (pdfHeight - margin * 2);
        }
        pdf.save(fileName);
        return true;
    }
    catch (error) {
        console.error('Failed to generate PDF:', error);
        return false;
    }
}
/**
 * Opens content in a standalone new browser window for unrestricted, full-resolution printing.
 */
export function openPrintableWindow(title = 'PK Workspace - Printable Document', elementOrSelector) {
    try {
        let targetEl = null;
        if (typeof elementOrSelector === 'string') {
            targetEl = document.querySelector(elementOrSelector) || document.getElementById(elementOrSelector);
        }
        else if (elementOrSelector) {
            targetEl = elementOrSelector;
        }
        else {
            targetEl = document.querySelector('main') || document.body;
        }
        if (!targetEl)
            return;
        // Clone element to sanitize
        const clone = targetEl.cloneNode(true);
        clone.querySelectorAll('.no-print').forEach((n) => n.remove());
        const printWin = window.open('', '_blank', 'width=900,height=700');
        if (!printWin) {
            // If popup blocker stopped it, fallback to direct download
            downloadElementAsPdf(targetEl, `${title.replace(/\s+/g, '_')}.pdf`);
            return;
        }
        printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            body { background: #ffffff; color: #141716; font-family: system-ui, -apple-system, sans-serif; padding: 16px; }
            .no-print { display: none !important; }
            .bg-white, .glass-surface, .glass-card-dark {
              border: 1px solid #d1d5db;
              box-shadow: none !important;
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="max-w-4xl mx-auto">
            <div style="border-bottom: 2px solid #141716; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h1 style="font-size: 20px; font-weight: 900; margin: 0; color: #141716;">Muhammed Anas P K · PK Workspace</h1>
                <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">${title} · Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              </div>
              <div style="font-size: 12px; font-weight: 800; background: #e2e8f0; padding: 4px 10px; border-radius: 9999px;">
                A4 Official Record
              </div>
            </div>
            ${clone.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
        printWin.document.close();
    }
    catch (err) {
        console.error('Error opening printable window:', err);
        // Automatic fallback to direct PDF file download
        downloadElementAsPdf(document.querySelector('main') || document.body);
    }
}
