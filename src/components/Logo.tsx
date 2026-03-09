import logoIcon from '@/assets/logo-icon.png';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { icon: 'h-7', text: 'text-base' },
  md: { icon: 'h-8 sm:h-9', text: 'text-lg sm:text-xl' },
  lg: { icon: 'h-14', text: 'text-3xl' }
};

const Logo = ({ className, iconOnly = false, size = 'md' }: LogoProps) => {
  const { icon, text } = sizeConfig[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img

        alt={iconOnly ? 'MᴀᴘMᴇ.Lɪᴠᴇ' : ''}
        className={cn('object-contain w-auto', icon)}
        fetchPriority="high"
        draggable={false} src="/lovable-uploads/30191504-f0fc-435f-a4d1-fc7535a1b086.png" />
      
      {!iconOnly &&
      <span className={cn('font-bold text-foreground tracking-tight select-none', text)}>
          MᴀᴘMᴇ.Lɪᴠᴇ
        </span>
      }
    </div>);

};

export default Logo;