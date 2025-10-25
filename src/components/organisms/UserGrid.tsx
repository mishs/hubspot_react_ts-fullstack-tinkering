import { EmptyState, UserCard, UserCardSkeleton } from "@/components/molecules";
import type { User } from "@/types";

interface UserGridProps {
  users: User[];
  isLoading: boolean;
  onUserClick?: (user: User) => void;
}

export const UserGrid = ({ users, isLoading, onUserClick }: UserGridProps) => {
  if (isLoading) {
    return (
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="status"
        aria-live="polite"
        aria-label="Loading users"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        message="No users found"
        description="Try adjusting your search criteria"
      />
    );
  }

  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label="User cards"
    >
      {users.map((user) => (
        <div key={user.id} role="listitem">
          <UserCard user={user} onClick={onUserClick} />
        </div>
      ))}
    </div>
  );
};
