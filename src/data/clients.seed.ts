import type { Client } from "@/lib/clients"

/**
 * Start dates are relative to today so the dashboard ("new this month",
 * monthly chart) always has data, whenever the store is first seeded.
 */
function monthsAgo(months: number, day: number) {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth() - months, 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  // Keep this month's dates in the past or today.
  const maxDay = months === 0 ? now.getDate() : lastDay
  date.setDate(Math.min(day, maxDay))
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${mm}-${dd}`
}

export const clientsSeed: Client[] = [
  { id: "c-001", name: "Ava Lindqvist", company: "Northwind Analytics", email: "ava@northwind.example", status: "active", contractValue: 48000, startDate: monthsAgo(11, 4) },
  { id: "c-002", name: "Marcus Chen", company: "Bluefin Logistics", email: "marcus.chen@bluefin.example", status: "active", contractValue: 72000, startDate: monthsAgo(10, 12) },
  { id: "c-003", name: "Sofia Rossi", company: "Lumen Health", email: "s.rossi@lumenhealth.example", status: "churned", contractValue: 18000, startDate: monthsAgo(10, 21) },
  { id: "c-004", name: "James Okafor", company: "Kestrel Energy", email: "james@kestrel.example", status: "active", contractValue: 125000, startDate: monthsAgo(9, 3) },
  { id: "c-005", name: "Elin Berg", company: "Fjord Retail Group", email: "elin.berg@fjordretail.example", status: "paused", contractValue: 36000, startDate: monthsAgo(9, 17) },
  { id: "c-006", name: "Daniel Novak", company: "Orbit Fintech", email: "dnovak@orbitfin.example", status: "active", contractValue: 96000, startDate: monthsAgo(8, 8) },
  { id: "c-007", name: "Priya Raman", company: "Saffron Foods", email: "priya@saffronfoods.example", status: "active", contractValue: 24000, startDate: monthsAgo(8, 26) },
  { id: "c-008", name: "Lucas Moreau", company: "Atelier Moreau", email: "lucas@ateliermoreau.example", status: "churned", contractValue: 12000, startDate: monthsAgo(7, 2) },
  { id: "c-009", name: "Hannah Weber", company: "Brightpath Education", email: "h.weber@brightpath.example", status: "active", contractValue: 54000, startDate: monthsAgo(7, 15) },
  { id: "c-010", name: "Kenji Tanaka", company: "Sakura Robotics", email: "kenji@sakurarobotics.example", status: "active", contractValue: 150000, startDate: monthsAgo(6, 9) },
  { id: "c-011", name: "Olivia Grant", company: "Grant & Hale Legal", email: "ogrant@granthale.example", status: "paused", contractValue: 42000, startDate: monthsAgo(6, 23) },
  { id: "c-012", name: "Mateo Alvarez", company: "Sierra Outdoor Co.", email: "mateo@sierraoutdoor.example", status: "active", contractValue: 30000, startDate: monthsAgo(5, 5) },
  { id: "c-013", name: "Freja Nielsen", company: "Nordlys Media", email: "freja@nordlys.example", status: "active", contractValue: 66000, startDate: monthsAgo(5, 14) },
  { id: "c-014", name: "Samuel Adeyemi", company: "Harbor Insurance", email: "s.adeyemi@harborins.example", status: "churned", contractValue: 28000, startDate: monthsAgo(5, 27) },
  { id: "c-015", name: "Chloe Dubois", company: "Verde Architecture", email: "chloe@verdearch.example", status: "active", contractValue: 58000, startDate: monthsAgo(4, 7) },
  { id: "c-016", name: "Noah Fischer", company: "Alpine Cloud", email: "noah@alpinecloud.example", status: "active", contractValue: 110000, startDate: monthsAgo(4, 19) },
  { id: "c-017", name: "Isabella Costa", company: "Mar Azul Travel", email: "isabella@marazul.example", status: "paused", contractValue: 20000, startDate: monthsAgo(3, 6) },
  { id: "c-018", name: "Ethan Brooks", company: "Copperline Manufacturing", email: "ebrooks@copperline.example", status: "active", contractValue: 84000, startDate: monthsAgo(3, 13) },
  { id: "c-019", name: "Maja Kowalska", company: "Wisła Software", email: "maja@wisla.example", status: "active", contractValue: 46000, startDate: monthsAgo(3, 24) },
  { id: "c-020", name: "Liam O'Connor", company: "Emerald Biotech", email: "liam@emeraldbio.example", status: "active", contractValue: 132000, startDate: monthsAgo(2, 2) },
  { id: "c-021", name: "Yuki Sato", company: "Kumo Design Studio", email: "yuki@kumodesign.example", status: "churned", contractValue: 15000, startDate: monthsAgo(2, 18) },
  { id: "c-022", name: "Amara Diallo", company: "Baobab Ventures", email: "amara@baobab.example", status: "active", contractValue: 62000, startDate: monthsAgo(1, 10) },
  { id: "c-023", name: "Oscar Holm", company: "Skärgård Marine", email: "oscar@skargard.example", status: "paused", contractValue: 33000, startDate: monthsAgo(1, 22) },
  { id: "c-024", name: "Zara Patel", company: "Quartz Security", email: "zara@quartzsec.example", status: "active", contractValue: 78000, startDate: monthsAgo(0, 1) },
  { id: "c-025", name: "Felix Andersson", company: "Tidewater Studios", email: "felix@tidewater.example", status: "active", contractValue: 40000, startDate: monthsAgo(0, 3) },
]
