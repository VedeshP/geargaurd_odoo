interface StagePipelineProps {
  currentStage: 'new' | 'in-progress' | 'repaired' | 'scrap'
  onStageChange: (stage: 'new' | 'in-progress' | 'repaired' | 'scrap') => void
}

const stages = [
  { id: 'new', label: 'New Request' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'repaired', label: 'Repaired' },
  { id: 'scrap', label: 'Scrap' },
] as const

export function StagePipeline({ currentStage, onStageChange }: StagePipelineProps) {
  const currentIndex = stages.findIndex(s => s.id === currentStage)

  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-slate-800/50 rounded-lg">
      {stages.map((stage, index) => {
        const isActive = stage.id === currentStage
        const isCompleted = index < currentIndex
        const isFuture = index > currentIndex

        return (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => onStageChange(stage.id)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer
                ${isActive ? 'bg-blue-600 text-white shadow-lg' : ''}
                ${isCompleted ? 'bg-green-600/20 text-green-400' : ''}
                ${isFuture ? 'bg-slate-700 text-slate-400' : ''}
                ${!isActive && !isFuture ? 'hover:bg-green-600/30' : ''}
                ${isFuture ? 'hover:bg-slate-600' : ''}
              `}
            >
              {stage.label}
            </button>
            {index < stages.length - 1 && (
              <div className="mx-2 text-slate-600">→</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
