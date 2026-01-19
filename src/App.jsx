import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import MySpace from './components/MySpace';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './auth/components/LoginPage';
import { RequireAuth } from './auth/components/RequireAuth';
import { useAuth } from './auth/context/AuthContext';

function MainLayout() {
  const [currentView, setCurrentView] = useState('home');
  const { user } = useAuth();
  const [activities, setActivities] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/activities');
      // const data = await response.json();
      // setActivities(data);

      // Mock data for now
      const mockActivities = {
        todo: [
          { id: 1, title: 'Create wireframes', priority: 'high', assignee: 'Sarah', startDate: '2026-01-12T09:00', endDate: '2026-01-12T11:00' },
          { id: 2, title: 'Team standup meeting', priority: 'medium', assignee: 'John', startDate: '2026-01-12T10:00', endDate: '2026-01-12T10:30' },
          { id: 6, title: 'Database schema design', priority: 'high', assignee: 'Mike', startDate: '2026-01-12T13:00', endDate: '2026-01-12T15:00' },
          { id: 7, title: 'API documentation', priority: 'low', assignee: 'Lisa', startDate: '2026-01-13T09:00', endDate: '2026-01-13T10:00' },
          { id: 8, title: 'User onboarding flow', priority: 'medium', assignee: 'Alex', startDate: '2026-01-12T16:00', endDate: '2026-01-12T17:00' },
        ],
        inProgress: [
          { id: 3, title: 'Build dashboard UI', priority: 'high', assignee: 'Alex', startDate: '2026-01-12T11:00', endDate: '2026-01-12T15:00' },
          { id: 9, title: 'Backend API endpoints', priority: 'high', assignee: 'John', startDate: '2026-01-12T12:00', endDate: '2026-01-13T12:00' },
          { id: 10, title: 'Mobile responsiveness', priority: 'medium', assignee: 'Sarah', startDate: '2026-01-12T14:00', endDate: '2026-01-12T18:00' },
          { id: 11, title: 'Unit tests for auth', priority: 'medium', assignee: 'Mike', startDate: '2026-01-12T15:00', endDate: '2026-01-12T16:30' },
        ],
        review: [
          { id: 4, title: 'Code review PR #234', priority: 'medium', assignee: 'Mike', startDate: '2026-01-12T14:00', endDate: '2026-01-12T14:30' },
          { id: 12, title: 'UI component library', priority: 'high', assignee: 'Lisa', startDate: '2026-01-11T16:00', endDate: '2026-01-12T09:00' },
          { id: 13, title: 'Database migrations', priority: 'low', assignee: 'John', startDate: '2026-01-12T09:30', endDate: '2026-01-12T10:00' },
          { id: 14, title: 'Performance optimization', priority: 'medium', assignee: 'Alex', startDate: '2026-01-12T13:30', endDate: '2026-01-12T14:30' },
        ],
        done: [
          { id: 5, title: 'Daily report', priority: 'low', assignee: 'Sarah', startDate: '2026-01-12T08:00', endDate: '2026-01-12T08:15' },
          { id: 15, title: 'Environment setup', priority: 'low', assignee: 'Mike', startDate: '2026-01-11T09:00', endDate: '2026-01-11T09:30' },
          { id: 16, title: 'Project kickoff meeting', priority: 'medium', assignee: 'John', startDate: '2026-01-11T14:00', endDate: '2026-01-11T15:00' },
          { id: 17, title: 'Initial requirements doc', priority: 'high', assignee: 'Sarah', startDate: '2026-01-11T10:00', endDate: '2026-01-11T12:00' },
          { id: 18, title: 'Bug fix #123', priority: 'high', assignee: 'Alex', startDate: '2026-01-12T08:30', endDate: '2026-01-12T09:00' },
          { id: 19, title: 'Deployment pipeline', priority: 'medium', assignee: 'Lisa', startDate: '2026-01-11T15:30', endDate: '2026-01-11T17:00' },
          { id: 20, title: 'Email templates', priority: 'low', assignee: 'Mike', startDate: '2026-01-12T07:30', endDate: '2026-01-12T08:00' },
          { id: 21, title: 'README update', priority: 'low', assignee: 'John', startDate: '2026-01-12T07:00', endDate: '2026-01-12T07:20' },
        ]
      };

      setActivities(mockActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  // Handler for when activities are updated in Dashboard
  const handleActivitiesUpdate = (updatedActivities) => {
    setActivities(updatedActivities);
  };

  // Handler for moving activities from MySpace
  const handleActivityMove = (activity, fromColumn, toColumn) => {
    setActivities(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(a => a.id !== activity.id),
      [toColumn]: [...prev[toColumn], activity]
    }));
  };

  // Handler for deleting activities from MySpace
  const handleActivityDelete = (columnId, activityId) => {
    setActivities(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(a => a.id !== activityId)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {currentView === 'home' && (
            <MySpace 
              allActivities={activities} 
              currentUser={user?.name || user?.email}
              onActivityMove={handleActivityMove}
              onActivityDelete={handleActivityDelete}
            />
          )}
          {currentView === 'board' && (
            <Dashboard 
              activities={activities} 
              onActivitiesUpdate={handleActivitiesUpdate}
            />
          )}
          {currentView === 'inbox' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Inbox</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;