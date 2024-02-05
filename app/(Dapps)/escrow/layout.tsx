import { EscrowProvider } from "./utils/useEscrow";

export default function EscrowLayout({ children }: { children: React.ReactNode }) {
  return <EscrowProvider>{children}</EscrowProvider>;
}
