import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Settings, FileText, MoveRight, Trash2, X } from 'lucide-react';

export default function MySpace({ allActivities, currentUser, onActivityMove, onActivityDelete }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('todo');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef(null);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format date for comparison (YYYY-MM-DD)
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Handle date picker change
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
    setShowDatePicker(false);
  };

  // Get activities for selected date
  const getActivitiesForDate = () => {
    const dateKey = formatDateKey(selectedDate);
    
    return Object.values(allActivities).flat().filter(activity => {
      const activityDate = formatDateKey(new Date(activity.startDate));
      return activityDate === dateKey && activity.assignee === currentUser;
    });
  };

  // Get user's activities by status
  const getUserActivitiesByStatus = (status) => {
    if (!allActivities[status]) return [];
    return allActivities[status].filter(activity => activity.assignee === currentUser);
  };

  // Find which column an activity is in
  const findActivityColumn = (activityId) => {
    for (const [column, activities] of Object.entries(allActivities)) {
      if (activities.find(a => a.id === activityId)) {
        return column;
      }
    }
    return null;
  };

  const handleMove = (activity, toColumn) => {
    const fromColumn = findActivityColumn(activity.id);
    if (fromColumn && fromColumn !== toColumn && onActivityMove) {
      onActivityMove(activity, fromColumn, toColumn);
    }
    setOpenMenuId(null);
    setShowMoveSubmenu(null);
  };

  const handleDelete = (activity) => {
    const column = findActivityColumn(activity.id);
    if (column && onActivityDelete) {
      onActivityDelete(column, activity.id);
    }
    setOpenMenuId(null);
  };

  const handleShowDocuments = (activity) => {
    setSelectedActivity(activity);
    setShowDocuments(true);
    setOpenMenuId(null);
  };

  const activitiesForDay = getActivitiesForDate();

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabActivities = {
    todo: getUserActivitiesByStatus('todo'),
    inProgress: getUserActivitiesByStatus('inProgress'),
    review: getUserActivitiesByStatus('review'),
    done: getUserActivitiesByStatus('done')
  };

  const tabConfig = [
    { id: 'todo', label: 'To Do', count: tabActivities.todo.length },
    { id: 'inProgress', label: 'In Progress', count: tabActivities.inProgress.length },
    { id: 'review', label: 'Review', count: tabActivities.review.length },
    { id: 'done', label: 'Done', count: tabActivities.done.length }
  ];

  const columnOptions = [
    { id: 'todo', label: 'To Do' },
    { id: 'inProgress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">My Space</h1>
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Agenda Container */}
        <div className="w-full lg:max-w-max lg:w-fit bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Agenda</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous day"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              
              <span className="text-lg font-semibold text-gray-700 min-w-[250px] text-center">
                {formatDate(selectedDate)}
              </span>
              
              <button
                onClick={goToNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next day"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Pick a date"
                >
                  <Calendar size={20} className="text-gray-600" />
                </button>

                {showDatePicker && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDatePicker(false)}
                    />
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20">
                      <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Activities for the day */}
          <div className="space-y-3">
            {activitiesForDay.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No activities scheduled for this day</p>
              </div>
            ) : (
              activitiesForDay.map(activity => (
                <div 
                  key={activity.id}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>🕐 {formatDateTime(activity.startDate)} - {formatDateTime(activity.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Activities Tabs Container */}
        <div className="w-full lg:max-w-max lg:w-fit bg-white rounded-xl shadow-lg p-6 overflow-visible">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Activities</h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabConfig.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {tabActivities[activeTab].length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No activities in this category</p>
              </div>
            ) : (
              tabActivities[activeTab].map(activity => (
                <div 
                  key={activity.id}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <span>📅 {formatDateTime(activity.startDate)}</span>
                        <span>🏁 {formatDateTime(activity.endDate)}</span>
                      </div>
                    </div>
                    
                    {/* Gear Icon Menu */}
                    <div className="relative z-50">
                      <button
                        ref={menuButtonRef}
                        onClick={(e) => {
                          if (openMenuId === activity.id) {
                            setOpenMenuId(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({
                              top: rect.bottom + 4,
                              right: window.innerWidth - rect.right
                            });
                            setOpenMenuId(activity.id);
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Settings size={18} />
                      </button>

                      {openMenuId === activity.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => {
                              setOpenMenuId(null);
                              setShowMoveSubmenu(null);
                            }}
                          />
                          <div 
                            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[160px]"
                            style={{
                              top: `${menuPosition.top}px`,
                              right: `${menuPosition.right}px`
                            }}
                          >
                            <button
                              onClick={() => handleShowDocuments(activity)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <FileText size={16} />
                              Documents
                            </button>
                            
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowMoveSubmenu(showMoveSubmenu === activity.id ? null : activity.id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <MoveRight size={16} />
                                Move
                              </button>

                              {showMoveSubmenu === activity.id && (
                                <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-50">
                                  {columnOptions.filter(col => col.id !== findActivityColumn(activity.id)).map(column => (
                                    <button
                                      key={column.id}
                                      onClick={() => handleMove(activity, column.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                    >
                                      {column.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleDelete(activity)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='mt-4 flex max-w-5xl mx-auto flex-col lg:flex-row gap-4'>
        {/* Documents Container */}
        {showDocuments && selectedActivity && (
          <div className="w-full bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Documents</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedActivity.title}</p>
              </div>
              <button
                onClick={() => {
                  setShowDocuments(false);
                  setSelectedActivity(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No documents available</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                Upload Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}