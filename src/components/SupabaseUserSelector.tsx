import React from 'react'

interface SupabaseUserSelectorProps {
  users: any[]
  onUserSelect: (userId: string) => void
  selectedUser?: string
}

const SupabaseUserSelector: React.FC<SupabaseUserSelectorProps> = ({ 
  users, 
  onUserSelect, 
  selectedUser 
}) => {
  return (
    <div className="card-16bit mb-6">
      <h2 className="font-pixel text-neon-cyan mb-4 text-center">SELECCIONAR JUGADOR</h2>
      <div className="flex gap-4 justify-center">
        {users.map((user: any) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`btn-16bit-cyan px-6 py-3 ${
              selectedUser === user.id ? 'bg-neon-cyan text-retro-black' : ''
            }`}
          >
            <div className="text-center">
              <div className="font-pixel text-sm">{user.name.toUpperCase()}</div>
              <div className="font-mono text-xs mt-1">
                {user.avatar} {user.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SupabaseUserSelector