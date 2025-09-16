import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Users, Home, FileText, Bell, Phone, User, LogOut, BookOpen, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const CalendarPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock calendar events
  const events = [
    {
      id: 1,
      title: "Mid-term Examinations",
      date: "2025-02-15",
      time: "09:00 AM",
      type: "exam",
      location: "Examination Hall",
      description: "Mid-term examinations for all semester subjects"
    },
    {
      id: 2,
      title: "Project Submission Deadline",
      date: "2025-02-20",
      time: "11:59 PM",
      type: "deadline",
      location: "Online Portal",
      description: "Final project submission for Software Engineering"
    },
    {
      id: 3,
      title: "Guest Lecture: AI & Machine Learning",
      date: "2025-02-25",
      time: "02:00 PM",
      type: "lecture",
      location: "Auditorium",
      description: "Special guest lecture by industry expert"
    },
    {
      id: 4,
      title: "Fee Payment Deadline",
      date: "2025-03-15",
      time: "11:59 PM",
      type: "deadline",
      location: "Fee Counter / Online",
      description: "Last date for semester fee payment"
    },
    {
      id: 5,
      title: "Cultural Festival",
      date: "2025-03-20",
      time: "10:00 AM",
      type: "event",
      location: "Main Campus",
      description: "Annual cultural festival with various competitions"
    }
  ];

  const getEventColor = (type) => {
    const colors = {
      exam: "from-red-400 to-red-600",
      deadline: "from-orange-400 to-orange-600",
      lecture: "from-blue-400 to-blue-600",
      event: "from-green-400 to-green-600"
    };
    return colors[type] || "from-gray-400 to-gray-600";
  };

  const getEventBadge = (type) => {
    const badges = {
      exam: { color: "bg-red-100 text-red-800", text: "Exam" },
      deadline: { color: "bg-orange-100 text-orange-800", text: "Deadline" },
      lecture: { color: "bg-blue-100 text-blue-800", text: "Lecture" },
      event: { color: "bg-green-100 text-green-800", text: "Event" }
    };
    return badges[type] || { color: "bg-gray-100 text-gray-800", text: "Other" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
              <Link to="/calendar" className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </Link>
              <Link to="/notices" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Calendar</h1>
            <p className="text-lg text-gray-600">Stay updated with important academic dates and events</p>
          </div>

          <div className="grid gap-6">
            {events.map((event) => {
              const badge = getEventBadge(event.type);
              return (
                <Card key={event.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                          <Badge className={badge.color}>{badge.text}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getEventColor(event.type)} flex items-center justify-center text-white`}>
                        <div className="text-center">
                          <div className="text-xs font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Academic Year Overview */}
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-center text-purple-900">Academic Year 2024-2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Semester 1</h4>
                  <p className="text-sm text-purple-600">July - November 2024</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Semester 2</h4>
                  <p className="text-sm text-purple-600">December 2024 - May 2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Summer Break</h4>
                  <p className="text-sm text-purple-600">June - July 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;