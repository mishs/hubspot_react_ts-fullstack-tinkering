import { useState, useEffect } from "react";
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
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const bio = `${user.name} is a ${getRandomRole()} at ${user.company.name}, where they focus on ${user.company.catchPhrase.toLowerCase()}. With expertise in ${getRandomSkill()}, they bring innovative solutions to ${getRandomIndustry()} challenges.`;

        setBio(bio);
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

function getRandomRole(): string {
  const roles = [
    "Senior Software Engineer",
    "Product Manager",
    "UX Designer",
    "Data Scientist",
    "Engineering Manager",
    "Technical Lead",
  ];
  return roles[Math.floor(Math.random() * roles.length)];
}

function getRandomSkill(): string {
  const skills = [
    "full-stack development",
    "cloud architecture",
    "data analytics",
    "user experience design",
    "agile methodologies",
    "technical leadership",
  ];
  return skills[Math.floor(Math.random() * skills.length)];
}

function getRandomIndustry(): string {
  const industries = [
    "enterprise",
    "consumer",
    "B2B",
    "fintech",
    "healthcare",
    "e-commerce",
  ];
  return industries[Math.floor(Math.random() * industries.length)];
}
