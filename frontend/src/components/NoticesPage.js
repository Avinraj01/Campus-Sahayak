import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Bell, Search, Calendar, Users, BookOpen, AlertCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock notices for demonstration (replace with API call)
  const mockNotices = [
    {
      id: '1',
      title: 'Semester Examination Schedule Released',
      content: 'The examination schedule for the Spring semester 2025 has been released. Students can check their exam dates and venues on the student portal. Please ensure you have your admit cards ready.',
      category: 'academic',
      target_audience: 'students',
      created_at: '2025-01-10T10:00:00Z',
      is_active: true,
      priority: 'high'
    },
    {
      id: '2',
      title: 'New Library Timings',
      content: 'Starting from January 15, 2025, the library will be open from 7:00 AM to 11:00 PM on weekdays and 8:00 AM to 8:00 PM on weekends. Please plan your study schedule accordingly.',
      category: 'general',
      target_audience: 'all',
      created_at: '2025-01-08T14:30:00Z',
      is_active: true,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Scholarship Applications Open',
      content: 'Applications for merit-based scholarships for the academic year 2025-26 are now open. Eligible students can apply through the student portal. Last date for submission is March 10, 2025.',
      category: 'scholarship',
      target_audience: 'students',
      created_at: '2025-01-05T09:00:00Z',
      is_active: true,
      priority: 'high'
    },
    {
      id: '4',
      title: 'Faculty Development Program',
      content: 'A three-day faculty development program on "Modern Teaching Methodologies" will be conducted from February 15-17, 2025. All faculty members are encouraged to participate.',
      category: 'academic',
      target_audience: 'faculty',
      created_at: '2025-01-03T11:15:00Z',
      is_active: true,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Campus Wi-Fi Maintenance',
      content: 'The campus Wi-Fi will undergo maintenance on January 20, 2025, from 2:00 AM to 6:00 AM. Internet services may be intermittent during this period.',
      category: 'maintenance',
      target_audience: 'all',
      created_at: '2025-01-02T16:45:00Z',
      is_active: true,
      priority: 'low'
    },
    {
      id: '6',
      title: 'Annual Sports Meet Registration',
      content: 'Registration for the Annual Inter-Department Sports Meet is now open. Students interested in participating can register at the sports office or through the student portal by February 1, 2025.',
      category: 'events',
      target_audience: 'students',
      created_at: '2024-12-28T12:00:00Z',
      is_active: true,
      priority: 'medium'
    }
  ];

  const fetchNotices = async () => {
    try {
      // For demo purposes, using mock data
      // const response = await axios.get(`${API}/notices`);
      // setNotices(response.data);
      setNotices(mockNotices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices(mockNotices); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories', color: 'from-gray-400 to-gray-600' },
    { value: 'academic', label: 'Academic', color: 'from-blue-400 to-blue-600' },
    { value: 'scholarship', label: 'Scholarships', color: 'from-green-400 to-green-600' },
    { value: 'events', label: 'Events', color: 'from-purple-400 to-purple-600' },
    { value: 'general', label: 'General', color: 'from-orange-400 to-orange-600' },
    { value: 'maintenance', label: 'Maintenance', color: 'from-red-400 to-red-600' }
  ];

  const getNoticeIcon = (category) => {
    const icons = {
      academic: BookOpen,
      scholarship: Users,
      events: Calendar,
      general: Bell,
      maintenance: AlertCircle
    };
    return icons[category] || Bell;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', text: 'High Priority' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Priority' },
      low: { color: 'bg-green-100 text-green-800', text: 'Low Priority' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.color : 'from-gray-400 to-gray-600';
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Notices</h1>
          <p className="text-lg text-gray-600">Stay updated with important announcements and news</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search notices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category.value
                          ? 'bg-gradient-to-r text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      } ${selectedCategory === category.value ? category.color : ''}`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notices List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => {
              const NoticeIcon = getNoticeIcon(notice.category);
              return (
                <Card key={notice.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCategoryColor(notice.category)} flex items-center justify-center`}>
                          <NoticeIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-xl font-semibold text-gray-900">{notice.title}</h2>
                          <div className="flex items-center space-x-2">
                            {getPriorityBadge(notice.priority)}
                            <Badge className="capitalize bg-gray-100 text-gray-800">
                              {notice.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{notice.content}</p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(notice.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span className="capitalize">{notice.target_audience}</span>
                            </div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notices Found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No notices are currently available.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-orange-900">Notice Statistics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Academic</h3>
                <p className="text-gray-600">{notices.filter(n => n.category === 'academic').length} Notices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Scholarships</h3>
                <p className="text-gray-600">{notices.filter(n => n.category === 'scholarship').length} Notices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Events</h3>
                <p className="text-gray-600">{notices.filter(n => n.category === 'events').length} Notices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Total Active</h3>
                <p className="text-gray-600">{notices.filter(n => n.is_active).length} Notices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoticesPage;