import Company from '../models/Company.js';
import Employee from '../models/Employee.js';

// Assumes req.user is set by auth middleware and contains _id and role
export const getCompanyDashboard = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Company') {
            return res.status(403).json({ error: 'Access denied. Company role required.' });
        }

        const companyId = req.user._id;
        const company = await Company.findById(companyId).select('name logo email foundedYear location');
        if (!company) {
            return res.status(404).json({ error: 'Company not found.' });
        }

        // Count employees
        const totalEmployees = await Employee.countDocuments({ company: companyId });
        // Placeholder for departments count (static for now)
        const departmentsCount = 0;
        // Placeholder for performance/metadata
        const performance = {};

        res.json({
            name: company.name,
            logo: company.logo,
            email: company.email,
            foundedYear: company.foundedYear,
            location: company.location,
            totalEmployees,
            departmentsCount,
            performance,
        });
    } catch (err) {
        console.error('Company Dashboard Error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
