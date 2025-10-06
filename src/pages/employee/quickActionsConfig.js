// Central configuration for Employee Dashboard quick actions.
// Add new items here to have them automatically rendered.
// Each action supports icon, title, description, color (Tailwind palette key), and path.
import { Target, BarChart3, Award } from "lucide-react";

export const employeeQuickActions = [
    {
        key: "skills",
        icon: Target,
        title: "Update Skills",
        description: "Add new skills or update your proficiency levels",
        color: "blue",
        path: "/dashboard/employee/skills",
    },
    {
        key: "performance",
        icon: BarChart3,
        title: "View Performance",
        description: "Check your performance metrics and feedback",
        color: "green",
        path: "/dashboard/employee/performance",
    },
    {
        key: "learning",
        icon: Award,
        title: "Learning Resources",
        description: "Explore courses and training opportunities",
        color: "purple",
        path: "/dashboard/employee/learning",
    },
];

export default employeeQuickActions;