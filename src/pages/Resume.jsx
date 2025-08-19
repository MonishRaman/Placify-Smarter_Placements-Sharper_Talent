import React, { useState, useRef, useEffect } from 'react';
import { Download, Eye, Edit3, Plus, Trash2, GripVertical, Palette, Moon, Sun, Upload, X } from 'lucide-react';

const ResumeBuilder = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('resumeBuilderTheme')) || false);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // We moved your initial data into a constant
  const defaultResumeData = {
    personal: {
      name: 'John Smith',
      title: 'Senior Software Engineer',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'johnsmith.dev',
      linkedin: 'linkedin.com/in/johnsmith',
      summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading high-performing teams.'
    },
    experience: [
      {
        id: 1,
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020',
        endDate: 'Present',
        description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and improved deployment efficiency by 40%.'
      }
    ],
    education: [
      {
        id: 1,
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        location: 'Berkeley, CA',
        startDate: '2012',
        endDate: '2016',
        gpa: '3.8'
      }
    ],
    skills: [
      { id: 1, name: 'JavaScript', category: 'Programming' },
      { id: 2, name: 'React', category: 'Frontend' },
      { id: 3, name: 'Node.js', category: 'Backend' },
      { id: 4, name: 'Python', category: 'Programming' },
      { id: 5, name: 'AWS', category: 'Cloud' }
    ],
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        technologies: 'React, Node.js, MongoDB',
        startDate: '2023',
        endDate: '2023',
        description: 'Built a full-stack e-commerce platform with payment integration and admin dashboard.'
      }
    ],
    achievements: [
      { id: 1, title: 'Employee of the Year 2022', description: 'Recognized for outstanding performance and leadership' },
      { id: 2, title: 'AWS Certified Solutions Architect', description: 'Professional certification in cloud architecture' }
    ],
    hobbies: ['Photography', 'Rock Climbing', 'Open Source Contributing', 'Chess'],
    references: [
      {
        id: 1,
        name: 'Sarah Johnson',
        position: 'Engineering Manager',
        company: 'TechCorp Inc.',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 987-6543'
      }
    ]
  };

  // Load saved data from localStorage when the component starts
  const [resumeData, setResumeData] = useState(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    return savedData ? JSON.parse(savedData) : defaultResumeData;
  });


  useEffect(()=>{
    localStorage.setItem('resumeBuilderTheme', JSON.stringify(isDarkMode));
  },[isDarkMode]);
  

  const [sectionOrder, setSectionOrder] = useState([
    'personal', 'experience', 'education', 'skills', 'projects', 'achievements', 'hobbies', 'references'
  ]);

  const templates = [
    { name: 'Modern Professional', layout: 'single-column', accent: 'left-border' },
    { name: 'Executive', layout: 'two-column', accent: 'header-bar' },
    { name: 'Creative', layout: 'sidebar', accent: 'color-blocks' },
    { name: 'Minimalist', layout: 'single-column', accent: 'subtle' },
    { name: 'Corporate', layout: 'two-column', accent: 'professional' },
    { name: 'Tech Focus', layout: 'single-column', accent: 'gradient' },
    { name: 'Designer', layout: 'sidebar', accent: 'artistic' },
    { name: 'Academic', layout: 'single-column', accent: 'traditional' },
    { name: 'Startup', layout: 'two-column', accent: 'modern' },
    { name: 'Consultant', layout: 'sidebar', accent: 'elegant' },
    { name: 'Manager', layout: 'single-column', accent: 'leadership' },
    { name: 'Developer', layout: 'two-column', accent: 'technical' },
    { name: 'Sales', layout: 'sidebar', accent: 'dynamic' },
    { name: 'Marketing', layout: 'single-column', accent: 'vibrant' },
    { name: 'Finance', layout: 'two-column', accent: 'conservative' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const deleteExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const deleteEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill = { id: Date.now(), name: '', category: 'Programming' };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const deleteSkill = (id) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      technologies: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const deleteProject = (id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addAchievement = () => {
    const newAchievement = { id: Date.now(), title: '', description: '' };
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
  };

  const updateAchievement = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => 
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const deleteAchievement = (id) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== id)
    }));
  };

  const addReference = () => {
    const newRef = {
      id: Date.now(),
      name: '',
      position: '',
      company: '',
      email: '',
      phone: ''
    };
    setResumeData(prev => ({
      ...prev,
      references: [...prev.references, newRef]
    }));
  };

  const updateReference = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      references: prev.references.map(ref => 
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const deleteReference = (id) => {
    setResumeData(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== id)
    }));
  };

  const exportToPDF = () => {
    window.print();
  };

  const ResumeTemplate = ({ template, data, primaryColor, profileImage }) => {
    const baseClasses = "bg-white text-gray-900 shadow-lg";
    
    switch (template.layout) {
      case 'sidebar':
        return (
          <div className={`${baseClasses} min-h-[11in] w-[8.5in] mx-auto flex`}>
            <div className="w-1/3 p-6" style={{ backgroundColor: primaryColor + '10' }}>
              {profileImage && (
                <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              )}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold mb-1">{data.personal.name}</h1>
                <p className="text-sm" style={{ color: primaryColor }}>{data.personal.title}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider">Contact</h3>
                <div className="text-xs space-y-1">
                  <p>{data.personal.email}</p>
                  <p>{data.personal.phone}</p>
                  <p>{data.personal.location}</p>
                  <p>{data.personal.website}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider">Skills</h3>
                <div className="space-y-1">
                  {data.skills.map(skill => (
                    <div key={skill.id} className="text-xs">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider">Hobbies</h3>
                <div className="text-xs space-y-1">
                  {data.hobbies.map((hobby, index) => (
                    <p key={index}>{hobby}</p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-2/3 p-6">
              <div className="mb-6">
                <p className="text-sm leading-relaxed">{data.personal.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Experience</h3>
                {data.experience.map(exp => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm">{exp.position}</h4>
                      <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: primaryColor }}>{exp.company}</p>
                    <p className="text-xs text-gray-600 mb-2">{exp.location}</p>
                    <p className="text-xs leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Education</h3>
                {data.education.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm">{edu.degree}</h4>
                      <span className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <p className="text-sm" style={{ color: primaryColor }}>{edu.institution}</p>
                    <p className="text-xs text-gray-600">{edu.location}</p>
                  </div>
                ))}
              </div>

              {data.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Projects</h3>
                  {data.projects.map(project => (
                    <div key={project.id} className="mb-3">
                      <h4 className="font-semibold text-sm">{project.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">{project.technologies}</p>
                      <p className="text-xs leading-relaxed">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'two-column':
        return (
          <div className={`${baseClasses} min-h-[11in] w-[8.5in] mx-auto p-8`}>
            <div className="text-center mb-6">
              {profileImage && (
                <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
              )}
              <h1 className="text-3xl font-bold mb-2">{data.personal.name}</h1>
              <p className="text-lg mb-2" style={{ color: primaryColor }}>{data.personal.title}</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <span>{data.personal.email}</span>
                <span>{data.personal.phone}</span>
                <span>{data.personal.location}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm leading-relaxed text-center">{data.personal.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Experience</h3>
                  {data.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                      <h4 className="font-semibold text-sm">{exp.position}</h4>
                      <p className="text-sm mb-1" style={{ color: primaryColor }}>{exp.company}</p>
                      <p className="text-xs text-gray-600 mb-2">{exp.startDate} - {exp.endDate}</p>
                      <p className="text-xs leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Projects</h3>
                  {data.projects.map(project => (
                    <div key={project.id} className="mb-3">
                      <h4 className="font-semibold text-sm">{project.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">{project.technologies}</p>
                      <p className="text-xs leading-relaxed">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Education</h3>
                  {data.education.map(edu => (
                    <div key={edu.id} className="mb-3">
                      <h4 className="font-semibold text-sm">{edu.degree}</h4>
                      <p className="text-sm mb-1" style={{ color: primaryColor }}>{edu.institution}</p>
                      <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(skill => (
                      <span key={skill.id} className="px-2 py-1 text-xs rounded" style={{ backgroundColor: primaryColor + '20', color: primaryColor }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Achievements</h3>
                  {data.achievements.map(achievement => (
                    <div key={achievement.id} className="mb-2">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default: // single-column
        return (
          <div className={`${baseClasses} min-h-[11in] w-[8.5in] mx-auto p-8`}>
            <div className="text-center mb-8">
              {profileImage && (
                <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              )}
              <h1 className="text-4xl font-bold mb-2">{data.personal.name}</h1>
              <p className="text-xl mb-4" style={{ color: primaryColor }}>{data.personal.title}</p>
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <span>{data.personal.email}</span>
                <span>{data.personal.phone}</span>
                <span>{data.personal.location}</span>
                <span>{data.personal.website}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3 border-b-2 pb-2" style={{ borderColor: primaryColor }}>Summary</h3>
              <p className="leading-relaxed">{data.personal.summary}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor }}>Experience</h3>
              {data.experience.map(exp => (
                <div key={exp.id} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold">{exp.position}</h4>
                      <p className="text-base font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor }}>Education</h3>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{edu.degree}</h4>
                      <p className="text-base" style={{ color: primaryColor }}>{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.location}</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor }}>Skills</h3>
              <div className="flex flex-wrap gap-3">
                {data.skills.map(skill => (
                  <span key={skill.id} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: primaryColor + '20', color: primaryColor }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {data.projects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor }}>Projects</h3>
                {data.projects.map(project => (
                  <div key={project.id} className="mb-4">
                    <h4 className="text-lg font-semibold">{project.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{project.technologies}</p>
                    <p className="leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            )}

            {data.achievements.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor }}>Achievements</h3>
                {data.achievements.map(achievement => (
                  <div key={achievement.id} className="mb-3">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  if (isPreviewMode) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} print:bg-white`}>
        <div className="print:hidden fixed top-4 left-4 right-4 z-10 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Edit3 size={16} />
            Edit Resume
          </button>
          <div className="flex items-center gap-4">
            <select
              value={activeTemplate}
              onChange={(e) => setActiveTemplate(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {templates.map((template, index) => (
                <option key={index} value={index}>{template.name}</option>
              ))}
            </select>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
        <div className="pt-20 print:pt-0 p-4 print:p-0">
          <ResumeTemplate 
            template={templates[activeTemplate]} 
            data={resumeData} 
            primaryColor={primaryColor}
            profileImage={profileImage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
              <div className="flex items-center gap-2">
                <Palette size={20} />
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={() => setIsPreviewMode(true)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Eye size={16} />
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Personal Information
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Upload size={14} />
                  Photo
                </button>
              </h2>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {profileImage && (
                <div className="mb-4 relative inline-block">
                  <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                  <button
                    onClick={() => setProfileImage(null)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resumeData.personal.name}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, name: e.target.value }
                  }))}
                  className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Professional Title"
                  value={resumeData.personal.title}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, title: e.target.value }
                  }))}
                  className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={resumeData.personal.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, email: e.target.value }
                  }))}
                  className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={resumeData.personal.phone}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, phone: e.target.value }
                  }))}
                  className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={resumeData.personal.location}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, location: e.target.value }
                  }))}
                  className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={resumeData.personal.website}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, website: e.target.value }
                  }))}
                  className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              <textarea
                placeholder="Professional Summary"
                value={resumeData.personal.summary}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, summary: e.target.value }
                }))}
                rows={3}
                className={`mt-4 w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* Experience */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Experience</h2>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
              
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className={`mb-4 p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-400 cursor-move" />
                      <span className="font-medium">Experience {index + 1}</span>
                    </div>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 flex-1 ${
                          isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 flex-1 ${
                          isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <textarea
                    placeholder="Job Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={2}
                    className={`mt-3 w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Education</h2>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
              
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className={`mb-4 p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-400 cursor-move" />
                      <span className="font-medium">Education {index + 1}</span>
                    </div>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Start"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 flex-1 ${
                          isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="End"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 flex-1 ${
                          isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <button
                  onClick={addSkill}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {resumeData.skills.map((skill) => (
                  <div key={skill.id} className={`flex items-center gap-2 p-2 rounded border ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <input
                      type="text"
                      placeholder="Skill"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className={`flex-1 px-2 py-1 rounded border-0 focus:ring-1 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600' : 'bg-white'
                      }`}
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className={`px-2 py-1 rounded border-0 focus:ring-1 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600' : 'bg-white'
                      }`}
                    >
                      <option>Programming</option>
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Database</option>
                      <option>Cloud</option>
                      <option>Tools</option>
                    </select>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <button
                  onClick={addProject}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
              
              {resumeData.projects.map((project, index) => (
                <div key={project.id} className={`mb-4 p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-400 cursor-move" />
                      <span className="font-medium">Project {index + 1}</span>
                    </div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Technologies"
                      value={project.technologies}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    rows={2}
                    className={`mt-3 w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Achievements</h2>
                <button
                  onClick={addAchievement}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
              
              {resumeData.achievements.map((achievement, index) => (
                <div key={achievement.id} className={`mb-4 p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-400 cursor-move" />
                      <span className="font-medium">Achievement {index + 1}</span>
                    </div>
                    <button
                      onClick={() => deleteAchievement(achievement.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Achievement Title"
                    value={achievement.title}
                    onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                    className={`w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 mb-3 ${
                      isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                    }`}
                  />
                  
                  <textarea
                    placeholder="Description"
                    value={achievement.description}
                    onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Hobbies */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Hobbies & Interests</h2>
              <textarea
                placeholder="Enter hobbies separated by commas"
                value={resumeData.hobbies.join(', ')}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  hobbies: e.target.value.split(',').map(h => h.trim()).filter(h => h)
                }))}
                rows={2}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            {/* References */}
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">References</h2>
                <button
                  onClick={addReference}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
              
              {resumeData.references.map((ref, index) => (
                <div key={ref.id} className={`mb-4 p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-400 cursor-move" />
                      <span className="font-medium">Reference {index + 1}</span>
                    </div>
                    <button
                      onClick={() => deleteReference(ref.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={ref.name}
                      onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={ref.position}
                      onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={ref.company}
                      onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={ref.email}
                      onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                      className={`px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates Preview */}
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Choose Template</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTemplate(index)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      activeTemplate === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-16 rounded mb-2 ${
                      template.layout === 'sidebar' ? 'bg-gradient-to-r from-gray-300 to-gray-100' :
                      template.layout === 'two-column' ? 'bg-gradient-to-b from-gray-300 to-gray-100' :
                      'bg-gradient-to-t from-gray-300 to-gray-100'
                    }`}></div>
                    <p className="text-xs font-medium text-center">{template.name}</p>
                  </button>
                ))}
              </div>
              <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
                <div className="transform scale-[1] origin-top-left overflow-hidden border rounded-lg">
                  <ResumeTemplate 
                    template={templates[activeTemplate]} 
                    data={resumeData} 
                    primaryColor={primaryColor}
                    profileImage={profileImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;