import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className, hover = true, ...props }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "backdrop-blur-glass bg-card/10 border border-white/10 rounded-lg shadow-glass",
        hover && "hover:bg-card/20 hover:shadow-glow transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;