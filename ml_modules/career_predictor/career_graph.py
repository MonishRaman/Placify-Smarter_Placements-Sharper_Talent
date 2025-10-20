import networkx as nx

class CareerGraph:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._initialize_graph()

    def _initialize_graph(self):
        """
        Initializes a hardcoded graph of tech roles, skills, and transitions.
        Nodes have a 'skills' attribute (a set).
        """
        # Define skill sets
        skills_junior_frontend = {"HTML", "CSS", "JavaScript", "React", "Git"}
        skills_senior_frontend = skills_junior_frontend.union({"TypeScript", "State Management (Redux/Zustand)", "Testing (Jest/Cypress)", "Webpack"})
        skills_tech_lead = skills_senior_frontend.union({"System Design", "Team Mentorship", "CI/CD", "Project Management"})
        
        skills_junior_backend = {"Python", "Flask/Django", "SQL", "REST APIs", "Git"}
        skills_senior_backend = skills_junior_backend.union({"Docker", "Kubernetes", "Microservices", "System Design", "NoSQL (MongoDB)"})
        
        skills_junior_data_analyst = {"SQL", "Excel", "Tableau/PowerBI", "Python (Pandas)", "Statistics"}
        skills_data_scientist = skills_junior_data_analyst.union({"Machine Learning", "Scikit-learn", "TensorFlow/PyTorch", "Big Data (Spark)"})
        
        skills_devops = {"Linux", "Bash Scripting", "Docker", "Kubernetes", "CI/CD (Jenkins/GitLab)", "Terraform"}
        skills_sre = skills_devops.union({"Monitoring (Prometheus/Grafana)", "System Design", "Networking", "Python/Go"})
        
        skills_pm = {"Project Management", "Agile/Scrum", "JIRA", "Roadmapping", "Communication"}

        # Add nodes
        self.graph.add_node("Junior Frontend Developer", skills=skills_junior_frontend)
        self.graph.add_node("Senior Frontend Developer", skills=skills_senior_frontend)
        self.graph.add_node("Tech Lead", skills=skills_tech_lead)
        self.graph.add_node("Junior Backend Developer", skills=skills_junior_backend)
        self.graph.add_node("Senior Backend Developer", skills=skills_senior_backend)
        self.graph.add_node("Junior Data Analyst", skills=skills_junior_data_analyst)
        self.graph.add_node("Data Scientist", skills=skills_data_scientist)
        self.graph.add_node("DevOps Engineer", skills=skills_devops)
        self.graph.add_node("Site Reliability Engineer (SRE)", skills=skills_sre)
        self.graph.add_node("Product Manager", skills=skills_pm)
        
        # Add entry-level/grad roles
        self.graph.add_node("Software Engineer Intern", skills={"Git", "Python/JavaScript", "Problem Solving"})
        self.graph.add_node("Graduate Software Engineer", skills={"Git", "Python/JavaScript", "Data Structures", "Algorithms"})

        # Add edges (common transitions)
        self.graph.add_edges_from([
            ("Software Engineer Intern", "Junior Frontend Developer"),
            ("Software Engineer Intern", "Junior Backend Developer"),
            ("Software Engineer Intern", "Junior Data Analyst"),
            ("Graduate Software Engineer", "Junior Frontend Developer"),
            ("Graduate Software Engineer", "Junior Backend Developer"),
            
            ("Junior Frontend Developer", "Senior Frontend Developer"),
            ("Senior Frontend Developer", "Tech Lead"),
            
            ("Junior Backend Developer", "Senior Backend Developer"),
            ("Senior Backend Developer", "Tech Lead"),
            
            ("Junior Backend Developer", "DevOps Engineer"),
            ("DevOps Engineer", "Site Reliability Engineer (SRE)"),
            
            ("Junior Data Analyst", "Data Scientist"),
            
            # Cross-functional moves
            ("Senior Frontend Developer", "Product Manager"),
            ("Senior Backend Developer", "Product Manager"),
        ])

    def get_graph(self) -> nx.DiGraph:
        return self.graph

    def get_node_skills(self, role_title: str) -> set:
        try:
            return self.graph.nodes[role_title].get('skills', set())
        except KeyError:
            return set()

    def get_all_roles(self) -> list:
        return list(self.graph.nodes)