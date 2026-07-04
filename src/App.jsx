//use of AI generated code

import React, { useState } from 'react';
import { useScheduleBuilder } from './useScheduleBuilder';
import './App.css'; 

// Constants for days of the week and time slots

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const displayDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = ['8a', '10a', '12p', '2p', '4p', '6p', '8p'];

// Placeholder component for when there are no courses

const EmptyCoursesPlaceholder = () => (
  <div className="sb-empty-placeholder">
    Add your courses and they will appear here! 
  </div>
);

// Main ScheduleBuilder component

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

  // Function to get the label for the selected days in the dropdown

  const getSelectedDaysLabel = () => {
    const currentDays = formData.days || (formData.day ? [formData.day] : []);
    if (currentDays.length === 0) return 'Select Days';
    
    return currentDays
      .map(day => displayDays[daysOfWeek.indexOf(day)])
      .join(', ');
  };

// Function to toggle pinning a course

  const togglePinCourse = (id) => {
    if (pinnedCourseIds.includes(id)) {
      setPinnedCourseIds(pinnedCourseIds.filter(courseId => courseId !== id));
    } else {
      setPinnedCourseIds([...pinnedCourseIds, id]);
    }
  };

  // Function to get organized courses based on pinning and sorting

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

  // Get the organized courses for rendering

  const organizedCourses = getOrganizedCourses();

  return (
    <div className="sb-wrapper">
      
      <div className="sb-header">
        <h1 className="sb-title">College Schedule Builder</h1>
        <div>
          <span className="sb-semester-label">Semester:</span>
          <select 
            value={semester} 
            onChange={(e) => setSemester(e.target.value)}
            className="sb-input sb-select-inline"
          >
            <option value="Fall 2026">Fall 2026</option>
            <option value="Winter 2026">Winter 2026</option>
            <option value="Spring 2027">Spring 2027</option>
            <option value="Fall 2027">Fall 2027</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleAddCourse} className="sb-form">
        <h2 className="sb-form-title">
          {editingId ? 'Edit course details' : 'Add your courses'}
        </h2>
        
        <div className="sb-form-grid">
          <div>
            <label className="sb-field-label">Course name</label>
            <input 
              type="text" 
              placeholder="e.g. CST 2309 or Intro to CS"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="sb-input"
            />
          </div>

          <div>
            <label className="sb-field-label">Days</label>
            <select 
              value="" 
              onChange={handleDropdownDayToggle}
              className="sb-input"
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
            <label className="sb-field-label">Start</label>
            <input 
              type="text" 
              placeholder="10:00am"
              value={formData.start}
              onChange={(e) => setFormData({...formData, start: e.target.value})}
              className="sb-input"
            />
          </div>

          <div>
            <label className="sb-field-label">End</label>
            <input 
              type="text" 
              placeholder="11:30am"
              value={formData.end}
              onChange={(e) => setFormData({...formData, end: e.target.value})}
              className="sb-input"
            />
          </div>
        </div>

        <div className="sb-form-actions">
          <button type="submit" className="sb-btn-primary">
            {editingId ? 'Save Changes' : '+ Add'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="sb-btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="sb-toolbar">
        <h2 className="sb-section-title">Your Courses ({semester})</h2>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="sb-toggle-group">
            <button 
              type="button" 
              onClick={() => setViewMode('list')} 
              className={`sb-toggle-btn ${viewMode === 'list' ? 'active' : 'inactive'}`}
            >
              List
            </button>
            <button 
              type="button" 
              onClick={() => setViewMode('calendar')} 
              className={`sb-toggle-btn ${viewMode === 'calendar' ? 'active' : 'inactive'}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        organizedCourses.length === 0 ? (
          <EmptyCoursesPlaceholder />
        ) : (
          <div className="sb-list-container">
            {organizedCourses.map(course => {
              const displayDaysList = course.days ? course.days.join(', ') : course.day;
              const isPinned = pinnedCourseIds.includes(course.id);
              return (
                <div key={course.id} className={`sb-list-item ${isPinned ? 'pinned' : ''}`}>
                  <div className="sb-item-left">
                    <div>
                      <div className="sb-item-name-row">
                        {course.name}
                        {isPinned && <span className="sb-badge-pinned">Pinned</span>}
                      </div>
                      <div className="sb-item-details">{displayDaysList} | {course.start} - {course.end}</div>
                    </div>
                  </div>
                  <div>
                    <select 
                      defaultValue=""
                      onChange={(e) => handleActionChange(e, course)}
                      className="sb-input sb-select-action"
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
        <div className="sb-calendar-card">
          
          <div className="sb-calendar-days-header">
            <div></div> 
            {displayDays.map((day) => (
              <div key={day} className="sb-day-header-cell">{day}</div>
            ))}
          </div>

          <div className="sb-calendar-grid-body">
            
            <div className="sb-grid-horizontal-lines">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="sb-grid-row-line" />
              ))}
            </div>

            <div className="sb-grid-vertical-lines">
              {daysOfWeek.map((day, idx) => (
                <div key={day} className={`sb-grid-col-line ${idx === 6 ? 'last-day' : ''}`} />
              ))}
            </div>

            <div className="sb-timeline-column">
              <div></div> 
              {timeSlots.map(time => (
                <div key={time} className="sb-timeline-label">{time}</div>
              ))}
              <div></div> 
            </div>

            {daysOfWeek.map((day) => (
              <div key={day} className="sb-day-column">
                {organizedCourses.filter(c => c.days ? c.days.includes(day) : c.day === day).map(course => {
                  const { top, height } = calculatePosition(course.start, course.end);
                  const styleTheme = getCourseStyle(course.name);
                  const isPinned = pinnedCourseIds.includes(course.id);

                  return (
                    <div 
                      key={course.id} 
                      className={`sb-course-block ${isPinned ? 'pinned-block' : ''}`}
                      style={{ 
                        top: top,
                        height: height,
                        backgroundColor: styleTheme.bg,
                        border: `1px solid ${styleTheme.border}`
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
                      <div style={{ color: styleTheme.text }} className="sb-course-block-title-row">
                        <span className="sb-course-block-title-text">{course.name}</span>
                        {isPinned && <span className="sb-course-block-pinned-label">(Pinned)</span>}
                      </div>
                      <div style={{ color: styleTheme.text }} className="sb-course-block-time">
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