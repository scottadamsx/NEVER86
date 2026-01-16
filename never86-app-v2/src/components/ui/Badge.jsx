const variants = {
  default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  outline: 'text-foreground',
  success: 'border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  warning: 'border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

function Badge({ className = '', variant = 'default', children, ...props }) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold
        transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
