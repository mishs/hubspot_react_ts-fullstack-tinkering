import { useEffect } from "react";
import { SearchBar, SortControls } from "@/components/molecules";
import { Sidebar, UserGrid } from "@/components/organisms";
import { useUserStore } from "@/stores/useUserStore";
import { fetchUsers } from "@/lib/api";
import { Text } from "@/components/atoms";

export const HomePage = () => {
  const {
    filteredUsers,
    isLoading,
    error,
    searchQuery,
    sortConfig,
    selectedUser,
    isSidebarOpen,
    setUsers,
    setLoading,
    setError,
    setSearchQuery,
    setSortConfig,
    setSelectedUser,
    setSidebarOpen,
  } = useUserStore();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await fetchUsers();
        setUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [setUsers, setLoading, setError]);

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

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
          <Text size="sm" className="text-red-800">
            {error}
          </Text>
        </div>
      )}

      <UserGrid users={filteredUsers} isLoading={isLoading} onUserClick={setSelectedUser} />

      <Sidebar user={selectedUser} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
