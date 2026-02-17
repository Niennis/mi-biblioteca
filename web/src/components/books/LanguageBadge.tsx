import { Badge } from "../ui/Badge";

export function LanguageBadge({ isSpanish }: { isSpanish: boolean }) {
  if (isSpanish) return null;
  return <Badge color="yellow">Info no disponible en español</Badge>;
}
