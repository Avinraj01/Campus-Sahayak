import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { FileText, Upload, Send, CheckCircle, Clock, AlertCircle, Home, Calendar, Bell, Phone, User, LogOut, BookOpen, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FormsPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    form_type: 'certificate'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formTypes = [
    { value: 'certificate', label: 'Character Certificate' },
    { value: 'transcript', label: 'Official Transcript' },
    { value: 'letter', label: 'Recommendation Letter' },
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'migration', label: 'Migration Certificate' },
    { value: 'bonafide', label: 'Bonafide Certificate' },
    { value: 'other', label: 'Other Documents' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('form_type', formData.form_type);
      if (file) {
        formDataToSend.append('file', file);
      }

      await axios.post(`${API}/forms`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Form submitted successfully!');
      setFormData({ title: '', description: '', form_type: 'certificate' });
      setFile(null);
      
      // Refresh submissions list
      fetchSubmissions();
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API}/forms`);
      setSubmissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      // Mock data for demo
      setSubmissions([
        {
          id: "1",
          title: "Character Certificate Request",
          description: "Need character certificate for job application",
          form_type: "certificate",
          status: "pending",
          created_at: "2025-01-15T10:00:00.000Z"
        },
        {
          id: "2", 
          title: "Official Transcript",
          description: "Transcript required for higher studies",
          form_type: "transcript",
          status: "approved",
          created_at: "2025-01-10T09:00:00.000Z"
        }
      ]);
    }
  };

  React.useEffect(() => {
    fetchSubmissions();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Rejected' }
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

  const getFormTypeColor = (type) => {
    const colors = {
      certificate: 'from-blue-400 to-blue-600',
      transcript: 'from-green-400 to-green-600',
      letter: 'from-purple-400 to-purple-600',
      affidavit: 'from-orange-400 to-orange-600',
      migration: 'from-red-400 to-red-600',
      bonafide: 'from-cyan-400 to-cyan-600',
      other: 'from-gray-400 to-gray-600'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
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
              <Link to="/forms" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors flex items-center space-x-1">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Form Submission Portal</h1>
            <p className="text-lg text-gray-600">Apply for certificates and official documents</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Submit New Form */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Submit New Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="form_type">Document Type</Label>
                      <Select value={formData.form_type} onValueChange={(value) => setFormData({...formData, form_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="title">Application Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Brief title for your application"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Purpose/Reason</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Explain why you need this document..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="file">Supporting Documents (Optional)</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Form Submissions List */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Your Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {submissions && Array.isArray(submissions) && submissions.length > 0 ? (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <Card key={submission.id} className="border-l-4 border-l-cyan-500 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getFormTypeColor(submission.form_type)}`}></div>
                                <h3 className="font-semibold text-lg">{submission.title}</h3>
                              </div>
                              {getStatusBadge(submission.status)}
                            </div>
                            
                            <p className="text-gray-600 mb-3">{submission.description}</p>
                            
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                                {submission.form_type.replace('_', ' ')}
                              </span>
                              <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No applications submitted yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Guidelines */}
          <Card className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-cyan-900">Application Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-cyan-800">
                <div>
                  <h4 className="font-medium mb-2">📋 Required Information:</h4>
                  <ul className="space-y-1">
                    <li>• Clear and specific title</li>
                    <li>• Detailed purpose/reason</li>
                    <li>• Valid contact information</li>
                    <li>• Supporting documents (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">⏱️ Processing Time:</h4>
                  <ul className="space-y-1">
                    <li>• Character Certificate: 3-5 working days</li>
                    <li>• Official Transcript: 5-7 working days</li>
                    <li>• Other certificates: 5-10 working days</li>
                    <li>• Rush processing available for urgent cases</li>
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

export default FormsPage;