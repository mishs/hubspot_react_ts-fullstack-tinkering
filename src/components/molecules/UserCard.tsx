import { Avatar, Badge, Card, Text } from "@/components/atoms";
import type { User } from "@/types";

interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
  const handleClick = () => {
    onClick?.(user);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(user);
    }
  };

  return (
    <Card
      hover={!!onClick}
      className={onClick ? "cursor-pointer" : ""}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `View details for ${user.name}` : undefined}
    >
      <div className="flex items-start gap-4">
        <Avatar name={user.name} size="md" />
        <div className="min-w-0 flex-1">
          <Text as="h3" size="lg" weight="semibold" className="mb-1 truncate">
            {user.name}
          </Text>
          <Text size="sm" color="secondary" className="mb-1 truncate">
            {user.email}
          </Text>
          <Badge variant="primary">{user.company.name}</Badge>
        </div>
      </div>
    </Card>
  );
};
