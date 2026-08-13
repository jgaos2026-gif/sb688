import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

const integrityChecks = [
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
] as const;

const integrityEvents = [
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
    detail: "VERA stored signed checkpoint for SB689 chain segment B.",
    time: "2026-08-13 03:41 UTC",
  },
  {
    id: "EVT-9398",
    severity: "critical",
    title: "Out-of-sequence ledger append blocked",
    detail: "Ledger write rejected before trusted state promotion.",
    time: "2026-08-13 03:30 UTC",
  },
] as const;

const records = [
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
] as const;

const chainOfCommand = [
  "JGA Enterprise",
  "SB688 Sovereign Stitch Spine",
  "STITCH Knowledge Link",
  "AVA Business Operator",
  "VERA Verification Gate",
  "Ledger + Checkpoint",
] as const;

function statusVariant(status: "pass" | "fail") {
  return status === "pass" ? "default" : "destructive";
}

function eventVariant(severity: "info" | "warning" | "critical") {
  if (severity === "critical") {
    return "destructive";
  }

  return severity === "warning" ? "secondary" : "outline";
}

export default function Home() {
  const passedChecks = integrityChecks.filter((check) => check.status === "pass").length;
  const totalChecks = integrityChecks.length;
  const integrityScore = Math.round((passedChecks / totalChecks) * 100);
  const healthLabel = integrityScore >= 90 ? "stable" : integrityScore >= 75 ? "watch" : "risk";

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <main className="container space-y-6">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Sovereign Stitch Integrity Board
          </p>
          <h1 className="mt-2 text-3xl font-semibold">SB688 Data Integrity Command Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Rule-driven integrity monitoring for autonomous business-in-a-box operations.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Overall integrity score</CardTitle>
              <CardDescription>Trusted state promotion readiness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold">{integrityScore}%</p>
                  <p className="text-xs text-muted-foreground">{passedChecks} of {totalChecks} checks passing</p>
                </div>
                <Badge variant={healthLabel === "risk" ? "destructive" : healthLabel === "watch" ? "secondary" : "default"}>
                  {healthLabel.toUpperCase()}
                </Badge>
              </div>
              <Progress value={integrityScore} aria-label="Overall data integrity score" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chain of command</CardTitle>
              <CardDescription>Disciplined brick/stitch component order</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                {chainOfCommand.map((node, index) => (
                  <li key={node} className="rounded-md border bg-muted/30 p-2">
                    <span className="mr-2 font-semibold text-muted-foreground">{index + 1}.</span>
                    {node}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Integrity checks</CardTitle>
              <CardDescription>Pass/fail indicators across validation gates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrityChecks.map((check) => (
                <div key={check.id} className="flex items-start justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.id} · {check.owner}</p>
                    <p className="text-xs text-muted-foreground">Checked {check.checkedAt}</p>
                  </div>
                  <Badge variant={statusVariant(check.status)} className="gap-1">
                    {check.status === "pass" ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                    {check.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent integrity events</CardTitle>
              <CardDescription>Violations and verification logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrityEvents.map((event) => (
                <div key={event.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-medium">{event.title}</p>
                    <Badge variant={eventVariant(event.severity)} className="gap-1 capitalize">
                      {event.severity === "critical" ? (
                        <XCircle className="size-3" />
                      ) : event.severity === "warning" ? (
                        <AlertTriangle className="size-3" />
                      ) : (
                        <ShieldCheck className="size-3" />
                      )}
                      {event.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.detail}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{event.id} · {event.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Structured records</CardTitle>
              <CardDescription>Organized files by business memory lane</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.file}>
                      <TableCell className="font-medium">{record.area}</TableCell>
                      <TableCell>{record.source}</TableCell>
                      <TableCell className="font-mono text-xs">{record.file}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === "current" ? "default" : "secondary"} className="uppercase">
                          {record.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
