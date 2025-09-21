import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Home, FileText, Calendar, Bell, Phone, User, LogOut, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

// The REACT_APP_BACKEND_URL already includes /api

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic'
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const categories = [
    { value: 'academic', label: 'Academic Issues' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'hostel', label: 'Hostel & Accommodation' },
    { value: 'library', label: 'Library Services' },
    { value: 'transport', label: 'Transportation' },
    { value: 'canteen', label: 'Canteen & Food' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'other', label: 'Other' }
  ];

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/api/complaints");
      setComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await api.post("/api/complaints", formData);
      alert('Complaint submitted successfully!');
      setFormData({ title: '', description: '', category: 'academic' });
      fetchComplaints(); // Refresh the list
    } catch (error) {
      alert('Error submitting complaint. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      in_review: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, text: 'In Review' },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resolved' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'from-blue-400 to-blue-600',
      infrastructure: 'from-orange-400 to-orange-600',
      hostel: 'from-purple-400 to-purple-600',
      library: 'from-green-400 to-green-600',
      transport: 'from-indigo-400 to-indigo-600',
      canteen: 'from-pink-400 to-pink-600',
      administrative: 'from-red-400 to-red-600',
      other: 'from-gray-400 to-gray-600'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
              <Link to="/complaints" className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-1">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complaint Portal</h1>
          <p className="text-lg text-gray-600">Submit your concerns directly to the HOD</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit New Complaint */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Submit New Complaint
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Complaint Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Provide detailed information about your complaint..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Submitting...' : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Complaints List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Your Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : complaints && Array.isArray(complaints) && complaints.length > 0 ? (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <Card key={complaint.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(complaint.category)}`}></div>
                              <h3 className="font-semibold text-lg">{complaint.title}</h3>
                            </div>
                            {getStatusBadge(complaint.status)}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{complaint.description}</p>
                          
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                              {complaint.category.replace('_', ' ')}
                            </span>
                            <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No complaints submitted yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Guidelines */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-blue-900">Guidelines for Complaint Submission</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">✅ Do's:</h4>
                <ul className="space-y-1">
                  <li>• Be specific and clear about the issue</li>
                  <li>• Provide relevant details and context</li>
                  <li>• Choose the appropriate category</li>
                  <li>• Use respectful language</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">❌ Don'ts:</h4>
                <ul className="space-y-1">
                  <li>• Use offensive or inappropriate language</li>
                  <li>• Submit duplicate complaints</li>
                  <li>• Include personal attacks</li>
                  <li>• Submit false information</li>
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

export default ComplaintsPage;