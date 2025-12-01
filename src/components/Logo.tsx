interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className = '', width = 18, height = 18 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 49 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        fill="currentColor"
        xmlSpace="preserve"
        style={{ whiteSpace: 'pre' }}
        fontFamily="Nickainley"
        fontSize="96"
        letterSpacing="0em"
      >
        <tspan x="0.384003" y="72.8782">
          s
        </tspan>
      </text>
      <text
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        xmlSpace="preserve"
        style={{ whiteSpace: 'pre' }}
        fontFamily="Nickainley"
        fontSize="24"
        letterSpacing="0em"
      >
        <tspan x="21.384" y="18.994">
          O
        </tspan>
      </text>
    </svg>
  )
}
