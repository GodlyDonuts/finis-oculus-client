// components/NavFeatureCard.tsx

import Link from "next/link";

interface NavFeatureCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void; // For mobile menu closing
}

export function NavFeatureCard({
  href,
  icon: Icon,
  title,
  description,
  onClick,
}: NavFeatureCardProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group -m-3 flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-accent"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}