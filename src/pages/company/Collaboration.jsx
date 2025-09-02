import React from "react";
import { FaUniversity, FaHandshake, FaChalkboardTeacher, FaFlask, FaAward, FaUsers } from "react-icons/fa";
import SectionWrapper from "../../components/CompanyCollaboration/SectionWrapper"
import CardGrid from "../../components/CompanyCollaboration/CardGrid";

const cards = [
  { icon: <FaChalkboardTeacher />, title: "Curriculum Co-Creation", body: "Co-develop...", bullets: ["Syllabus advisory", "Guest sessions", "Assessment rubrics"] },
  { icon: <FaFlask />, title: "Research & Labs", body: "Joint R&D...", bullets: ["Sponsored projects", "Shared facilities", "IP frameworks"] },
  { icon: <FaUsers />, title: "Talent Programs", body: "Hackathons...", bullets: ["Hackathon hosting", "Mentor network", "Intern pipelines"] },
  { icon: <FaAward />, title: "Faculty Enablement", body: "Faculty upskilling...", bullets: ["Train-the-trainer", "Certifications", "Sabbaticals"] },
];

const benefits = [
  { icon: <FaUniversity />, title: "For Institutions", points: ["Industry-relevant curriculum", "Brand elevation", "Access to tools"] },
  { icon: <FaHandshake />, title: "For Company", points: ["Early access to talent", "Co-branded IP", "Regional network"] },
  { icon: <FaUsers />, title: "For Students", points: ["Hands-on projects", "Portfolio-ready", "Career pathways"] },
];

const process = [
  { step: "01", title: "Discovery", text: "Understand objectives." },
  { step: "02", title: "Proposal", text: "Co-design scope." },
  { step: "03", title: "MoU & Planning", text: "Formalize partnership." },
  { step: "04", title: "Execution", text: "Run programs, measure outcomes." },
  { step: "05", title: "Scale", text: "Expand to long-term collaborations." },
];

const Collaboration = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">

      {/* ✅ Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Driving Innovation Through Collaboration
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Building impactful partnerships between <span className="font-semibold">Institutions</span>, <span className="font-semibold">Companies</span> & <span className="font-semibold">Students</span>.
          </p>
          <a
            href="#features"
            className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Explore Collaboration
          </a>
        </div>
      </section>

      {/* ✅ Features Section */}
      <SectionWrapper id="features" title="Collaboration Features">
        <CardGrid items={cards} type="feature" />
      </SectionWrapper>

      {/* ✅ Benefits Section */}
      <SectionWrapper id="benefits" title="Mutual Benefits">
        <CardGrid items={benefits} type="benefit" />
      </SectionWrapper>

      {/* ✅ Process Section */}
      <SectionWrapper id="process" title="Collaboration Process">
        <CardGrid items={process} type="process" />
      </SectionWrapper>
    </div>
  );
};

export default Collaboration;
