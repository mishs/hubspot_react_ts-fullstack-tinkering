import { Text } from "@/components/atoms";

interface EmptyStateProps {
  message: string;
  description?: string;
}

export const EmptyState = ({ message, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Text as="h3" size="lg" weight="semibold" className="mb-2">
        {message}
      </Text>
      {description && (
        <Text size="sm" color="muted">
          {description}
        </Text>
      )}
    </div>
  );
};
