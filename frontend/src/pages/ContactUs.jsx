import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Send, CheckCircle } from 'lucide-react';
import { toast } from "react-hot-toast";
import axios from "axios";

const ContactUs = () => {
  const userData = localStorage.getItem("user");
  const adminData = localStorage.getItem("admin");

  const profile = userData
    ? JSON.parse(userData)
    : adminData
      ? JSON.parse(adminData)
      : null;

  const isAuthenticated = !!profile;

  const [formData, setFormData] = useState({
    name: isAuthenticated ? profile?.name || "" : "",
    email: isAuthenticated ? profile?.email || "" : "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const contactInfo = {
    name: 'QuickBus',
    email: 'support@quickbus.com',
    phone: '+91 83063 18916',
    address: 'New Delhi , India',
    hours: 'Mon - Fri: 8:00 AM - 8:00 PM'
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I book a bus ticket?',
      answer: 'Simply search for your route on our home page, select your preferred bus and seats, and complete the payment. You will receive a confirmation email with your ticket details.'
    },
    {
      id: 2,
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking from the My Bookings page. Cancellation policies and refund amounts vary based on how far in advance you cancel.'
    },
    {
      id: 3,
      question: 'How do I check my booking status?',
      answer: 'Log in to your account and go to My Bookings to view all your current and past bookings along with their status.'
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, net banking, UPI, and digital wallets for secure and convenient payments.'
    },
    {
      id: 5,
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal and payment information.'
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/user/contact-us`,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        { withCredentials: true }
      );

      // ✅ SUCCESS RESPONSE
      if (res.data.success === true) {
        setShowSuccess(true);

        setFormData({
          name: isAuthenticated ? profile?.name || "" : "",
          email: isAuthenticated ? profile?.email || "" : "",
          subject: "",
          message: "",
        });

        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        // ❌ Backend returned success=false with 200
        toast.error(res.data.message || "Failed to send message");
      }

    } catch (error) {
      // ❌ REAL backend error (4xx / 5xx)
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";

      toast.error(backendMessage);
    } finally {
      setIsSubmitting(false);
    }


    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({
      name: isAuthenticated ? profile?.name || '' : '',
      email: isAuthenticated ? profile?.email || '' : '',
      subject: '',
      message: ''
    });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you with your journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info, FAQ, Social */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Get in Touch</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <Mail className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-slate-800 font-medium">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <Phone className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-slate-800 font-medium">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="text-slate-800 font-medium">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-50 rounded-lg">
                    <Clock className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Working Hours</p>
                    <p className="text-slate-800 font-medium">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-4">Follow us on social media</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="p-3 bg-slate-100 rounded-lg text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-800">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-slate-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 h-fit lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h2>

            {showSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-emerald-700">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                />
                {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                />
                {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${errors.subject ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                />
                {errors.subject && <p className="mt-1 text-sm text-rose-600">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message here..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors resize-none ${errors.message ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                    }`}
                />
                {errors.message && <p className="mt-1 text-sm text-rose-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
