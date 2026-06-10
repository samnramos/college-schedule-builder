import React, { useState } from 'react';

const ScheduleBuilder = () => {
  const [semester, setSemester] = useState('Fall 2026');
  const [viewMode, setViewMode] = useState('calendar'); 
  const [courses, setCourses] = useState([
    { id: 1, name: 'CST 2307 - NetWorking Fundaentals', day: 'Tuesday', start: '2:00pm', end: '3:00pm' },
    { id: 2, name: 'CST 2301 - MultiMedia and Mobile Device Programming', day: 'Monday', start: '10:00am', end: '11:30am' },
    { id: 3, name: 'ACC 1101 - Principles of Accounting', day: 'Wednesday', start: '1:00pm', end: '2:15pm' }
  ]);

  const [formData, setFormData] = useState({ name: '', day: 'Tuesday', start: '', end: '' });

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.start || !formData.end) return;

    const newCourse = { id: Date.now(), ...formData };
    setCourses([...courses, newCourse]);
    setFormData({ name: '', day: 'Tuesday', start: '', end: '' });
  };

  const handleRemoveCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const colors = {
    primaryBlue: '#1a73e8',
    buttonHover: '#155cb4',
    bgContainer: '#f1f3f4',
    borderLight: '#e0e0e0', 
    textMain: '#202124',
    textMuted: '#70757a',
    textPlaceholder: '#9aa0a6',
    white: '#ffffff',
    dangerRed: '#d93025',
    dangerHover: '#b31412',
    calendarHeaderBg: '#f8f9fa'
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

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const displayDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = ['8a', '10a', '12p', '2p', '4p'];

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

  const inputStyle = {
    backgroundColor: colors.white,
    color: colors.textMain,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', border: `1px solid ${colors.borderLight}`, borderRadius: '16px', padding: '40px', backgroundColor: colors.white, boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.textMain, margin: 0 }}>College Schedule Builder</h1>
        <div>
          <span style={{ fontSize: '14px', color: colors.textMuted, marginRight: '8px' }}>Semester:</span>
          <select 
            value={semester} 
            onChange={(e) => setSemester(e.target.value)}
            style={{ ...inputStyle, width: 'auto', display: 'inline-block' }}
          >
            <option value="Fall 2026">Fall 2026</option>
            <option value="Winter 2026">Winter 2026</option>
            <option value="Spring 2027">Spring 2027</option>
            <option value="Fall 2027">Fall 2027</option>

          </select>
        </div>
      </div>

      <form onSubmit={handleAddCourse} style={{ backgroundColor: colors.bgContainer, padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
        <h2 style={{ textAlign: 'center', color: colors.primaryBlue, fontSize: '18px', marginTop: 0, marginBottom: '20px', fontWeight: '600' }}>Add your courses</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginBottom: '6px', textAlign: 'center' }}>Course name</label>
            <input 
              type="text" 
              placeholder="e.g. CST 2309 or Intro to CS"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginBottom: '6px', textAlign: 'center' }}>Day</label>
            <select 
              value={formData.day}
              onChange={(e) => setFormData({...formData, day: e.target.value})}
              style={inputStyle}
            >
              {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginBottom: '6px', textAlign: 'center' }}>Start</label>
            <input 
              type="text" 
              placeholder="10:00am"
              value={formData.start}
              onChange={(e) => setFormData({...formData, start: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginBottom: '6px', textAlign: 'center' }}>End</label>
            <input 
              type="text" 
              placeholder="11:30am"
              value={formData.end}
              onChange={(e) => setFormData({...formData, end: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={{ backgroundColor: colors.primaryBlue, color: colors.white, border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textMain, margin: 0 }}>Your Courses ({semester})</h2>
        <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
          <button type="button" onClick={() => setViewMode('list')} style={{ border: 'none', padding: '8px 16px', fontSize: '14px', backgroundColor: viewMode === 'list' ? colors.primaryBlue : colors.white, color: viewMode === 'list' ? colors.white : colors.textMain, cursor: 'pointer' }}>List</button>
          <button type="button" onClick={() => setViewMode('calendar')} style={{ border: 'none', padding: '8px 16px', fontSize: '14px', backgroundColor: viewMode === 'calendar' ? colors.primaryBlue : colors.white, color: viewMode === 'calendar' ? colors.white : colors.textMain, cursor: 'pointer' }}>Calendar</button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: '12px', overflow: 'hidden' }}>
          {courses.map(course => (
            <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: colors.white }}>
              <div>
                <div style={{ fontWeight: '600', color: colors.textMain, marginBottom: '4px' }}>{course.name}</div>
                <div style={{ fontSize: '14px', color: colors.textMuted }}>{course.day} | {course.start} - {course.end}</div>
              </div>
              <button type="button" onClick={() => handleRemoveCourse(course.id)} style={{ backgroundColor: 'transparent', color: colors.dangerRed, border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: '16px', backgroundColor: colors.white, padding: '24px 16px 16px 16px', position: 'relative' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', textAlign: 'center', marginBottom: '10px' }}>
            <div></div> 
            {displayDays.map((day) => (
              <div key={day} style={{ fontWeight: '400', fontSize: '15px', color: '#5f6368' }}>{day}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', position: 'relative', height: '540px' }}>
            
            <div style={{ position: 'absolute', top: 0, left: '50px', right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
              {[...Array(6)].map((_, idx) => (
                <div key={idx} style={{ borderBottom: `1px solid #f1f3f4`, width: '100%', height: '0px' }} />
              ))}
            </div>

            <div style={{ position: 'absolute', top: 0, left: '50px', right: 0, bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', pointerEvents: 'none' }}>
              {daysOfWeek.map((day, idx) => (
                <div key={day} style={{ borderLeft: `1px solid #e8eaed`, height: '100%', borderRight: idx === 6 ? `1px solid #e8eaed` : 'none' }} />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: 'translateY(-8px)', height: '100%', fontSize: '13px', color: '#70757a', paddingRight: '12px', textAlign: 'right' }}>
              <div></div> 
              {timeSlots.map(time => (
                <div key={time} style={{ height: '0px', lineHeight: '0px' }}>{time}</div>
              ))}
              <div></div> 
            </div>

            {daysOfWeek.map((day) => (
              <div key={day} style={{ position: 'relative', height: '100%' }}>
                {courses.filter(c => c.day === day).map(course => {
                  const { top, height } = calculatePosition(course.start, course.end);
                  const styleTheme = getCourseStyle(course.name);

                  return (
                    <div 
                      key={course.id} 
                      style={{ 
                        position: 'absolute',
                        left: '6px',
                        right: '6px',
                        top: top,
                        height: height,
                        backgroundColor: styleTheme.bg,
                        border: `1px solid ${styleTheme.border}`,
                        borderRadius: '10px',
                        padding: '10px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        cursor: 'pointer'
                      }}
                      title="Click to remove course"
                      onClick={() => {
                        if(window.confirm(`Remove ${course.name}?`)) handleRemoveCourse(course.id);
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '13px', color: styleTheme.text, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {course.name}
                      </div>
                      <div style={{ fontSize: '11px', color: styleTheme.text, opacity: 0.9 }}>
                        {course.start.replace(':00', '')}–{course.end.replace(':00', '')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleBuilder;


