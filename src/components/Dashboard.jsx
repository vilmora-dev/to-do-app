import React, { useState, useEffect } from 'react';
import ActivityColumn from './ActivityColumn';
import { Filter, Search, X } from 'lucide-react';

export default function Dashboard({ activities: initialActivities, onActivitiesUpdate }) {
  const [columns, setColumns] = useState(initialActivities);

  // Update local state when prop changes
  useEffect(() => {
    setColumns(initialActivities);
  }, [initialActivities]);

  // Notify parent of changes
  useEffect(() => {
    if (onActivitiesUpdate) {
      onActivitiesUpdate(columns);
    }
  }, [columns]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [filterBy, setFilterBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDrop = (activity, fromColumn, toColumn) => {
    if (fromColumn === toColumn) return;

    setColumns(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(a => a.id !== activity.id),
      [toColumn]: [...prev[toColumn], activity]
    }));
  };

  const handleDelete = (columnId, activityId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(a => a.id !== activityId)
    }));
  };

  const handleAdd = (columnId, activity) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: [...prev[columnId], activity]
    }));
  };

  const handleEdit = (columnId, updatedActivity) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: prev[columnId].map(a => 
        a.id === updatedActivity.id ? updatedActivity : a
      )
    }));
  };

  const handleReorder = (columnId, fromIndex, toIndex) => {
    setColumns(prev => {
      const newActivities = [...prev[columnId]];
      const [movedItem] = newActivities.splice(fromIndex, 1);
      newActivities.splice(toIndex, 0, movedItem);
      
      return {
        ...prev,
        [columnId]: newActivities
      };
    });
  };

  const formatDateForSearch = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      year: 'numeric'
    }).toLowerCase();
  };

  const sortActivities = (activities) => {
    let filtered = activities;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => {
        const titleMatch = activity.title.toLowerCase().includes(query);
        const assigneeMatch = activity.assignee.toLowerCase().includes(query);
        const priorityMatch = activity.priority.toLowerCase().includes(query);
        const startDateMatch = formatDateForSearch(activity.startDate).includes(query);
        const endDateMatch = formatDateForSearch(activity.endDate).includes(query);
        
        return titleMatch || assigneeMatch || priorityMatch || startDateMatch || endDateMatch;
      });
    }

    // Filter by assignee
    if (selectedAssignee) {
      filtered = filtered.filter(activity => activity.assignee === selectedAssignee);
    }

    // Then sort if filter is applied
    if (!filterBy) return filtered;

    const sorted = [...filtered].sort((a, b) => {
      if (filterBy === 'date') {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (filterBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    return sorted;
  };

  const getFilteredColumns = () => {
    return {
      todo: sortActivities(columns.todo),
      inProgress: sortActivities(columns.inProgress),
      review: sortActivities(columns.review),
      done: sortActivities(columns.done)
    };
  };

  // Get unique assignees from all columns
  const getAllAssignees = () => {
    const allActivities = [
      ...columns.todo,
      ...columns.inProgress,
      ...columns.review,
      ...columns.done
    ];
    const assignees = [...new Set(allActivities.map(activity => activity.assignee))];
    return assignees.sort();
  };

  const filteredColumns = getFilteredColumns();

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar - Fixed at top */}
      <div className="h-content bg-white shadow-md border-b border-gray-200 flex-shrink-0">
        <div className="px-3 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter size={20} />
            </div>
            
            <div className={`rounded-md border-gray-300 transition-all ${
                filterBy ? "border-dashed border bg-gray-50/50 flex gap-2 p-1" : ""
            }`}>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                onFocus={() => setFiltersOpen(true)}
                onBlur={() => setFiltersOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
              >
                <option value="">{filtersOpen ? "None" : "Filter"}</option>
                <option value="date">Date</option>
                <option value="priority">Priority</option>
              </select>

              {filterBy && (
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              )}
            </div>

            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              onFocus={() => setAssigneeOpen(true)}
              onBlur={() => setAssigneeOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
            >
              <option value="">{assigneeOpen ? "All" : "Assignee"}</option>
              {getAllAssignees().map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>

            {(filterBy || selectedAssignee || searchQuery) && (
              <button
                onClick={() => {
                  setFilterBy('');
                  setSelectedAssignee('');
                  setSortOrder('asc');
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all
              </button>
            )}

            {/* Search */}
            <div className="ml-auto flex items-center gap-2">
              <div className={`flex items-center transition-all duration-300 ${
                searchOpen ? 'w-64' : 'w-10'
              }`}>
                {searchOpen ? (
                  <div className="flex items-center w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search activities..."
                      className="flex-1 px-4 py-2 outline-none text-gray-700"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Search"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Kanban Board - Scrollable */}
      <div className="flex-1 overflow-auto px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActivityColumn
            title="To Do"
            activities={filteredColumns.todo}
            columnId="todo"
            onDrop={handleDrop}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onReorder={handleReorder}
            onDragStart={setDraggedId}
          />
          
          <ActivityColumn
            title="In Progress"
            activities={filteredColumns.inProgress}
            columnId="inProgress"
            onDrop={handleDrop}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onReorder={handleReorder}
            onDragStart={setDraggedId}
          />
          
          <ActivityColumn
            title="Review"
            activities={filteredColumns.review}
            columnId="review"
            onDrop={handleDrop}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onReorder={handleReorder}
            onDragStart={setDraggedId}
          />
          
          <ActivityColumn
            title="Done"
            activities={filteredColumns.done}
            columnId="done"
            onDrop={handleDrop}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onReorder={handleReorder}
            onDragStart={setDraggedId}
          />
        </div>
      </div>
    </div>
  );
}