import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { FileText, Upload, Send, Clock, CheckCircle, XCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FormsPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    form_type: 'affidavit'
  });

  const formTypes = [
    { value: 'affidavit', label: 'Affidavit Request' },
    { value: 'character_certificate', label: 'Character Certificate' },
    { value: 'bonafide_certificate', label: 'Bonafide Certificate' },
    { value: 'transcript', label: 'Academic Transcript' },
    { value: 'recommendation_letter', label: 'Recommendation Letter' },
    { value: 'no_objection_certificate', label: 'No Objection Certificate' },
    { value: 'course_completion', label: 'Course Completion Certificate' },
    { value: 'other', label: 'Other Documents' }
  ];

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${API}/forms`);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('form_type', formData.form_type);
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      await axios.post(`${API}/forms`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Form submitted successfully!');
      setFormData({ title: '', description: '', form_type: 'affidavit' });
      setSelectedFile(null);
      fetchForms(); // Refresh the list
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' }
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

  const getFormTypeColor = (formType) => {
    const colors = {
      affidavit: 'from-blue-400 to-blue-600',
      character_certificate: 'from-green-400 to-green-600',
      bonafide_certificate: 'from-purple-400 to-purple-600',
      transcript: 'from-orange-400 to-orange-600',
      recommendation_letter: 'from-indigo-400 to-indigo-600',
      no_objection_certificate: 'from-pink-400 to-pink-600',
      course_completion: 'from-teal-400 to-teal-600',
      other: 'from-gray-400 to-gray-600'
    };
    return colors[formType] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Form Submission Portal</h1>
          <p className="text-lg text-gray-600">Apply for certificates and official documents from HOD</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submit New Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Submit New Application
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
                    <Label htmlFor="description">Purpose & Details</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Explain why you need this document and provide any additional details..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="file">Supporting Documents (Optional)</Label>
                    <div className="mt-1">
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Submitting...' : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Document Guidelines */}
            <Card className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 text-green-900">📋 Required Information</h3>
                <div className="text-xs text-green-800 space-y-2">
                  <p>• <strong>Character Certificate:</strong> Requires student ID and purpose</p>
                  <p>• <strong>Bonafide Certificate:</strong> Current enrollment proof needed</p>
                  <p>• <strong>Transcript:</strong> Specify semester/year required</p>
                  <p>• <strong>Recommendation:</strong> Mention target institution/purpose</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : forms.length > 0 ? (
                  <div className="space-y-4">
                    {forms.map((form) => (
                      <Card key={form.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getFormTypeColor(form.form_type)}`}></div>
                              <h3 className="font-semibold text-lg">{form.title}</h3>
                            </div>
                            {getStatusBadge(form.status)}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{form.description}</p>
                          
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                              {form.form_type.replace('_', ' ')}
                            </span>
                            <div className="flex items-center space-x-4">
                              {form.file_path && (
                                <span className="flex items-center text-blue-600">
                                  <Upload className="h-3 w-3 mr-1" />
                                  File attached
                                </span>
                              )}
                              <span>{new Date(form.created_at).toLocaleDateString()}</span>
                            </div>
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

        {/* Processing Timeline */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-blue-900">📅 Processing Timeline</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">1</div>
                <p className="font-medium">Submit Application</p>
                <p className="text-gray-600">Fill form & upload documents</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">2</div>
                <p className="font-medium">Under Review</p>
                <p className="text-gray-600">HOD reviews your request</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">3</div>
                <p className="font-medium">Processing</p>
                <p className="text-gray-600">Document preparation</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">4</div>
                <p className="font-medium">Ready for Collection</p>
                <p className="text-gray-600">Visit office to collect</p>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p><strong>Typical processing time:</strong> 3-5 working days for most documents</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormsPage;