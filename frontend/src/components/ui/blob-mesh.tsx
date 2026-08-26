import { cn } from '@/lib/utils'

interface BlobMeshProps {
  className?: string
  variant?: 'warm' | 'cool' | 'deep'
  blend?: 'multiply' | 'normal' | 'screen'
}

const palette = {
  warm: ['bg-primary-400/60', 'bg-accent-300/50', 'bg-cream-200/80'],
  cool: ['bg-accent-300/30', 'bg-cream-100/50', 'bg-primary-500/25'],
  deep: ['bg-primary-500/25', 'bg-accent-500/20', 'bg-coffee-700/40'],
}

const blobClasses = [
  'animate-[blobDriftA_22s_ease-in-out_infinite]',
  'animate-[blobDriftB_26s_ease-in-out_infinite]',
  'animate-[blobDriftC_30s_ease-in-out_infinite]',
]

const blendClasses = {
  multiply: 'mix-blend-multiply',
  normal: '',
  screen: 'mix-blend-screen',
}

export default function BlobMesh({ className, variant = 'warm', blend = 'multiply' }: BlobMeshProps) {
  const colors = palette[variant]

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className={cn(
          'absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full blur-[110px]',
          blendClasses[blend],
          colors[0],
          blobClasses[0]
        )}
      />
      <div
        className={cn(
          'absolute top-1/3 -right-48 h-[32rem] w-[32rem] rounded-full blur-[120px]',
          blendClasses[blend],
          colors[1],
          blobClasses[1]
        )}
      />
      <div
        className={cn(
          'absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full blur-[130px]',
          blendClasses[blend],
          colors[2],
          blobClasses[2]
        )}
      />
    </div>
  )
}
