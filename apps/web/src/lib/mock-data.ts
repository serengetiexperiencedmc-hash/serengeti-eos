export type BadgeVariant = "urgent" | "progress" | "review" | "won" | "draft";

export type NavBadgeKey =
  | "pipeline"
  | "activeRfps"
  | "reconciliationExceptions"
  | "fieldSyncConflicts"
  | "notifications"
  | "aiDrafts";

export const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/commercial", label: "Dashboard", icon: "dashboard" },
      { href: "/commercial/ai", label: "AI Drafts", icon: "ai", badgeKey: "aiDrafts" as NavBadgeKey },
      { href: "/commercial/notifications", label: "Notifications", icon: "notifications", badgeKey: "notifications" as NavBadgeKey },
      { href: "/commercial/pipeline", label: "Pipeline", icon: "pipeline", badgeKey: "pipeline" as NavBadgeKey },
    ],
  },
  {
    section: "Commercial",
    items: [
      { href: "/commercial/rfps", label: "RFPs", icon: "rfp", badgeKey: "activeRfps" as NavBadgeKey },
      { href: "/commercial/programme", label: "Programme Builder", icon: "programme" },
      { href: "/commercial/proposals", label: "Proposals", icon: "proposals" },
      { href: "/commercial/bookings", label: "Bookings", icon: "bookings" },
    ],
  },
  {
    section: "Operations",
    items: [
      { href: "/commercial/operations", label: "Operations Workbench", icon: "field" },
      { href: "/commercial/events", label: "Event Infrastructure", icon: "events" },
      { href: "/field", label: "Field App", icon: "field" },
      { href: "/commercial/sync", label: "Sync Conflicts", icon: "sync", badgeKey: "fieldSyncConflicts" as NavBadgeKey },
    ],
  },
  {
    section: "Finance",
    items: [
      {
        href: "/commercial/finance",
        label: "Finance",
        icon: "finance",
        badgeKey: "reconciliationExceptions" as NavBadgeKey,
      },
    ],
  },
  {
    section: "Analytics",
    items: [{ href: "/commercial/analytics", label: "Analytics", icon: "analytics" }],
  },
  {
    section: "People",
    items: [{ href: "/commercial/hr", label: "HR", icon: "hr" }],
  },
  {
    section: "IT",
    items: [
      { href: "/commercial/itsm", label: "Service Desk", icon: "itsm" },
      { href: "/commercial/cmdb", label: "CMDB", icon: "cmdb" },
      { href: "/commercial/observability", label: "Observability", icon: "observability" },
    ],
  },
  {
    section: "Security",
    items: [
      { href: "/commercial/soc", label: "SOC", icon: "soc" },
      { href: "/commercial/pam", label: "PAM", icon: "pam" },
    ],
  },
  {
    section: "Risk",
    items: [{ href: "/commercial/erm", label: "Register", icon: "erm" }],
  },
  {
    section: "Compliance",
    items: [
      { href: "/commercial/compliance", label: "Obligations", icon: "compliance" },
      { href: "/commercial/controls", label: "Controls", icon: "controls" },
      { href: "/commercial/findings", label: "Findings", icon: "findings" },
    ],
  },
  {
    section: "Privacy",
    items: [
      { href: "/commercial/privacy", label: "RoPA", icon: "privacy" },
      { href: "/commercial/dsr", label: "DSR", icon: "privacy" },
    ],
  },
  {
    section: "Knowledge",
    items: [{ href: "/commercial/knowledge", label: "Documents", icon: "knowledge" }],
  },
  {
    section: "Audit",
    items: [{ href: "/commercial/audit-ia", label: "Engagements", icon: "audit" }],
  },
  {
    section: "BCM",
    items: [{ href: "/commercial/bcm", label: "Backup evidence", icon: "bcm" }],
  },
  {
    section: "Crisis",
    items: [{ href: "/commercial/crisis", label: "Declaration", icon: "crisis" }],
  },
  {
    section: "Resources",
    items: [
      { href: "/commercial/suppliers", label: "Supplier Library", icon: "suppliers" },
      { href: "/commercial/crm", label: "CRM", icon: "crm" },
    ],
  },
] as const;

export const dashboardStats = [
  { label: "Active RFPs", value: "4", delta: "↑ 2 new this week", trend: "up" as const },
  { label: "Pipeline Value", value: "$1.2M", delta: "↑ 18% vs last month", trend: "up" as const },
  { label: "Avg. Turnaround", value: "1.8d", delta: "↓ from 4.2 days (target: 2d)", trend: "up" as const },
  { label: "Win Rate (Q3)", value: "34%", delta: "→ stable", trend: "neutral" as const },
];

export const actionRfps = [
  {
    client: "Global Incentives Ltd",
    programme: "Tanzania Safari Incentive · 65 pax",
    stage: "review" as BadgeVariant,
    sla: "at-risk" as const,
    slaLabel: "6h left",
    value: "$285,000",
    href: "/commercial/rfps",
  },
  {
    client: "TechCorp Events",
    programme: "Leadership Retreat · Ngorongoro",
    stage: "progress" as BadgeVariant,
    sla: "on-track" as const,
    slaLabel: "2d left",
    value: "$142,000",
    href: "/commercial/programme",
  },
  {
    client: "European Pharma AG",
    programme: "Medical Conference · Arusha",
    stage: "urgent" as BadgeVariant,
    sla: "on-track" as const,
    slaLabel: "3d left",
    value: "$520,000",
    href: "/commercial/rfps",
  },
];

export const activities = [
  { icon: "✓", text: "Finance approved margin on Global Incentives proposal", time: "12 minutes ago · David Mwangi" },
  { icon: "📄", text: "Proposal sent to Summit Travel Group", time: "2 hours ago · You" },
  { icon: "🏨", text: "Rate updated for Seronera Safari Lodge (High Season 2026)", time: "Yesterday · Sales team" },
  { icon: "👁", text: "Client viewed proposal — Summit Travel Group", time: "Yesterday · Client portal" },
];

export const pipelineColumns = [
  {
    title: "New / Qualified",
    count: 3,
    cards: [
      { client: "European Pharma AG", programme: "Medical Conference · 200 pax · Arusha", value: "$520K", tag: "3d", tagType: "sla" as const },
      { client: "Asia Pacific Tours", programme: "Fam Trip · 12 pax · Northern Circuit", value: "$48K", tag: "Draft", tagType: "badge" as const },
    ],
  },
  {
    title: "RFP Received",
    count: 2,
    cards: [{ client: "TechCorp Events", programme: "Leadership Retreat · 35 pax", value: "$142K", tag: "Building", tagType: "badge" as const }],
  },
  {
    title: "Proposal Sent",
    count: 4,
    cards: [
      { client: "Summit Travel Group", programme: "Incentive Safari · 80 pax", value: "$380K", tag: "Viewed", tagType: "badge" as const },
      { client: "Luxury Brands Intl", programme: "Product Launch · Zanzibar", value: "$95K", tag: "Sent", tagType: "badge" as const },
    ],
  },
  {
    title: "Negotiation",
    count: 2,
    cards: [{ client: "Global Incentives Ltd", programme: "Safari Incentive · 65 pax", value: "$285K", tag: "Approval", tagType: "badge" as const }],
  },
  {
    title: "Won",
    count: 1,
    cards: [{ client: "Nordic Adventures", programme: "Photo Safari · 8 pax", value: "$62K", tag: "Confirmed", tagType: "badge" as const }],
  },
];

export const suppliers = [
  { name: "Seronera Safari Lodge", category: "Accommodation · Serengeti · ★ Preferred", rate: "From $320/night", rates: "3 rate cards" },
  { name: "Four Seasons Safari Lodge", category: "Accommodation · Serengeti", rate: "From $890/night", rates: "2 rate cards" },
  { name: "SEDMC Land Cruiser Fleet", category: "Vehicle Hire · Arusha · ★ Preferred", rate: "$280/day", rates: "12 vehicles" },
  { name: "Serengeti Balloon Safaris", category: "Excursion · Seronera", rate: "$599/pax", rates: "1 rate card" },
  { name: "Arusha AV Solutions", category: "AV & Entertainment · Arusha · ★ Preferred", rate: "From $800/day", rates: "4 rate cards" },
  { name: "Events Decor Kenya", category: "Décor · Nairobi", rate: "Rates pending", rates: "Pending Review", pending: true },
];

export const supplierFilters = ["All", "Accommodation", "Vehicle Hire", "Excursions", "AV & Entertainment", "Décor", "Preferred Partners"];

export const programmeSuppliers = [
  { name: "Seronera Safari Lodge", rate: "$450/night DBL" },
  { name: "Four Seasons Safari Lodge", rate: "$890/night DBL" },
  { name: "SEDMC Land Cruiser Fleet", rate: "$280/day" },
  { name: "Serengeti Balloon Safaris", rate: "$599/pax" },
  { name: "Arusha AV Solutions", rate: "$2,500/day PA" },
];

export const proposals = [
  { id: "PROP-2026-0312", title: "Safari Incentive Programme", client: "Global Incentives Ltd", version: "v3", status: "review" as BadgeVariant, sent: "—", viewed: "—", value: "$285,000" },
  { id: "PROP-2026-0298", title: "Incentive Safari · 80 pax", client: "Summit Travel Group", version: "v2", status: "progress" as BadgeVariant, sent: "20 Aug 2026", viewed: "21 Aug 2026 ✓", value: "$380,000" },
  { id: "PROP-2026-0285", title: "Leadership Retreat", client: "TechCorp Events", version: "v1", status: "draft" as BadgeVariant, sent: "—", viewed: "—", value: "$142,000" },
];

export const crmOrganizations = [
  { name: "Global Incentives Ltd", contacts: 3, type: "Incentive House", country: "United Kingdom", owner: "Amara Okello", status: "progress" as BadgeVariant, lastActivity: "Today" },
  { name: "Summit Travel Group", contacts: 5, type: "MICE Agency", country: "United States", owner: "James Kato", status: "progress" as BadgeVariant, lastActivity: "Yesterday" },
  { name: "European Pharma AG", contacts: 2, type: "Corporate", country: "Germany", owner: "Amara Okello", status: "urgent" as BadgeVariant, lastActivity: "19 Aug 2026" },
];
