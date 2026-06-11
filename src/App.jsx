import React, { useState } from 'react';
import { useScheduleBuilder } from './useScheduleBuilder';

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

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const displayDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = ['8a', '10a', '12p', '2p', '4p'];

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

const EmptyCoursesPlaceholder = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '24px 32px',
    border: `2px dashed ${colors.borderLight}`,
    borderRadius: '16px',
    backgroundColor: colors.white,
    color: colors.textPlaceholder,
    fontSize: '16px',
    fontStyle: 'normal'
  }}>
    Add your courses and they will appear here! 
  </div>
);

const ScheduleBuilder = () => {
  const {
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
  } = useScheduleBuilder();
  
  const [sortMethod, setSortMethod] = useState('default');
  const [pinnedCourseIds, setPinnedCourseIds] = useState([]);

  const handleActionChange = (e, course) => {
    const action = e.target.value;
    
    if (action === 'edit') {
      startEditCourse(course);
    } else if (action === 'remove') {
      handleRemoveCourse(course.id);
    } else if (action === 'toggle-pin') {
      togglePinCourse(course.id);
    } else if (action === 'sort-alpha' || action === 'sort-time' || action === 'sort-default') {
      setSortMethod(action.replace('sort-', ''));
    }
    
    e.target.value = '';
  };

  const handleDropdownDayToggle = (e) => {
    const chosenDay = e.target.value;
    if (!chosenDay) return;

    const currentDays = formData.days || (formData.day ? [formData.day] : []);
    let updatedDays;

    if (currentDays.includes(chosenDay)) {
      updatedDays = currentDays.filter(d => d !== chosenDay);
    } else {
      updatedDays = [...currentDays, chosenDay].sort(
        (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
      );
    }

    setFormData({
      ...formData,
      days: updatedDays,
      day: updatedDays[0] || '' 
    });

    e.target.value = '';
  };

  const getSelectedDaysLabel = () => {
    const currentDays = formData.days || (formData.day ? [formData.day] : []);
    if (currentDays.length === 0) return 'Select Days';
    
    return currentDays
      .map(day => displayDays[daysOfWeek.indexOf(day)])
      .join(', ');
  };

  const togglePinCourse = (id) => {
    if (pinnedCourseIds.includes(id)) {
      setPinnedCourseIds(pinnedCourseIds.filter(courseId => courseId !== id));
    } else {
      setPinnedCourseIds([...pinnedCourseIds, id]);
    }
  };

  const getOrganizedCourses = () => {
    const coursesCopy = [...courses];
    
    coursesCopy.sort((a, b) => {
      const aPinned = pinnedCourseIds.includes(a.id);
      const bPinned = pinnedCourseIds.includes(b.id);
      
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      if (sortMethod === 'alpha') {
        return a.name.localeCompare(b.name);
      }
      if (sortMethod === 'time') {
        return a.start.localeCompare(b.start);
      }
      return 0;
    });
    
    return coursesCopy;
  };

  const organizedCourses = getOrganizedCourses();

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
        <h2 style={{ textAlign: 'center', color: colors.primaryBlue, fontSize: '18px', marginTop: 0, marginBottom: '20px', fontWeight: '600' }}>
          {editingId ? 'Edit course details' : 'Add your courses'}
        </h2>
        
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
            <label style={{ display: 'block', fontSize: '12px', color: colors.textMuted, marginBottom: '6px', textAlign: 'center' }}>Days</label>
            <select 
              value="" 
              onChange={handleDropdownDayToggle}
              style={inputStyle}
            >
              <option value="" disabled>{getSelectedDaysLabel()}</option>
              {daysOfWeek.map(day => {
                const currentDays = formData.days || (formData.day ? [formData.day] : []);
                const isSelected = currentDays.includes(day);
                return (
                  <option key={day} value={day}>
                    {isSelected ? `[Selected] ${day}` : `   ${day}`}
                  </option>
                );
              })}
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

        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button type="submit" style={{ backgroundColor: colors.primaryBlue, color: colors.white, border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {editingId ? 'Save Changes' : '+ Add'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ backgroundColor: 'transparent', color: colors.textMuted, border: `1px solid ${colors.borderLight}`, borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: colors.textMain, margin: 0 }}>Your Courses ({semester})</h2>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
            <button type="button" onClick={() => setViewMode('list')} style={{ border: 'none', padding: '8px 16px', fontSize: '14px', backgroundColor: viewMode === 'list' ? colors.primaryBlue : colors.white, color: viewMode === 'list' ? colors.white : colors.textMain, cursor: 'pointer' }}>List</button>
            <button type="button" onClick={() => setViewMode('calendar')} style={{ border: 'none', padding: '8px 16px', fontSize: '14px', backgroundColor: viewMode === 'calendar' ? colors.primaryBlue : colors.white, color: viewMode === 'calendar' ? colors.white : colors.textMain, cursor: 'pointer' }}>Calendar</button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        organizedCourses.length === 0 ? (
          <EmptyCoursesPlaceholder />
        ) : (
          <div style={{ border: `1px solid ${colors.borderLight}`, borderRadius: '12px', overflow: 'hidden' }}>
            {organizedCourses.map(course => {
              const displayDaysList = course.days ? course.days.join(', ') : course.day;
              const isPinned = pinnedCourseIds.includes(course.id);
              return (
                <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${colors.borderLight}`, backgroundColor: isPinned ? '#f8fafd' : colors.white }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <div>
                      <div style={{ fontWeight: '600', color: colors.textMain, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {course.name}
                        {isPinned && <span style={{ fontSize: '11px', backgroundColor: '#e8f0fe', color: colors.primaryBlue, padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>Pinned</span>}
                      </div>
                      <div style={{ fontSize: '14px', color: colors.textMuted }}>{displayDaysList} | {course.start} - {course.end}</div>
                    </div>
                  </div>
                  <div>
                    <select 
                      defaultValue=""
                      onChange={(e) => handleActionChange(e, course)}
                      style={{ ...inputStyle, width: 'auto', display: 'inline-block', padding: '6px 12px', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Actions</option>
                      <option value="edit">Edit Details</option>
                      <option value="toggle-pin">{isPinned ? 'Unpin Course' : 'Pin on Calendar'}</option>
                      <option value="" disabled>──────────</option>
                      <option value="" disabled>Organize List By:</option>
                      <option value="sort-default">  Added Order {sortMethod === 'default' ? '(Selected)' : ''}</option>
                      <option value="sort-alpha">  Alphabetical (A-Z) {sortMethod === 'alpha' ? '(Selected)' : ''}</option>
                      <option value="sort-time">  Start Time {sortMethod === 'time' ? '(Selected)' : ''}</option>
                      <option value="" disabled>──────────</option>
                      <option value="remove">Remove Course</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )
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
                {organizedCourses.filter(c => c.days ? c.days.includes(day) : c.day === day).map(course => {
                  const { top, height } = calculatePosition(course.start, course.end);
                  const styleTheme = getCourseStyle(course.name);
                  const isPinned = pinnedCourseIds.includes(course.id);

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
                        border: isPinned ? `2px dashed ${colors.primaryBlue}` : `1px solid ${styleTheme.border}`,
                        borderRadius: '10px',
                        padding: '10px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        cursor: 'pointer',
                        boxShadow: isPinned ? '0 2px 6px rgba(26,115,232,0.15)' : 'none'
                      }}
                      title="Click to edit or remove course"
                      onClick={() => {
                        const action = window.confirm(`Click "OK" to edit "${course.name}" or "Cancel" to remove it.`);
                        if (action) {
                          startEditCourse(course);
                        } else {
                          if(window.confirm(`Are you sure you want to remove ${course.name}?`)) {
                            handleRemoveCourse(course.id);
                          }
                        }
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '13px', color: styleTheme.text, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.name}</span>
                        {isPinned && <span style={{ fontSize: '11px', fontWeight: 'normal' }}>(Pinned)</span>}
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