import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { 
  MessageCircle, X, Send, Globe, Clock, Brain, Shield, Users, BookOpen, 
  ArrowRight, Home, FileText, Calendar, Bell, Phone, Mail, MessageSquare,
  User, LogOut, Upload, Eye, EyeOff, Facebook, Bot, Mic, MicOff,
  ExternalLink, Headphones, Volume2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LANGUAGES = {
  en: "English",
  hi: "हिंदी",
  gu: "ગુજરાતી", 
  te: "తెలుగు",
  raj: "राजस्थानी",
  ur: "اردو"
};

// Auth Context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user info from token (you might want to decode JWT)
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Login Page
const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    user_type: 'student'
  });
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    user_type: 'student',
    full_name: '',
    phone: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/register`, signupData);
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/70 backdrop-blur-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Campus Management System
          </CardTitle>
          <p className="text-gray-600">Access your campus portal</p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>User Type</Label>
                  <Select value={formData.user_type} onValueChange={(value) => setFormData({...formData, user_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>
                    {formData.user_type === 'student' ? 'Email or Enrollment No.' : 
                     formData.user_type === 'faculty' ? 'Email or Teacher ID' : 'Email'}
                  </Label>
                  <Input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                    placeholder={formData.user_type === 'student' ? 'Enter email or enrollment number' : 
                               formData.user_type === 'faculty' ? 'Enter email or teacher ID' : 'Enter email'}
                    required
                  />
                </div>
                
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Enter password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label>User Type</Label>
                  <Select value={signupData.user_type} onValueChange={(value) => setSignupData({...signupData, user_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={signupData.full_name}
                    onChange={(e) => setSignupData({...signupData, full_name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label>Phone (Optional)</Label>
                  <Input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      placeholder="Create password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Navigation
const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
  );
};

// Enhanced Features with Colorful Design
const FEATURES = [
  {
    id: 1,
    title: "5+ Languages Support",
    description: "Chat in English, Hindi, Gujarati, Telugu, Rajasthani, and Urdu",
    icon: Globe,
    color: "from-emerald-400 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50",
    detail: "Our advanced AI understands and responds fluently in multiple Indian languages, making campus assistance accessible to every student regardless of their linguistic background.",
    image: "🌏"
  },
  {
    id: 2,
    title: "24/7 Availability", 
    description: "Get instant answers to your campus queries anytime",
    icon: Clock,
    color: "from-blue-400 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
    detail: "Never wait for office hours again. Get immediate responses to fee deadlines, scholarship information, timetables, and more at any time of day or night.",
    image: "🕒"
  },
  {
    id: 3,
    title: "Context-Aware Conversations",
    description: "Maintains conversation history for better responses",
    icon: Brain,
    color: "from-purple-400 to-pink-600",
    bgColor: "from-purple-50 to-pink-50",
    detail: "Our chatbot remembers your previous questions and provides contextually relevant answers, creating a natural conversation flow just like talking to a human advisor.",
    image: "🧠"
  },
  {
    id: 4,
    title: "Real-time Information",
    description: "Fetches current scholarship and campus updates",
    icon: BookOpen,
    color: "from-orange-400 to-red-600",
    bgColor: "from-orange-50 to-red-50",
    detail: "Stay updated with the latest scholarship opportunities, fee deadlines, and campus announcements. Information is automatically updated from reliable sources.",
    image: "📚"
  },
  {
    id: 5,
    title: "Privacy Protected",
    description: "Your conversations are secure and confidential",
    icon: Shield,
    color: "from-green-400 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50",
    detail: "We prioritize your privacy with encrypted conversations and secure data handling. Your personal information and chat history remain confidential.",
    image: "🛡️"
  },
  {
    id: 6,
    title: "Continuous Learning",
    description: "Improves responses based on student interactions",
    icon: Users,
    color: "from-cyan-400 to-blue-600",
    bgColor: "from-cyan-50 to-blue-50",
    detail: "The more students interact with our chatbot, the smarter it becomes. Continuous learning ensures better accuracy and more helpful responses over time.",
    image: "👥"
  }
];

// Dashboard Page
const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: inputMessage,
        session_id: sessionId,
        language: selectedLanguage
      });

      const botMessage = {
        id: Date.now() + 1,
        message: response.data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
        language: response.data.language,
        suggested_links: response.data.suggested_links || []
      };

      setMessages(prev => [...prev, botMessage]);

      // Text-to-speech if voice is enabled
      if (isVoiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.data.response);
        utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        message: "I'm sorry, I'm having trouble responding right now. Please contact our admin office at +916200060778.",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <img 
              src="/college-building.jpg" 
              alt="Campus Building" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Welcome back,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  {user?.full_name}!
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Your comprehensive campus management portal with AI-powered multilingual assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setIsChatOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Bot className="mr-2 h-5 w-5" />
                  Start AI Chat
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium">Quick Stats</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="space-y-3 text-sm text-white">
                  <div className="flex justify-between">
                    <span>User Type:</span>
                    <span className="capitalize font-medium">{user?.user_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-medium">{user?.enrollment_no || user?.teacher_id || 'General User'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-800 mb-6">
              Powerful Features for 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Every Student</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the future of campus assistance with our AI-powered multilingual chatbot
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <Card 
                key={feature.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${
                  expandedFeature === feature.id ? 'scale-105 shadow-2xl z-10' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setExpandedFeature(feature.id)}
                onMouseLeave={() => setExpandedFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-50`}></div>
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                      <div className="text-4xl mt-2">{feature.image}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <div className={`overflow-hidden transition-all duration-500 ${
                    expandedFeature === feature.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{feature.detail}</p>
                      <div className="mt-3">
                        <Badge className={`bg-gradient-to-r ${feature.color} text-white`}>
                          Enhanced Feature
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/complaints" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <CardContent className="pt-6">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-blue-600 group-hover:text-blue-700" />
                  <h3 className="font-semibold mb-2">Submit Complaint</h3>
                  <p className="text-sm text-slate-600">Report issues to HOD</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/forms" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <CardContent className="pt-6">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-green-600 group-hover:text-green-700" />
                  <h3 className="font-semibold mb-2">Form Submission</h3>
                  <p className="text-sm text-slate-600">Apply for certificates</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/calendar" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <CardContent className="pt-6">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600 group-hover:text-purple-700" />
                  <h3 className="font-semibold mb-2">Academic Calendar</h3>
                  <p className="text-sm text-slate-600">View important dates</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/notices" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <CardContent className="pt-6">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-orange-600 group-hover:text-orange-700" />
                  <h3 className="font-semibold mb-2">Latest Notices</h3>
                  <p className="text-sm text-slate-600">Stay updated</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Enhanced Chat Widget */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Campus Assistant
                </CardTitle>
                <p className="text-sm text-blue-100">Ask me anything!</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`text-white hover:bg-white/20 p-1 ${isVoiceEnabled ? 'bg-white/20' : ''}`}
                >
                  {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                </Button>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-24 h-8 bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Welcome! Ask me about fees, scholarships, timetables, or any campus-related query.</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                  
                  {/* Suggested Links */}
                  {msg.suggested_links && msg.suggested_links.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-2">
                      {msg.suggested_links.map((link, index) => (
                        <Link
                          key={index}
                          to={link.url}
                          onClick={() => setIsChatOpen(false)}
                          className="inline-flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>{link.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={startVoiceRecognition}
                    className={`absolute right-0 top-0 h-full px-3 ${isListening ? 'text-red-500' : 'text-slate-400'}`}
                    disabled={isListening}
                  >
                    {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// App Component
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;