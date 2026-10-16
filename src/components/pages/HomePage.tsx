import { useEffect, useRef, useState } from "react";
import { LoadError, SearchBar, SortControls } from "@/components/molecules";
import { Sidebar, UserGrid } from "@/components/organisms";
import { useUserStore } from "@/stores/useUserStore";
import { useDirectoryLoad } from "@/hooks/useDirectoryLoad";

export const HomePage = () => {
  const {
    users,
    filteredUsers,
    searchQuery,
    sortConfig,
    selectedUser,
    isSidebarOpen,
    setUsers,
    setSearchQuery,
    setSortConfig,
    setSelectedUser,
    setSidebarOpen,
  } = useUserStore();

  const { status, error, failedAttempts, retry } = useDirectoryLoad(setUsers);
  const isRetrying = status === "loading" && error !== null;
  const retryButton = useRef<HTMLButtonElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");
  const recovering = useRef(false);

  // After a successful retry, say so and move keyboard focus from the (now gone) Retry
  // button to the results, so keyboard users land where the records appeared.
  useEffect(() => {
    if (status === "error") recovering.current = true;
    if (status === "success" && recovering.current) {
      recovering.current = false;
      setAnnouncement(`Directory loaded: ${users.length} users.`);
      if (!document.activeElement || document.activeElement === document.body)
        results.current?.focus();
    }
  }, [status, users.length]);

  const onRetry = () => {
    setAnnouncement("");
    retry();
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name..."
        />
        <SortControls sortConfig={sortConfig} onSortChange={setSortConfig} />
      </div>

      {error && (status === "error" || isRetrying) && (
        <LoadError
          ref={retryButton}
          error={error}
          failedAttempts={failedAttempts}
          isRetrying={isRetrying}
          onRetry={onRetry}
        />
      )}

      <p className="sr-only" role="status" data-testid="load-announcement">
        {announcement}
      </p>

      <div ref={results} tabIndex={-1} className="outline-none" data-testid="directory-results">
        {status !== "error" && (
          <UserGrid
            users={filteredUsers}
            totalCount={users.length}
            searchQuery={searchQuery}
            isLoading={status === "loading"}
            onUserClick={setSelectedUser}
          />
        )}
      </div>

      <Sidebar user={selectedUser} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
