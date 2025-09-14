import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { MessageCircle, X, Send, Globe, Clock, Brain, Shield, Users, BookOpen, ArrowRight } from "lucide-react";

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

const FEATURES = [
  {
    id: 1,
    title: "5+ Languages Support",
    description: "Chat in English, Hindi, Gujarati, Telugu, Rajasthani, and Urdu",
    icon: Globe,
    detail: "Our advanced AI understands and responds fluently in multiple Indian languages, making campus assistance accessible to every student regardless of their linguistic background."
  },
  {
    id: 2,
    title: "24/7 Availability", 
    description: "Get instant answers to your campus queries anytime",
    icon: Clock,
    detail: "Never wait for office hours again. Get immediate responses to fee deadlines, scholarship information, timetables, and more at any time of day or night."
  },
  {
    id: 3,
    title: "Context-Aware Conversations",
    description: "Maintains conversation history for better responses",
    icon: Brain,
    detail: "Our chatbot remembers your previous questions and provides contextually relevant answers, creating a natural conversation flow just like talking to a human advisor."
  },
  {
    id: 4,
    title: "Real-time Information",
    description: "Fetches current scholarship and campus updates",
    icon: BookOpen,
    detail: "Stay updated with the latest scholarship opportunities, fee deadlines, and campus announcements. Information is automatically updated from reliable sources."
  },
  {
    id: 5,
    title: "Privacy Protected",
    description: "Your conversations are secure and confidential",
    icon: Shield,
    detail: "We prioritize your privacy with encrypted conversations and secure data handling. Your personal information and chat history remain confidential."
  },
  {
    id: 6,
    title: "Continuous Learning",
    description: "Improves responses based on student interactions",
    icon: Users,
    detail: "The more students interact with our chatbot, the smarter it becomes. Continuous learning ensures better accuracy and more helpful responses over time."
  }
];

const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);
  const messagesEndRef = useRef(null);

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
        language: response.data.language
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        message: "I'm sorry, I'm having trouble responding right now. Please contact our admin office at +91 98765 43210.",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Campus Lingua</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
              <Button onClick={() => setIsChatOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-16 lg:pb-24 overflow-hidden">
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
                Your Multilingual
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                  Campus Assistant
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Get instant answers about fees, scholarships, timetables, and more in your preferred language. Available 24/7 for all your campus queries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setIsChatOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Start Chatting Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium">Quick Demo</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-500/20 text-blue-100 p-3 rounded-lg">
                    स्कॉलरशिप की आखिरी तारीख क्या है?
                  </div>
                  <div className="bg-white/20 text-white p-3 rounded-lg ml-4">
                    छात्रवृत्ति आवेदन की अंतिम तिथि 10 मार्च, 2025 है। योग्यता और आवश्यकता आधारित दोनों छात्रवृत्तियां उपलब्ध हैं...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
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
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                  expandedFeature === feature.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setExpandedFeature(feature.id)}
                onMouseLeave={() => setExpandedFeature(null)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedFeature === feature.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-700 leading-relaxed">{feature.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already using Campus Lingua for their daily queries
          </p>
          <Button 
            onClick={() => setIsChatOpen(true)}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Your First Chat
            <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Campus Lingua</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Making campus assistance accessible to every student through AI-powered multilingual conversations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-slate-400">
                <p>📧 support@campus-connect.edu</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 Admin Building, Room 205</p>
                <p>🕒 Office Hours: 9 AM - 5 PM</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-slate-400">
                <p>Student Portal</p>
                <p>Fee Payment</p>
                <p>Scholarship Office</p>
                <p>Library Services</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Campus Lingua. Built for students, by students.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div>
                <CardTitle className="text-lg">Campus Assistant</CardTitle>
                <p className="text-sm text-blue-100">Ask me anything!</p>
              </div>
              <div className="flex items-center space-x-2">
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
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Welcome! Ask me about fees, scholarships, timetables, or any campus-related query.</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {msg.message}
                  </div>
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
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
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

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Full Page Chat</h1>
        {/* Similar chat implementation but full page */}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;