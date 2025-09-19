import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Jane Doe",
      title: "Head of Product",
      email: "jane.doe@placify.com",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "John Smith",
      title: "Head of Partnerships",
      email: "john.smith@placify.com",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Lee",
      title: "Customer Success Lead",
      email: "sarah.lee@placify.com",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Michael Chen",
      title: "Technical Support",
      email: "michael.chen@placify.com",
      image: "https://randomuser.me/api/portraits/men/78.jpg",
    },
  ];

  const faqs = [
    {
      question: "How do I sign up as a student?",
      answer:
        "Click on the 'Student' card on our homepage, and you will be guided through a simple registration process. You can start practicing interviews in minutes!",
    },
    {
      question: "Can colleges integrate this platform with their existing systems?",
      answer:
        "Yes, our platform is designed for seamless integration. Please contact our partnerships team to discuss your specific requirements and learn more about our API.",
    },
    {
      question: "What kind of AI feedback do you provide?",
      answer:
        "Our AI provides instant feedback on your interview performance, including your body language, tone of voice, clarity of answers, and keyword usage. This helps you refine your skills before the real interview.",
    },
    {
      question: "Is there a free trial available for companies?",
      answer:
        "Yes, we offer a free trial for companies and HR professionals. Please sign up on the respective page to get started and explore our features.",
    },
  ];

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center justify-center space-x-3 mb-6 cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={handleLogoClick}
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Placify
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Get in Touch
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              We'd love to hear from you. Find the best way to contact our team below.
            </motion.p>
          </motion.div>
          
          {/* Main content grid with Contact Info and Google Form */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Contact Information and Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">General Inquiries</h2>
              <p className="text-gray-600 dark:text-gray-300">
                For general questions, support, or feedback, please reach out to us via email or phone.
              </p>
              <div className="space-y-4">
                <a href="mailto:support@placify.com" className="flex items-center space-x-4 text-gray-700 dark:text-gray-200 group">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">support@placify.com</span>
                </a>
                <a href="tel:+1234567890" className="flex items-center space-x-4 text-gray-700 dark:text-gray-200 group">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors duration-200">
                    <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">+1 (234) 567-890</span>
                </a>
                <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-medium">123 Main Street, Suite 456, Cityville, State 12345</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-twitter-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-200">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Google Form Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Fill out this form to quickly send a message to our team.
              </p>
              <div className="w-full">
                <iframe
                  src="https://forms.gle/i7TwXXvJTQvZWfvY9"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  className="rounded-lg shadow-md"
                >
                  Loading...
                </iframe>
              </div>
            </div>
          </motion.div>

          {/* Meet the Team Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Meet the Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-white dark:border-gray-800 shadow-md"
                  />
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.title}</p>
                  <a href={`mailto:${member.email}`} className="text-sm text-blue-500 hover:underline mt-1">
                    {member.email}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Still have questions? We're here to help.
            </p>
            <a
              href="mailto:support@placify.com"
              className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-300"
            >
              <span>Email us directly</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;