import type { EstadoSemaforo } from '@/shared/types/domain'

const colors: Record<EstadoSemaforo, { bg: string; label: string }> = {
  rojo: { bg: 'bg-red-500', label: 'Sin atención' },
  amarillo: { bg: 'bg-yellow-400', label: 'Atención parcial' },
  verde: { bg: 'bg-green-500', label: 'Atención completa' },
}

interface TrafficLightProps {
  estado: EstadoSemaforo
  showLabel?: boolean
}

export function TrafficLight({ estado, showLabel = true }: TrafficLightProps) {
  const { bg, label } = colors[estado]
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-3 h-3 rounded-full ${bg}`} title={label} />
      {showLabel && <span className="text-xs text-gray-600">{label}</span>}
    </div>
  )
}
