import { useState, useEffect } from "react";
import { generateUserBio } from "@/lib/gemini";
import type { User } from "@/types";

interface UseAIBioResult {
  bio: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAIBio = (user: User | null): UseAIBioResult => {
  const [bio, setBio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBio(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const generateBio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const generatedBio = await generateUserBio(user);
        setBio(generatedBio);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate bio");
        setBio(null);
      } finally {
        setIsLoading(false);
      }
    };

    generateBio();
  }, [user]);

  return { bio, isLoading, error };
};
