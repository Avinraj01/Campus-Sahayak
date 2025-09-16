import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell, Calendar, Eye, Home, FileText, Phone, User, LogOut, BookOpen, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

// The REACT_APP_BACKEND_URL already includes /api
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${API}/notices`);
        setNotices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching notices:', error);
        // Mock data for demo
        setNotices([
          {
            id: "1",
            title: "Semester Fee Payment Deadline",
            content: "All students are required to pay their semester fees by March 15, 2025. Late fee of ₹500 will be charged after the deadline.",
            category: "fees",
            target_audience: "students",
            created_at: "2025-01-15T10:00:00.000Z",
            is_active: true
          },
          {
            id: "2",
            title: "Mid-term Examination Schedule",
            content: "Mid-term examinations will be conducted from February 15-25, 2025. Students must carry their admit cards and valid ID cards.",
            category: "academic",
            target_audience: "students",
            created_at: "2025-01-10T09:00:00.000Z",
            is_active: true
          },
          {
            id: "3",
            title: "New Scholarship Opportunities Available",
            content: "Merit-based scholarships are now available for eligible students. Application deadline: March 10, 2025. Apply through the scholarship portal.",
            category: "scholarship",
            target_audience: "students",
            created_at: "2025-01-05T14:30:00.000Z",
            is_active: true
          },
          {
            id: "4",
            title: "Library Hours Extended",
            content: "Library will remain open until 10 PM from Monday to Friday. Students can utilize extended hours for exam preparation.",
            category: "general",
            target_audience: "all",
            created_at: "2025-01-01T08:00:00.000Z",
            is_active: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      fees: "bg-red-100 text-red-800",
      scholarship: "bg-green-100 text-green-800",
      general: "bg-gray-100 text-gray-800",
      event: "bg-purple-100 text-purple-800"
    };
    return colors[category] || colors.general;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="h-4 w-4" />;
      case 'fees':
        return <Bell className="h-4 w-4" />;
      case 'scholarship':
        return <User className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
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
              <Link to="/notices" className="text-orange-600 hover:text-orange-700 font-medium transition-colors flex items-center space-x-1">
                <Bell className="h-4 w-4" />
                <span>Notices</span>
              </Link>
              <Link to="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Campus Notices</h1>
            <p className="text-lg text-gray-600">Stay updated with the latest announcements and information</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : notices && Array.isArray(notices) && notices.length > 0 ? (
            <div className="grid gap-6">
              {notices.map((notice) => (
                <Card key={notice.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-2">{notice.title}</CardTitle>
                        <div className="flex items-center space-x-3">
                          <Badge className={getCategoryColor(notice.category)}>
                            <div className="flex items-center space-x-1">
                              {getCategoryIcon(notice.category)}
                              <span className="capitalize">{notice.category}</span>
                            </div>
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {notice.target_audience}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(notice.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{notice.content}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Posted on {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No notices available at the moment.</p>
            </div>
          )}

          {/* Important Links */}
          <Card className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-center text-orange-900">Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-800">
                <div>
                  <h4 className="font-medium mb-2">📅 Important Dates:</h4>
                  <ul className="space-y-1">
                    <li>• Fee Payment Deadline: March 15, 2025</li>
                    <li>• Scholarship Application: March 10, 2025</li>
                    <li>• Mid-term Exams: Feb 15-25, 2025</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">📞 Emergency Contacts:</h4>
                  <ul className="space-y-1">
                    <li>• Admin Office: +916200060778</li>
                    <li>• Email: avinyaduvansi123@gmail.com</li>
                    <li>• Emergency: 108</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;