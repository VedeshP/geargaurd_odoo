import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface WarrantyIndicatorProps {
  warrantyExpiry?: string
  size?: 'sm' | 'md'
}

export function WarrantyIndicator({ warrantyExpiry, size = 'sm' }: WarrantyIndicatorProps) {
  if (!warrantyExpiry) {
    return (
      <span className="text-xs text-slate-500">
        No warranty info
      </span>
    )
  }

  const expiryDate = new Date(warrantyExpiry)
  const today = new Date()
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const iconSize = size === 'sm' ? 14 : 16

  if (daysUntilExpiry < 0) {
    // Warranty expired
    return (
      <div className="flex items-center gap-1.5">
        <AlertCircle size={iconSize} className="text-red-400" />
        <span className="text-xs text-red-400">
          Expired {Math.abs(daysUntilExpiry)} days ago
        </span>
      </div>
    )
  } else if (daysUntilExpiry <= 30) {
    // Expiring soon
    return (
      <div className="flex items-center gap-1.5">
        <Clock size={iconSize} className="text-yellow-400" />
        <span className="text-xs text-yellow-400">
          Expires in {daysUntilExpiry} days
        </span>
      </div>
    )
  } else {
    // Valid warranty
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle size={iconSize} className="text-green-400" />
        <span className="text-xs text-green-400">
          Valid until {expiryDate.toLocaleDateString()}
        </span>
      </div>
    )
  }
}
