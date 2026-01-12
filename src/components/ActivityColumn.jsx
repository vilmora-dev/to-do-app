import React, { useState } from 'react';
import { GripVertical, Plus, X, MoreVertical, Edit, Trash2 } from 'lucide-react';

export default function ActivityColumn({ title, activities, columnId, onDrop, onDelete, onAdd, onEdit, onDragStart, onReorder }) {
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Get current date and time in the format for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const [newActivity, setNewActivity] = useState({
    title: '',
    priority: 'medium',
    assignee: '',
    startDate: getCurrentDateTime(),
    endDate: getCurrentDateTime()
  });

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('activity');
    
    // If there's data, it's coming from another column
    if (data) {
      const parsedData = JSON.parse(data);
      onDrop(parsedData.activity, parsedData.fromColumn, columnId);
    }
    
    setDraggedIndex(null);
  };

  const handleDragStart = (e, activity, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('activity', JSON.stringify({
      activity,
      fromColumn: columnId
    }));
    onDragStart(activity.id);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.assignee || !newActivity.time) {
      alert('Please fill in title, assignee, and time');
      return;
    }

    const activity = {
      id: Date.now(),
      title: newActivity.title,
      priority: newActivity.priority,
      assignee: newActivity.assignee,
      time: newActivity.time,
      duration: newActivity.duration || undefined
    };

    if (editingActivity) {
      onEdit(columnId, { ...activity, id: editingActivity.id });
      setEditingActivity(null);
    } else {
      onAdd(columnId, activity);
    }
    
    setNewActivity({ title: '', priority: 'medium', assignee: '', time: getCurrentDateTime(), duration: '' });
    setShowModal(false);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      title: activity.title,
      priority: activity.priority,
      assignee: activity.assignee,
      time: activity.time,
      duration: activity.duration || ''
    });
    setShowModal(true);
    setOpenMenuId(null);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleString('en-US', options);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex-1 min-w-0 mb-1">
      <div className="bg-white rounded-xl shadow-lg p-4 h-screen flex flex-col max-h-[calc(100vh-13rem)]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            onClick={() => setShowModal(true)}
            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            title="Add activity"
          >
            <Plus size={18} />
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="space-y-2 flex-1 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-gray-200 overflow-y-auto"
        >
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              draggable
              onDragStart={(e) => handleDragStart(e, activity, index)}
              onDragOver={(e) => {
                e.preventDefault();
                // If dragging within the same column, handle reordering
                if (draggedIndex !== null && draggedIndex !== index) {
                  onReorder(columnId, draggedIndex, index);
                  setDraggedIndex(index);
                }
              }}
              onDragEnd={handleDragEnd}
              className={`bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 cursor-move border-2 border-transparent hover:border-indigo-300 transition-all ${
                draggedIndex === index ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="text-gray-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{activity.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    👤 {activity.assignee}
                  </div>
                  <div className="flex gap-3 text-xs text-gray-600">
                    <span>🕐 {formatDateTime(activity.time)}</span>
                    {activity.duration && <span>⏱️ {activity.duration}</span>}
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {openMenuId === activity.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(columnId, activity.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Drop activities here or add new ones
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingActivity ? 'Edit Activity' : `Add Activity to ${title}`}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingActivity(null);
                  setNewActivity({ title: '', priority: 'medium', assignee: '', time: getCurrentDateTime(), duration: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Create wireframes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newActivity.priority}
                  onChange={(e) => setNewActivity({ ...newActivity, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                <input
                  type="text"
                  value={newActivity.assignee}
                  onChange={(e) => setNewActivity({ ...newActivity, assignee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Sarah"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Optional)
                </label>
                <input
                  type="text"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 45 min"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingActivity(null);
                    setNewActivity({ title: '', priority: 'medium', assignee: '', time: '', duration: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingActivity ? 'Update Activity' : 'Add Activity'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}