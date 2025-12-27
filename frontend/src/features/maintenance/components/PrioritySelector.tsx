
interface PrioritySelectorProps {
  value: 'low' | 'medium' | 'high'
  onChange: (priority: 'low' | 'medium' | 'high') => void
}

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  const priorities = [
    { level: 'low' as const, diamonds: 1, color: 'fill-green-500' },
    { level: 'medium' as const, diamonds: 2, color: 'fill-yellow-500' },
    { level: 'high' as const, diamonds: 3, color: 'fill-red-500' },
  ]

  const currentPriority = priorities.find(p => p.level === value) || priorities[1]

  return (
    <div className="flex items-center gap-3">
      {priorities.map((priority) => (
        <button
          key={priority.level}
          type="button"
          onClick={() => onChange(priority.level)}
          className={`
            flex gap-1 p-2 rounded-lg transition-all cursor-pointer
            ${value === priority.level ? 'bg-slate-700 shadow-lg scale-110' : 'bg-slate-800 hover:bg-slate-700'}
          `}
          title={priority.level.charAt(0).toUpperCase() + priority.level.slice(1)}
        >
          {[...Array(3)].map((_, index) => (
            <svg
              key={index}
              width="16"
              height="20"
              viewBox="0 0 16 20"
              className={`
                transition-all
                ${value === priority.level && index < priority.diamonds
                  ? priority.color
                  : 'fill-slate-600'
                }
              `}
            >
              <polygon points="8,0 16,10 8,20 0,10" />
            </svg>
          ))}
        </button>
      ))}
    </div>
  )
}
