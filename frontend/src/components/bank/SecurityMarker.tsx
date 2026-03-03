interface Props {
  badge?: string[] | null
}

export default function SecurityMarker({ badge }: Props) {
  if (!badge || badge.length === 0) return null

  return (
    <div className="mt-6 text-center">
      <div className="text-xs text-neutral-500 tracking-wide">
        Your Security Marker
      </div>
      <div className="mt-2 text-2xl">
        {badge.map((e, i) => (
          <span key={i} className="mx-1">{e}</span>
        ))}
      </div>
    </div>
  )
}
