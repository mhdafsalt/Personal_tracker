import { downloadElementAsPdf, openPrintableWindow } from './pdfExport';
/**
 * Triggers the Print & PDF Export flow by dispatching a global event
 * to open the Print/PDF Modal with instant direct PDF download & print options.
 * Accepts optional title/selector, or can be passed directly to onClick handlers.
 */
export const triggerPrint = (titleOrEvent, selector) => {
    const title = typeof titleOrEvent === 'string' ? titleOrEvent : 'PK Workspace Report';
    const targetSelector = typeof selector === 'string' ? selector : 'main';
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-print-modal', {
            detail: { title, selector: targetSelector },
        }));
    }
};
export { downloadElementAsPdf, openPrintableWindow };
