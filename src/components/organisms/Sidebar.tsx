import { useEffect, useRef } from "react";
import { Avatar, Badge, Button, Skeleton, Text } from "@/components/atoms";
import { AIChat } from "@/components/molecules";
import { useAIBio } from "@/hooks/useAIBio";
import type { User } from "@/types";

interface SidebarProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ user, isOpen, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { bio, isLoading: bioLoading } = useAIBio(user);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!user) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 z-50 h-full w-full transform bg-white shadow-xl transition-transform sm:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-200 p-6">
            <Text id="sidebar-title" as="h2" size="xl" weight="semibold">
              User Details
            </Text>
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex flex-col items-center text-center">
              <Avatar name={user.name} size="lg" className="mb-4" />
              <Text as="h3" size="xl" weight="bold" className="mb-1">
                {user.name}
              </Text>
              <Text size="sm" color="muted" className="mb-3">
                @{user.username}
              </Text>
              <Badge variant="primary">{user.company.name}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <Text size="sm" weight="semibold" color="muted" className="mb-1">
                  Email
                </Text>
                <Text size="base">{user.email}</Text>
              </div>

              <div>
                <Text size="sm" weight="semibold" color="muted" className="mb-1">
                  Phone
                </Text>
                <Text size="base">{user.phone}</Text>
              </div>

              <div>
                <Text size="sm" weight="semibold" color="muted" className="mb-1">
                  Website
                </Text>
                <Text size="base">
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {user.website}
                  </a>
                </Text>
              </div>

              <div>
                <Text size="sm" weight="semibold" color="muted" className="mb-1">
                  Company
                </Text>
                <Text size="base" weight="medium">
                  {user.company.name}
                </Text>
                <Text size="sm" color="secondary">
                  {user.company.catchPhrase}
                </Text>
              </div>

              <div>
                <Text size="sm" weight="semibold" color="muted" className="mb-1">
                  Address
                </Text>
                <Text size="base">
                  {user.address.suite}, {user.address.street}
                </Text>
                <Text size="base">
                  {user.address.city}, {user.address.zipcode}
                </Text>
              </div>

              <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
                <Text size="sm" weight="semibold" color="muted" className="mb-2">
                  AI-Generated Professional Bio
                </Text>
                {bioLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : bio ? (
                  <Text size="sm" color="secondary">
                    {bio}
                  </Text>
                ) : (
                  <Text size="sm" color="muted">
                    Bio generation unavailable
                  </Text>
                )}
              </div>

              <AIChat user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
