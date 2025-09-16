import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Phone, Mail, MapPin, Clock, Home, FileText, Calendar, Bell, User, LogOut, BookOpen, MessageSquare, Facebook, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+916200060778", "Campus Helpline"],
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["avinyaduvansi123@gmail.com", "Official Contact"],
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Campus Address", "City, State - 123456"],
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["9:00 AM - 5:00 PM", "Monday to Friday"],
      color: "from-orange-400 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Campus Portal</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/complaints" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>Complaints</span>
              </Link>
              <Link to="/forms" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Forms</span>
              </Link>
              <Link to="/student-portal" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Portal</span>
              </Link>
              <Link to="/calendar" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </Link>
              <Link to="/notices" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <Bell className="h-4 w-4" />
                <span>Notices</span>
              </Link>
              <Link to="/contact" className="text-green-600 hover:text-green-700 font-medium transition-colors flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome, {user?.full_name}
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">Get in touch with us for any queries or assistance</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-gradient-to-br ${info.color} rounded-xl shadow-lg`}>
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Social Media */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.facebook.com/profile.php?id=100022302462266"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="What is this about?"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Please describe your query or concern in detail..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center text-blue-900">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">How do I pay my fees?</h4>
                  <p className="text-sm text-blue-700 mb-4">You can pay fees online through the student portal or visit the fee counter during office hours.</p>
                  
                  <h4 className="font-semibold text-blue-800 mb-2">How to apply for scholarships?</h4>
                  <p className="text-sm text-blue-700">Check the notices section for current scholarship opportunities and apply through the forms portal.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Library timings?</h4>
                  <p className="text-sm text-blue-700 mb-4">Library is open from 8:00 AM to 10:00 PM, Monday to Friday.</p>
                  
                  <h4 className="font-semibold text-blue-800 mb-2">How to contact admin?</h4>
                  <p className="text-sm text-blue-700">Call +916200060778 or email avinyaduvansi123@gmail.com during office hours.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;