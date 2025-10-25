import { Text } from "@/components/atoms";

export const Header = () => {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Text as="h1" size="2xl" weight="bold">
          User Directory
        </Text>
        <Text size="sm" color="muted" className="mt-1">
          Browse and search through our user database
        </Text>
      </div>
    </header>
  );
};
