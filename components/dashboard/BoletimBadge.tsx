import { Badge } from "@/components/ui/Badge";
import type { BoletimStatus } from "@/lib/mock-data";

export function BoletimBadge({ status }: { status: BoletimStatus }) {
  if (status === "enviado") {
    return <Badge tone="success">✓ Enviado</Badge>;
  }
  if (status === "pendente") {
    return <Badge tone="warning">⚠ Pendente</Badge>;
  }
  return <Badge tone="danger">✗ Atrasado</Badge>;
}
