import { forwardRef } from "react";
import { Button, Text } from "@/components/atoms";
import type { DirectoryLoadError } from "@/lib/api";

interface LoadErrorProps {
  error: DirectoryLoadError;
  failedAttempts: number;
  isRetrying: boolean;
  onRetry: () => void;
}

const reasons: Record<DirectoryLoadError["kind"], string> = {
  unavailable: "The directory service isn’t responding right now. This is usually temporary.",
  network: "The directory service couldn’t be reached. Check your connection.",
  "invalid-data": "The directory service sent data we couldn’t read.",
};

export const LoadError = forwardRef<HTMLButtonElement, LoadErrorProps>(
  ({ error, failedAttempts, isRetrying, onRetry }, retryRef) => (
    <div
      className="mb-6 flex flex-col gap-4 rounded-lg border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
      data-testid="load-error"
      data-failure={error.kind}
    >
      <div>
        <Text as="h2" size="lg" weight="semibold" className="text-red-900">
          {failedAttempts > 1
            ? "Still couldn’t load the directory"
            : "We couldn’t load the directory"}
        </Text>
        <Text size="sm" className="mt-1 text-red-800">
          {reasons[error.kind]}
          {error.status ? ` (error ${error.status})` : ""} Your search and sort settings are kept.
        </Text>
      </div>
      <Button
        ref={retryRef}
        onClick={isRetrying ? undefined : onRetry}
        aria-disabled={isRetrying}
        aria-busy={isRetrying}
        data-testid="load-retry"
        className={`min-h-11 shrink-0 ${isRetrying ? "cursor-wait opacity-70" : ""}`}
      >
        {isRetrying ? "Retrying…" : "Retry"}
      </Button>
    </div>
  )
);

LoadError.displayName = "LoadError";
