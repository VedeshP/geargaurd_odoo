import type { EquipmentStatus } from '@/stores/equipment-store';

interface EquipmentStatusBadgeProps {
  status: EquipmentStatus
}

const statusConfig: Record<
  EquipmentStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  Active: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
    label: 'Active',
  },
  'In Maintenance': {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
    label: 'In Maintenance',
  },
  'Out of Service': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    label: 'Out of Service',
  },
  Retired: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    label: 'Retired',
  },
  'Lost/Damaged': {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    label: 'Lost/Damaged',
  },
}

export function EquipmentStatusBadge({ status }: EquipmentStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  )
}
