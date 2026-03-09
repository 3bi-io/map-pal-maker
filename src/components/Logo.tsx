import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';
import { useTheme } from '@/hooks/useTheme';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = 'h-10' }: LogoProps) => {
  const { theme } = useTheme();
  const src = theme === 'light' ? logoLight : logoDark;

  return (
    <img
      src={src}
      alt="MᴀᴘMᴇ.Lɪᴠᴇ"
      className={className}
      draggable={false}
    />
  );
};

export default Logo;
