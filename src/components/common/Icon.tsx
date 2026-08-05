import {
  Activity,
  Eye,
  Headset,
  Lock,
  MessageSquare,
  Settings,
  Shield,
  ShieldCheck,
  TrendingUp,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/data/landing';

/**
 * Маппинг «имя иконки из data → компонент lucide».
 * В data-файлах хранится только строка, чтобы контент не зависел от библиотеки.
 */
const icons: Record<IconName, LucideIcon> = {
  activity: Activity,
  headset: Headset,
  settings: Settings,
  shield: Shield,
  shieldCheck: ShieldCheck,
  user: User,
  users: Users,
  trendingUp: TrendingUp,
  messageSquare: MessageSquare,
  userPlus: UserPlus,
  lock: Lock,
  eye: Eye,
};

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, className, strokeWidth = 2 }: IconProps) {
  const Component = icons[name];
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
