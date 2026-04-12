interface TagProps {
  label: string
  color?: string
  size?: 'sm' | 'md'
  variant?: 'default' | 'filled' | 'pill'
}

export default function Tag({ label, color, size = 'sm', variant = 'default' }: TagProps) {
  const sizes = {
    sm: 'text-[0.68rem] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  if (variant === 'filled' && color) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-md ${sizes[size]}`}
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
      >
        {label}
      </span>
    )
  }

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full tag ${sizes[size]}`}
        style={color ? { borderColor: `${color}25`, color: `${color}cc` } : {}}
      >
        {label}
      </span>
    )
  }

  return (
    <span className={`tag ${sizes[size]}`}>{label}</span>
  )
}
