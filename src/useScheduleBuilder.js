import { useState, useEffect } from 'react';

export const useScheduleBuilder = () => {
  const [semester, setSemester] = useState('Fall 2026');
  const [viewMode, setViewMode] = useState('calendar'); 
  const [editingId, setEditingId] = useState(null); 
  
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem('schedule_courses');
    return savedCourses ? JSON.parse(savedCourses) : [
      { id: 1, name: 'CST 2307 - NetWorking Fundamentals', day: 'Tuesday', start: '2:00pm', end: '3:00pm' },
      { id: 2, name: 'CST 2301 - MultiMedia and Mobile Device Programming', day: 'Monday', start: '10:00am', end: '11:30am' },
      { id: 3, name: 'ACC 1101 - Principles of Accounting', day: 'Wednesday', start: '1:00pm', end: '2:15pm' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('schedule_courses', JSON.stringify(courses));
  }, [courses]);

  const [formData, setFormData] = useState({ name: '', day: 'Tuesday', start: '', end: '' });

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.start || !formData.end) return;

    if (editingId) {
      setCourses(courses.map(course => course.id === editingId ? { ...course, ...formData } : course));
      setEditingId(null);
    } else {
      const newCourse = { id: Date.now(), ...formData };
      setCourses([...courses, newCourse]);
    }
    
    setFormData({ name: '', day: 'Tuesday', start: '', end: '' });
  };

  const startEditCourse = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      day: course.day,
      start: course.start,
      end: course.end
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', day: 'Tuesday', start: '', end: '' });
  };

  const handleRemoveCourse = (id) => {
    if (editingId === id) cancelEdit();
    setCourses(courses.filter(course => course.id !== id));
  };

  const getCourseStyle = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('calc') || lowerName.includes('math')) {
      return { bg: '#e2f0d9', border: '#70ad47', text: '#385723' };
    }
    if (lowerName.includes('english') || lowerName.includes('writing') || lowerName.includes('acc')) {
      return { bg: '#fce4d6', border: '#f4b183', text: '#c65911' }; 
    }
    return { bg: '#ddebf7', border: '#8faadc', text: '#2f5597' }; 
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const cleanStr = timeStr.toLowerCase().replace(/\s/g, '');
    const match = cleanStr.match(/^(\d+)(?::(\d+))?(am|pm)$/);
    if (!match) return 0;
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3];
    
    if (ampm === 'pm' && hours !== 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const calculatePosition = (start, end) => {
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    
    const calendarStart = 7 * 60;  
    const calendarEnd = 17 * 60;  
    const totalDuration = calendarEnd - calendarStart;
    
    const top = ((startMin - calendarStart) / totalDuration) * 100;
    const height = ((endMin - startMin) / totalDuration) * 100;
    
    return { 
      top: `${Math.max(0, top)}%`, 
      height: `${Math.max(10, height)}%` 
    };
  };

  return {
    semester,
    setSemester,
    viewMode,
    setViewMode,
    editingId,
    formData,
    setFormData,
    courses,
    handleAddCourse,
    startEditCourse,
    cancelEdit,
    handleRemoveCourse,
    getCourseStyle,
    calculatePosition
  };
};