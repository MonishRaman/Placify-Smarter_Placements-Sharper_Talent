import { useState, useCallback } from 'react';
import { exportInsightsToPDF, exportChartAsImage, EXPORT_SECTIONS } from '../utils/pdfExport';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing PDF/image export functionality
 * Handles the export process, loading states, and error handling
 */
export const useInsightsExport = (currentData = {}, timeRange = '3M') => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportModalOpen, setExportModalOpen] = useState(false);

    /**
     * Map chart selections to actual DOM element IDs
     */
    const getChartElementIds = (selectedCharts) => {
        const chartMapping = {
            trends: 'interview-trends-chart',
            skills: 'skills-distribution-chart',
            colleges: 'college-performance-chart',
            categories: 'performance-categories-chart',
            activity: 'weekly-activity-chart',
            successRate: 'success-rate-chart',
            quickStats: 'quick-stats-section'
        };

        return Object.entries(selectedCharts)
            .filter(([_, selected]) => selected)
            .map(([key, _]) => ({
                id: chartMapping[key],
                title: getChartTitle(key)
            }));
    };

    /**
     * Get human-readable chart titles
     */
    const getChartTitle = (chartKey) => {
        const titles = {
            trends: 'Interview & Placement Trends',
            skills: 'Skills in Demand',
            colleges: 'Top Performing Colleges',
            categories: 'Performance by Category',
            activity: 'Weekly Interview Activity',
            successRate: 'Placement Success Rate',
            quickStats: 'Key Statistics'
        };
        return titles[chartKey] || chartKey;
    };

    /**
     * Export PDF with selected configuration
     */
    const exportPDF = useCallback(async (exportConfig) => {
        setIsExporting(true);
        setExportProgress(0);

        try {
            // Prepare sections array
            const sections = [];
            if (exportConfig.sections.summary) sections.push(EXPORT_SECTIONS.SUMMARY);
            if (exportConfig.sections.charts) sections.push(EXPORT_SECTIONS.CHARTS);
            if (exportConfig.sections.metrics) sections.push(EXPORT_SECTIONS.METRICS);
            if (exportConfig.sections.rawData) sections.push(EXPORT_SECTIONS.RAW_DATA);

            // Generate filename
            const timestamp = new Date().toISOString().split('T')[0];
            const companySlug = exportConfig.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const filename = `${companySlug}-insights-${timeRange}-${timestamp}.pdf`;

            // Show progress
            setExportProgress(20);
            toast.loading('Preparing PDF export...', { id: 'export-toast' });

            // Wait a bit for charts to render properly
            await new Promise(resolve => setTimeout(resolve, 1000));
            setExportProgress(40);

            // Call the export function
            const result = await exportInsightsToPDF({
                companyName: exportConfig.companyName,
                timeRange,
                sections,
                currentData,
                filename
            });

            setExportProgress(100);
            toast.success('PDF exported successfully!', { id: 'export-toast' });
            setExportModalOpen(false);

            return result;
        } catch (error) {
            console.error('Export error:', error);
            toast.error(`Export failed: ${error.message}`, { id: 'export-toast' });
            throw error;
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    }, [currentData, timeRange]);

    /**
     * Export individual charts as images
     */
    const exportImages = useCallback(async (exportConfig) => {
        setIsExporting(true);
        setExportProgress(0);

        try {
            const selectedCharts = getChartElementIds(exportConfig.includeCharts);

            if (selectedCharts.length === 0) {
                throw new Error('Please select at least one chart to export');
            }

            toast.loading('Exporting chart images...', { id: 'export-toast' });
            setExportProgress(20);

            const timestamp = new Date().toISOString().split('T')[0];
            let successCount = 0;

            // Export each chart individually
            for (let i = 0; i < selectedCharts.length; i++) {
                const chart = selectedCharts[i];
                const filename = `${exportConfig.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${chart.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}.png`;

                try {
                    await exportChartAsImage(chart.id, filename);
                    successCount++;
                    setExportProgress(20 + (i + 1) * (80 / selectedCharts.length));

                    // Small delay between exports
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`Failed to export chart ${chart.title}:`, error);
                    toast.error(`Failed to export: ${chart.title}`, { duration: 2000 });
                }
            }

            if (successCount > 0) {
                toast.success(`Successfully exported ${successCount} chart${successCount > 1 ? 's' : ''}!`, { id: 'export-toast' });
                setExportModalOpen(false);
            } else {
                throw new Error('Failed to export any charts');
            }

            return { success: true, exportedCount: successCount };
        } catch (error) {
            console.error('Image export error:', error);
            toast.error(`Export failed: ${error.message}`, { id: 'export-toast' });
            throw error;
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    }, []);

    /**
     * Main export handler - delegates to PDF or image export
     */
    const handleExport = useCallback(async (exportConfig) => {
        try {
            if (exportConfig.format === 'pdf') {
                return await exportPDF(exportConfig);
            } else if (exportConfig.format === 'images') {
                return await exportImages(exportConfig);
            } else {
                throw new Error('Invalid export format');
            }
        } catch (error) {
            console.error('Export handler error:', error);
            throw error;
        }
    }, [exportPDF, exportImages]);

    /**
     * Quick export functions for common use cases
     */
    const quickExportPDF = useCallback(async (companyName = 'Company') => {
        const defaultConfig = {
            format: 'pdf',
            companyName,
            sections: {
                summary: true,
                charts: true,
                metrics: true,
                rawData: false
            },
            includeCharts: {
                trends: true,
                skills: true,
                colleges: true,
                categories: true,
                activity: true,
                successRate: true,
                quickStats: true
            }
        };

        return await handleExport(defaultConfig);
    }, [handleExport]);

    const quickExportAllCharts = useCallback(async (companyName = 'Company') => {
        const defaultConfig = {
            format: 'images',
            companyName,
            includeCharts: {
                trends: true,
                skills: true,
                colleges: true,
                categories: true,
                activity: true,
                successRate: true,
                quickStats: true
            }
        };

        return await handleExport(defaultConfig);
    }, [handleExport]);

    return {
        // State
        isExporting,
        exportProgress,
        exportModalOpen,

        // Actions
        setExportModalOpen,
        handleExport,
        quickExportPDF,
        quickExportAllCharts,

        // Utilities
        getChartElementIds,
        getChartTitle
    };
};