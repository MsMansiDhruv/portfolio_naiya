type LiveProjectButtonProps = {
  href?: string
  label?: string
  className?: string
}

export function LiveProjectButton({
  href = '#',
  label = 'Live Project',
  className = '',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] px-5 py-2.5 text-[10px] font-medium uppercase tracking-widest text-[#D7E2EA] no-underline transition-colors duration-200 hover:bg-[#D7E2EA]/10 active:scale-[0.97] sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      {label}
    </a>
  )
}
