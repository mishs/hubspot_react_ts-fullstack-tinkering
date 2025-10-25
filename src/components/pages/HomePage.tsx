import { useEffect } from "react";
import { SearchBar } from "@/components/molecules";
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
    selectedUser,
    isSidebarOpen,
    setUsers,
    setLoading,
    setError,
    setSearchQuery,
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
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name..."
        />
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
