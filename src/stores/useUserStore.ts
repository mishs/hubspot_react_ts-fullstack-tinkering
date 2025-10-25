import { create } from "zustand";
import type { User, SortConfig } from "@/types";

interface UserStore {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortConfig: SortConfig;
  selectedUser: User | null;
  isSidebarOpen: boolean;
  setUsers: (users: User[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setSelectedUser: (user: User | null) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  filterAndSortUsers: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  filteredUsers: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  sortConfig: { field: "name", order: "asc" },
  selectedUser: null,
  isSidebarOpen: false,

  setUsers: (users) => {
    set({ users });
    get().filterAndSortUsers();
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterAndSortUsers();
  },

  setSortConfig: (sortConfig) => {
    set({ sortConfig });
    get().filterAndSortUsers();
  },

  setSelectedUser: (selectedUser) =>
    set({ selectedUser, isSidebarOpen: selectedUser !== null }),

  setSidebarOpen: (isSidebarOpen) =>
    set({ isSidebarOpen, selectedUser: isSidebarOpen ? get().selectedUser : null }),

  filterAndSortUsers: () => {
    const { users, searchQuery, sortConfig } = get();

    let filtered = users;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = users.filter((user) => user.name.toLowerCase().includes(query));
    }

    const sorted = [...filtered].sort((a, b) => {
      const aValue =
        sortConfig.field === "company" ? a.company.name : a[sortConfig.field];
      const bValue =
        sortConfig.field === "company" ? b.company.name : b[sortConfig.field];

      const comparison = aValue.localeCompare(bValue);
      return sortConfig.order === "asc" ? comparison : -comparison;
    });

    set({ filteredUsers: sorted });
  },
}));
