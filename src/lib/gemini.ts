import type { User } from "@/types";

export async function generateUserBio(user: User): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const roles = ["Senior Software Engineer", "Product Manager", "Technical Lead", "Solutions Architect", "Engineering Manager", "Principal Engineer"];
  const skills = ["driving innovation", "leading cross-functional teams", "architecting scalable solutions", "delivering enterprise solutions", "spearheading digital transformation"];

  const role = roles[Math.abs(hashCode(user.name)) % roles.length];
  const skill = skills[Math.abs(hashCode(user.email)) % skills.length];

  return `${user.name} is a ${role} at ${user.company.name}, based in ${user.address.city}. With a focus on ${user.company.catchPhrase.toLowerCase()}, ${user.name.split(' ')[0]} excels in ${skill} and bringing strategic value to complex business challenges.`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

export async function chatWithAI(user: User, question: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerQ = question.toLowerCase();

  if (lowerQ.includes("company") || lowerQ.includes("work")) {
    return `${user.name} works at ${user.company.name}. Their company focuses on ${user.company.catchPhrase.toLowerCase()}.`;
  }

  if (lowerQ.includes("location") || lowerQ.includes("where") || lowerQ.includes("live") || lowerQ.includes("located")) {
    return `${user.name} is based in ${user.address.city}, ${user.address.zipcode}. Their full address is ${user.address.suite}, ${user.address.street}, ${user.address.city}.`;
  }

  if (lowerQ.includes("email") || lowerQ.includes("contact")) {
    return `You can reach ${user.name} at ${user.email}${user.phone ? ` or by phone at ${user.phone}` : ""}.`;
  }

  if (lowerQ.includes("phone") || lowerQ.includes("number")) {
    return `${user.name}'s phone number is ${user.phone}.`;
  }

  if (lowerQ.includes("website") || lowerQ.includes("site")) {
    return `${user.name}'s website is ${user.website}.`;
  }

  if (lowerQ.includes("username") || lowerQ.includes("handle")) {
    return `Their username is @${user.username}.`;
  }

  if (lowerQ.includes("mission") || lowerQ.includes("focus") || lowerQ.includes("do")) {
    return `${user.company.name}'s mission is to ${user.company.catchPhrase.toLowerCase()}. ${user.name} plays a key role in driving this vision forward.`;
  }

  return `Based on the available information about ${user.name}, I can tell you about their company (${user.company.name}), location (${user.address.city}), contact details, or website. What would you like to know?`;
}
