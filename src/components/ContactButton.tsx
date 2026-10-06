type ContactButtonProps = {
  href?: string
  label?: string
  className?: string
}

export function ContactButton({
  href = '#contact',
  label = 'Contact Me',
  className = '',
}: ContactButtonProps) {
  return (
    <a
      href={href}
      className={`about-contact-btn inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white no-underline transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.97] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
    >
      {label}
    </a>
  )
}
