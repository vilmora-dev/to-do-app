import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="App flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {currentView === 'home' && <Dashboard />}
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
  )
}

export default App