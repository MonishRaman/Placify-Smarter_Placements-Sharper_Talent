import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  MessageCircle,
  Users,
  HelpCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegistrationHeader from "../components/RegistrationHeader";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Floating particles for background
  const particleCount = 20;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    size: Math.random() * 15 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  // Meet the Team data
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
    {
      name: "Jane Warner",
      title: "UI/UX Designer",
      email: "jane.smith@placify.com",
      image: "https://randomuser.me/api/portraits/women/25.jpg",
    },
    {
      name: "John Doen",
      title: "Full Stack Developer",
      email: "john.doe@placify.com",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  // FAQ data
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 dark:bg-white/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: `-${p.size}px`,
          }}
          animate={{ y: ["0%", "-120vh"] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="pt-16">
        <RegistrationHeader
          title="Get in Touch"
          subtitle="We’d love to hear from you. Find the best way to contact our team below."
          tagline="Quick responses. Real support."
          icon={<MessageCircle className="w-10 h-10 text-white" />}
          color="purple"
          userType="contact"
        />
      </div>

      {/* Contact Info + Form */}
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto p-10 rounded-2xl shadow-xl
                     bg-white dark:bg-slate-800 border border-transparent 
                     transition-all
                     before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                     before:bg-gradient-to-r before:from-indigo-600 before:via-purple-600 before:to-indigo-700
                     before:animate-gradient-move before:-z-10"
        >
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                General Inquiries
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                For general questions, support, or feedback, please reach out to us via email or phone.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <a
                    href="mailto:support@placify.com"
                    className="text-gray-700 dark:text-gray-200 hover:underline"
                  >
                    support@placify.com
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <a
                    href="tel:+1234567890"
                    className="text-gray-700 dark:text-gray-200 hover:underline"
                  >
                    +1 (234) 567-890
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-200">
                    123 Main Street, Suite 456, Cityville, State 12345
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 pt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
              <iframe
                src="https://forms.gle/i7TwXXvJTQvZWfvY9"
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="rounded-xl shadow-md"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Meet the Team Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            The passionate individuals behind Placify who work hard to make your experience seamless.
          </p>

          {/* Rotating team carousel */}
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
            className="flex gap-10 w-[200%]"
          >
            {[...teamMembers, ...teamMembers].map((member, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 p-6 rounded-xl shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto mb-4 object-cover shadow"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{member.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {member.email}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <HelpCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="p-6 rounded-lg shadow-md bg-gradient-to-r from-indigo-100 to-purple-100 
                           dark:from-slate-800 dark:to-slate-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
