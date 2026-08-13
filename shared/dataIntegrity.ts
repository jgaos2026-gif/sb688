export type IntegrityCheck = {
  id: string;
  name: string;
  owner: string;
  status: "pass" | "fail";
  checkedAt: string;
};

export type IntegrityEvent = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  time: string;
};

export type IntegrityRecord = {
  area: string;
  source: string;
  file: string;
  status: "current" | "requires-review";
};

export type IntegrityDashboardData = {
  generatedAt: string;
  integrityChecks: IntegrityCheck[];
  integrityEvents: IntegrityEvent[];
  records: IntegrityRecord[];
  chainOfCommand: string[];
};

export const integrityDashboardData: IntegrityDashboardData = {
  generatedAt: "2026-08-13 04:20 UTC",
  integrityChecks: [
    {
      id: "VERA-101",
      name: "Clip Brick Policy Signature",
      owner: "VERA Gate",
      status: "pass",
      checkedAt: "2026-08-13 03:50 UTC",
    },
    {
      id: "VERA-203",
      name: "Ledger Hash Continuity",
      owner: "Ledger Service",
      status: "pass",
      checkedAt: "2026-08-13 03:48 UTC",
    },
    {
      id: "STITCH-309",
      name: "STITCH Session Handshake",
      owner: "STITCH Link",
      status: "fail",
      checkedAt: "2026-08-13 03:46 UTC",
    },
    {
      id: "AVA-412",
      name: "Access Pass TTL Validation",
      owner: "AVA Operator",
      status: "pass",
      checkedAt: "2026-08-13 03:44 UTC",
    },
  ],
  integrityEvents: [
    {
      id: "EVT-9402",
      severity: "warning",
      title: "Handshake retried after nonce mismatch",
      detail: "STITCH reissued a nonce and revalidated access pass metadata.",
      time: "2026-08-13 03:46 UTC",
    },
    {
      id: "EVT-9401",
      severity: "info",
      title: "Verification cycle checkpointed",
      detail: "VERA stored signed checkpoint for SB688 chain segment B.",
      time: "2026-08-13 03:41 UTC",
    },
    {
      id: "EVT-9398",
      severity: "critical",
      title: "Out-of-sequence ledger append blocked",
      detail: "Ledger write rejected before trusted state promotion.",
      time: "2026-08-13 03:30 UTC",
    },
  ],
  records: [
    {
      area: "Operations",
      source: "AVA Session Node",
      file: "records/operations/ava-session.log",
      status: "current",
    },
    {
      area: "Memory",
      source: "Customer Memory Chip",
      file: "records/memory/customer-chip-index.json",
      status: "current",
    },
    {
      area: "Verification",
      source: "VERA Gate",
      file: "records/verification/vera-checkpoint-ledger.csv",
      status: "requires-review",
    },
  ],
  chainOfCommand: [
    "JGA Enterprise",
    "SB688 Sovereign Stitch Spine",
    "STITCH Knowledge Link",
    "AVA Business Operator",
    "VERA Verification Gate",
    "Ledger + Checkpoint",
  ],
};
