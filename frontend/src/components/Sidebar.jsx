import React from 'react'
import { Settings } from 'lucide-react'

function Sidebar() {
  return (
    <nav className="flex flex-col flex-shrink-0 bg-gray-800 w-16 z-20 border-r border-gray-700 pt-6 pb-6 items-center">
      <div className="mb-8"></div>
      <div className="mt-auto flex flex-col gap-6 w-full items-center">
        <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="w-full h-full opacity-90"
          />
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
