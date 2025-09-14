import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle, Globe } from "lucide-react";

const ContactPage = () => {
  const whatsappNumber = "+916200060778";
  const email = "avinyaduvansi123@gmail.com";
  const facebookUrl = "https://www.facebook.com/profile.php?id=100022302462266";

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      value: whatsappNumber,
      description: "Call us during office hours",
      action: () => window.open(`tel:${whatsappNumber}`, '_self'),
      color: "from-green-400 to-green-600"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: whatsappNumber,
      description: "Quick messaging support",
      action: () => window.open(`https://wa.me/${whatsappNumber.replace('+', '')}`, '_blank'),
      color: "from-green-500 to-green-700"
    },
    {
      icon: Mail,
      title: "Email",
      value: email,
      description: "Send us detailed queries",
      action: () => window.open(`mailto:${email}`, '_self'),
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Facebook,
      title: "Facebook",
      value: "Campus Portal",
      description: "Follow us for updates",
      action: () => window.open(facebookUrl, '_blank'),
      color: "from-blue-600 to-blue-800"
    }
  ];

  const departments = [
    {
      name: "Academic Office",
      head: "Dr. Academic Head",
      location: "Admin Building, Room 201",
      hours: "9:00 AM - 5:00 PM",
      contact: "+91 1234567890",
      services: ["Admissions", "Academic Records", "Transcripts", "Course Information"]
    },
    {
      name: "Student Affairs",
      head: "Prof. Student Affairs",
      location: "Admin Building, Room 202",
      hours: "9:00 AM - 4:00 PM",
      contact: "+91 1234567891",
      services: ["Student Activities", "Clubs & Societies", "Events", "Student Support"]
    },
    {
      name: "Examination Office",
      head: "Dr. Controller of Examinations",
      location: "Admin Building, Room 203",
      hours: "10:00 AM - 4:00 PM",
      contact: "+91 1234567892",
      services: ["Exam Schedules", "Results", "Certificates", "Re-evaluation"]
    },
    {
      name: "Library Services",
      head: "Chief Librarian",
      location: "Central Library",
      hours: "8:00 AM - 10:00 PM",
      contact: "+91 1234567893",
      services: ["Book Issue/Return", "Digital Resources", "Research Support", "Reading Room"]
    }
  ];

  const quickLinks = [
    { title: "Student Portal", url: "/student-portal", icon: Globe },
    { title: "Submit Complaint", url: "/complaints", icon: MessageCircle },
    { title: "Apply for Documents", url: "/forms", icon: Phone },
    { title: "Academic Calendar", url: "/calendar", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us through multiple channels. We're here to help you with all your campus needs.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                <p className="font-medium text-gray-800 mb-4">{method.value}</p>
                <Button 
                  onClick={method.action}
                  className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90`}
                >
                  Contact Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Information */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Department Contacts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle>{dept.name}</CardTitle>
                  <p className="text-purple-100">{dept.head}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{dept.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{dept.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{dept.contact}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dept.services.map((service, serviceIndex) => (
                        <span key={serviceIndex} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <link.icon className="h-8 w-8 mx-auto mb-3 text-purple-600 group-hover:text-purple-700" />
                  <h3 className="font-semibold">{link.title}</h3>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => window.location.href = link.url}
                  >
                    Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Campus Information */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Campus Information</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-purple-100">
                  Admin Building, Room 205<br />
                  Campus Address<br />
                  City, State - 123456
                </p>
              </div>
              <div>
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Office Hours</h3>
                <p className="text-purple-100">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday: 9:00 AM - 1:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
              <div>
                <Phone className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Emergency Contact</h3>
                <p className="text-purple-100">
                  Security: +91 9876543210<br />
                  Medical: +91 9876543211<br />
                  Administration: {whatsappNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.open(facebookUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Facebook className="h-5 w-5 mr-2" />
              Facebook
            </Button>
            <Button
              onClick={() => window.open(`https://wa.me/${whatsappNumber.replace('+', '')}`, '_blank')}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={() => window.open(`mailto:${email}`, '_self')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;