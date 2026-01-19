import React, { useState } from 'react';

export default function MySpace({ allActivities, currentUser }) {
  const [activeTab, setActiveTab] = useState('todo');

  // Get user's activities by status
  const getUserActivitiesByStatus = (status) => {
    if (!allActivities[status]) return [];
    return allActivities[status].filter(activity => activity.assignee === currentUser);
  };

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">My Space</h1>

      {/* My Activities Tabs Container */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Activities</h2>

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
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}