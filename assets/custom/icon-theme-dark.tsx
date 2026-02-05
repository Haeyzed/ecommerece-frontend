import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function IconThemeDark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-name='icon-theme-dark'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 79.86 51.14'
      className={cn(
        'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground',
        className
      )}
      {...props}
    >
      {/* Sidebar / Container Background (Darker opacity to represent dark theme) */}
      <rect
        x={0.53}
        y={0.5}
        width={78.83}
        height={50.14}
        rx={3.5}
        ry={3.5}
        opacity={0.25} 
        stroke='none'
      />

      {/* Content Area Background */}
      <path
        d='M22.88 0h52.97c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H22.88V0z'
        opacity={0.15}
        stroke='none'
      />

      {/* Sidebar: Avatar (Solid fill for dark theme emphasis) */}
      <circle cx={6.7} cy={7.04} r={3.54} opacity={0.8} stroke='none' />

      {/* Sidebar: Text Lines (Solid fill) */}
      <g stroke='none' opacity={0.6}>
        <path d='M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1z' />
        <path d='M16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1z' />
        <path d='M18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05z' />
        <path d='M15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91z' />
        <path d='M16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z' />
      </g>

      {/* Charts: Bar Chart */}
      <g stroke='none'>
        <rect x={33.36} y={19.73} width={2.75} height={3.42} rx={0.33} ry={0.33} opacity={0.4} />
        <rect x={29.64} y={16.57} width={2.75} height={6.58} rx={0.33} ry={0.33} opacity={0.5} />
        <rect x={37.16} y={14.44} width={2.75} height={8.7} rx={0.33} ry={0.33} opacity={0.6} />
        <rect x={41.19} y={10.75} width={2.75} height={12.4} rx={0.33} ry={0.33} opacity={0.7} />
      </g>

      {/* Charts: Pie Chart */}
      <g stroke='none' opacity={0.8}>
        <circle cx={62.74} cy={16.32} r={8} opacity={0.5} />
        <path
          d='M62.74 16.32l4.1-6.87c1.19.71 2.18 1.72 2.86 2.92s1.04 2.57 1.04 3.95h-8z'
          opacity={0.8}
        />
      </g>

      {/* Bottom Card Area */}
      <rect
        x={29.64}
        y={27.75}
        width={41.62}
        height={18.62}
        rx={1.69}
        ry={1.69}
        opacity={0.3}
        stroke='none'
      />
    </svg>
  )
}