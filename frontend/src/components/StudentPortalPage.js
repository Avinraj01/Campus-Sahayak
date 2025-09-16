import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../App";
import { 
  User, BookOpen, CreditCard, Award, FileText, Calendar, 
  Download, ExternalLink, GraduationCap, Clock, MapPin, Phone,
  Home, Bell, MessageSquare, LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StudentPortalPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock student data (replace with actual API calls)
  const studentData = {
    profile: {
      name: user?.full_name || "Student Name",
      enrollmentNo: user?.enrollment_no || "ENR2025ABCD1234",
      course: "Bachelor of Computer Science",
      semester: "6th Semester",
      year: "3rd Year",
      department: "Computer Science & Engineering",
      batch: "2022-2026",
      status: "Active",
      email: user?.email || "student@example.com",
      phone: "+91 9876543210",
      address: "Student Address, City, State - 123456"
    },
    academics: {
      currentSemester: {
        semester: "6th Semester",
        subjects: [
          { code: "CS601", name: "Database Management Systems", credits: 4, grade: "A" },
          { code: "CS602", name: "Software Engineering", credits: 4, grade: "A-" },
          { code: "CS603", name: "Computer Networks", credits: 3, grade: "B+" },
          { code: "CS604", name: "Web Technologies", credits: 3, grade: "A" },
          { code: "CS605", name: "Data Structures Lab", credits: 2, grade: "A+" }
        ],
        cgpa: 8.45,
        sgpa: 8.2
      },
      attendance: {
        overall: 87,
        subjects: [
          { name: "Database Management Systems", attendance: 92 },
          { name: "Software Engineering", attendance: 88 },
          { name: "Computer Networks", attendance: 85 },
          { name: "Web Technologies", attendance: 89 },
          { name: "Data Structures Lab", attendance: 95 }
        ]
      }
    },
    fees: {
      totalFees: 75000,
      paidAmount: 45000,
      pendingAmount: 30000,
      dueDate: "2025-03-15",
      installments: [
        { name: "First Installment", amount: 25000, status: "Paid", date: "2024-07-15" },
        { name: "Second Installment", amount: 25000, status: "Paid", date: "2024-11-15" },
        { name: "Third Installment", amount: 25000, status: "Pending", dueDate: "2025-03-15" }
      ]
    },
    documents: [
      { name: "Admit Card - Semester 6", type: "admit_card", downloadUrl: "#", date: "2025-01-10" },
      { name: "Fee Receipt - Installment 2", type: "fee_receipt", downloadUrl: "#", date: "2024-11-15" },
      { name: "Transcript - Semester 5", type: "transcript", downloadUrl: "#", date: "2024-12-20" },
      { name: "Character Certificate", type: "certificate", downloadUrl: "#", date: "2024-10-05" }
    ]
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return "text-green-600 bg-green-100";
    if (grade.includes('B')) return "text-blue-600 bg-blue-100";
    if (grade.includes('C')) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
              <Link to="/student-portal" className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-1">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Portal</h1>
          <p className="text-lg text-gray-600">Manage your academic information and resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
            <TabsTrigger value="profile" className="flex items-center space-x-2 py-3">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="academics" className="flex items-center space-x-2 py-3">
              <BookOpen className="h-4 w-4" />
              <span>Academics</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center space-x-2 py-3">
              <CreditCard className="h-4 w-4" />
              <span>Fees</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2 py-3">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{studentData.profile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Enrollment No:</span>
                      <span className="font-mono">{studentData.profile.enrollmentNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{studentData.profile.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{studentData.profile.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className="bg-green-100 text-green-800">{studentData.profile.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Course:</span>
                      <span>{studentData.profile.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span>{studentData.profile.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Current Semester:</span>
                      <span>{studentData.profile.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Academic Year:</span>
                      <span>{studentData.profile.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Batch:</span>
                      <span>{studentData.profile.batch}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academics Tab */}
          <TabsContent value="academics">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Current Semester */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Current Semester Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">{studentData.academics.currentSemester.semester}</span>
                      <div className="flex space-x-4">
                        <Badge className="bg-blue-100 text-blue-800">SGPA: {studentData.academics.currentSemester.sgpa}</Badge>
                        <Badge className="bg-green-100 text-green-800">CGPA: {studentData.academics.currentSemester.cgpa}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {studentData.academics.currentSemester.subjects.map((subject, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-gray-600">{subject.code} • {subject.credits} Credits</p>
                          </div>
                          <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Attendance Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <p className="text-sm text-gray-600">Overall Attendance</p>
                      <p className="text-3xl font-bold text-blue-600">{studentData.academics.attendance.overall}%</p>
                    </div>
                    
                    <div className="space-y-3">
                      {studentData.academics.attendance.subjects.map((subject, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-sm">{subject.name}</span>
                          <Badge className={getAttendanceColor(subject.attendance)}>
                            {subject.attendance}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Fee Summary */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Fee Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Fees</p>
                      <p className="text-2xl font-bold">₹{studentData.fees.totalFees.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Amount:</span>
                      <span className="font-medium text-green-600">₹{studentData.fees.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Amount:</span>
                      <span className="font-medium text-red-600">₹{studentData.fees.pendingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="font-medium">{new Date(studentData.fees.dueDate).toLocaleDateString()}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Installments */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Fee Installments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentData.fees.installments.map((installment, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          installment.status === 'Paid' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{installment.name}</h3>
                              <p className="text-gray-600">₹{installment.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={installment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {installment.status}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                {installment.status === 'Paid' ? installment.date : `Due: ${installment.dueDate}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Available Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {studentData.documents.map((doc, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{doc.name}</h3>
                        <Badge className="capitalize">{doc.type.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Generated on: {new Date(doc.date).toLocaleDateString()}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
};

export default StudentPortalPage;