import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, BookOpen, Clock, MapPin, Users } from "lucide-react";

const CalendarPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const academicEvents = [
    {
      id: 1,
      date: '2025-01-15',
      title: 'Semester Registration Begins',
      type: 'registration',
      description: 'Online registration for Spring semester',
      location: 'Student Portal',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 2,
      date: '2025-02-01',
      title: 'Classes Begin',
      type: 'academic',
      description: 'First day of Spring semester classes',
      location: 'All Campus',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 3,
      date: '2025-02-14',
      title: 'Valentine\'s Day Celebration',
      type: 'event',
      description: 'Campus cultural program',
      location: 'Main Auditorium',
      color: 'bg-pink-100 text-pink-800 border-pink-200'
    },
    {
      id: 4,
      date: '2025-03-10',
      title: 'Scholarship Application Deadline',
      type: 'deadline',
      description: 'Last date for merit scholarship applications',
      location: 'Scholarship Office',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 5,
      date: '2025-03-15',
      title: 'Fee Payment Deadline',
      type: 'deadline',
      description: 'Last date for semester fee payment',
      location: 'Accounts Office',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 6,
      date: '2025-04-01',
      title: 'Mid-Semester Examinations',
      type: 'exam',
      description: 'Mid-term examinations begin',
      location: 'Examination Halls',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      id: 7,
      date: '2025-04-15',
      title: 'Annual Sports Meet',
      type: 'event',
      description: 'Inter-department sports competition',
      location: 'Sports Complex',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 8,
      date: '2025-05-01',
      title: 'Summer Internship Program',
      type: 'program',
      description: 'Summer internship program begins',
      location: 'Various Organizations',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    {
      id: 9,
      date: '2025-05-15',
      title: 'Final Examinations',
      type: 'exam',
      description: 'End semester examinations',
      location: 'Examination Halls',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      id: 10,
      date: '2025-06-01',
      title: 'Summer Break Begins',
      type: 'holiday',
      description: 'Summer vacation starts',
      location: 'Campus',
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  ];

  const getEventsForMonth = (month, year) => {
    return academicEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  const getEventIcon = (type) => {
    const icons = {
      registration: BookOpen,
      academic: Calendar,
      event: Users,
      deadline: Clock,
      exam: BookOpen,
      program: Users,
      holiday: Calendar
    };
    return icons[type] || Calendar;
  };

  const importantDates = [
    { title: 'Academic Year Begins', date: 'July 1, 2025' },
    { title: 'Admission Process Starts', date: 'March 1, 2025' },
    { title: 'Annual Convocation', date: 'December 15, 2025' },
    { title: 'Alumni Meet', date: 'October 20, 2025' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Calendar</h1>
          <p className="text-lg text-gray-600">Stay updated with important academic dates and events</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Controls */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm mb-6">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Calendar Navigator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Month</label>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Important Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {importantDates.map((date, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <span className="font-medium text-sm">{date.title}</span>
                      <span className="text-xs text-gray-600">{date.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  {months[selectedMonth]} {selectedYear} Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getEventsForMonth(selectedMonth, selectedYear).length > 0 ? (
                    getEventsForMonth(selectedMonth, selectedYear).map((event) => {
                      const EventIcon = getEventIcon(event.type);
                      return (
                        <Card key={event.id} className={`border-l-4 hover:shadow-md transition-shadow ${event.color}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                  <EventIcon className="h-6 w-6 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-lg">{event.title}</h3>
                                  <Badge className="capitalize">{event.type}</Badge>
                                </div>
                                <p className="text-gray-600 mb-2">{event.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No events scheduled for this month.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Academic Year Overview */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-indigo-900">Academic Year 2024-25 Overview</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Semesters</h3>
                <p className="text-gray-600">2 Semesters</p>
                <p className="text-sm text-gray-500">Spring & Fall</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Academic Days</h3>
                <p className="text-gray-600">180 Days</p>
                <p className="text-sm text-gray-500">Per Semester</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Events</h3>
                <p className="text-gray-600">50+ Events</p>
                <p className="text-sm text-gray-500">Cultural & Academic</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Holidays</h3>
                <p className="text-gray-600">25 Days</p>
                <p className="text-sm text-gray-500">National & Regional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;