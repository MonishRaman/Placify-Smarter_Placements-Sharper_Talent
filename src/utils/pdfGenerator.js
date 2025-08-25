import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateResumePDF = async (resumeElement, fileName = 'resume') => {
    try {
        // Temporarily force light mode for PDF generation
        const originalTheme = document.documentElement.classList.contains('dark');
        if (originalTheme) {
            document.documentElement.classList.remove('dark');
        }

        // Wait a bit for theme change to apply
        await new Promise(resolve => setTimeout(resolve, 100));

        // Configure html2canvas options for better quality
        const canvas = await html2canvas(resumeElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1200,
            windowHeight: window.innerHeight,
        });

        // Restore original theme
        if (originalTheme) {
            document.documentElement.classList.add('dark');
        }

        const imgData = canvas.toDataURL('image/png');

        // Calculate dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if content is longer than one page
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(`${fileName}.pdf`);

        return { success: true, message: 'Resume downloaded successfully!' };
    } catch (error) {
        console.error('Error generating PDF:', error);
        return { success: false, message: 'Failed to generate PDF. Please try again.' };
    }
}; export const generateResumeBlob = async (resumeElement) => {
    try {
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        return pdf.output('blob');
    } catch (error) {
        console.error('Error generating PDF blob:', error);
        throw error;
    }
};
