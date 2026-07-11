import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"

const LUFT_PAYTV_STAFF = [
  { first: "Micheal", middle: "Isaac", last: "Adekunle", position: "Video Editor", empId: "EIB6926" },
  { first: "Nefisat", middle: "Ojimaojo", last: "Mohammed", position: "HR Officer", empId: "EIN9516" },
  { first: "Numve", middle: "Terwase", last: "Richard", position: "Video Editor", empId: "EIB5787" },
  { first: "Michael", middle: "Roland", last: "okwumbu", position: "Video Editor", empId: "EIB1202" },
  { first: "John", middle: "Oloruntoba", last: "Kutus", position: "Video Editor", empId: "EIB4986" },
  { first: "Chris", middle: "Anayo", last: "Ugwu", position: "Video Editor", empId: "EIB5689" },
  { first: "Daniel", middle: "Ogbeche", last: "Elaigwu", position: "Graphic Designers", empId: "EIB1684" },
  { first: "Francis", middle: "Tiah", last: "Obi", position: "Graphic Designers", empId: "EIB1658" },
  { first: "Gabriel", middle: "Ileanaju", last: "Okpetu", position: "Video Editor", empId: "EIB2268" },
  { first: "Udeagwu", middle: "Judith", last: "Ugomma", position: "Supervisor CSR Owerri", empId: "EIB8125" },
  { first: "Barnabas", middle: "", last: "Geofrey", position: "Teamlead CSR JOS", empId: "EIB7699" },
  { first: "Aisha", middle: "Abdullahi", last: "Muhammad", position: "CSR KANO", empId: "EIB3653" },
  { first: "Blessing", middle: "", last: "Julius", position: "Media and Coorperate comm", empId: "EIB2785" },
  { first: "Joseph", middle: "", last: "Enoch", position: "Media and Coorperate comm", empId: "EIB2334" },
  { first: "Ehiemere", middle: "Samuel", last: "Emeka", position: "PGA", empId: "EIB2653" },
  { first: "Goodnews", middle: "Emmanuel", last: "Joseph", position: "PGA", empId: "EIB1309" },
  { first: "kefas", middle: "wando", last: "Rita", position: "PGA", empId: "LUFT/PAYTV/EMP/SN3/072" },
  { first: "Yacit", middle: "Sunday", last: "Lipdo", position: "PGA", empId: "LUFT/PAYTV/EMP/SN3/052" },
  { first: "Haruna", middle: "Jovial", last: "Jonathan", position: "PGA", empId: "EIB6975" },
  { first: "Christopher", middle: "Chikezie", last: "Nwosu", position: "Warehouse Officer", empId: "EIB6616" },
  { first: "Prestige", middle: "", last: "Maduka", position: "Sales Point", empId: "EIB6114" },
  { first: "Lydia", middle: "Anave", last: "Ohikere", position: "Social Media manager", empId: "EIB9277" },
  { first: "Emmanuel", middle: "Eme", last: "Uduma", position: "PGA", empId: "EIB4547" },
  { first: "CHINWE", middle: "", last: "CHINECHEREM", position: "PGA", empId: "" },
  { first: "Amedu", middle: "Aboshoke", last: "Pricillia", position: "Sales Point", empId: "Luf/paytv/Emp/SN3/045" },
  { first: "Godspower", middle: "Yinka", last: "Ibitayo", position: "Sales Point", empId: "EIB5709" },
  { first: "OGECHUKWU", middle: "PETER", last: "ALAEBO", position: "PGA", empId: "EIB8723" },
  { first: "SHARON", middle: "CHIDINMA", last: "OGUJIOFOR", position: "PGA", empId: "LUFT/PAYTV/EMP/SN3/084" },
  { first: "ELIZABETH", middle: "OGOMUEGBUNAM", last: "NWAFOR", position: "CSR LAGOS", empId: "EIB8660" },
  { first: "Terkula", middle: "", last: "Orngu", position: "Security officer", empId: "EIB1673" },
  { first: "Joshua", middle: "Nathaniel", last: "Ehat", position: "Security officer", empId: "EIB3888" },
  { first: "Abraham", middle: "", last: "Aigbose", position: "Security officer", empId: "EIB1409" },
  { first: "Luka", middle: "Wisdom", last: "Tatumari", position: "Security officer", empId: "EIB4058" },
  { first: "Blessing", middle: "Zangata", last: "Aruwa", position: "Security officer", empId: "EIB7818" },
  { first: "Treasure", middle: "Mercy", last: "Chicha", position: "Marketing and Commercials", empId: "EIB2864" },
  { first: "Fidelis", middle: "", last: "Zakka", position: "Driver", empId: "EIB2096" },
  { first: "Sylvester", middle: "Ngala", last: "Madaki", position: "Security officer", empId: "EIB8450" },
  { first: "Joy", middle: "", last: "Adamu", position: "Security officer", empId: "EIB7818" },
  { first: "Inalegwu", middle: "", last: "Ajeibi", position: "Security officer", empId: "EIB8790" },
  { first: "Awuha", middle: "Alex", last: "Swen", position: "Security officer", empId: "EIB8865" },
  { first: "Shuaibu", middle: "", last: "Muhammed", position: "Driver", empId: "EIB8242" },
  { first: "Aliyu", middle: "Huzaifa", last: "Adamu", position: "Security officer", empId: "EIB4913" },
  { first: "Godwin", middle: "Uwhalogho", last: "Isodge", position: "PGA", empId: "EIB5268" },
  { first: "Osheku", middle: "Godwin", last: "Idowu", position: "Maintenance", empId: "EIB8353" },
  { first: "Segun", middle: "Omokhgbor", last: "Joseph", position: "Maintenance", empId: "EIB2543" },
  { first: "Akunne", middle: "Austin", last: "Uzim", position: "PGA", empId: "EIB3152" }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("secret") !== "eib-fix-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const mode = searchParams.get("mode") || "analyze" // "analyze" or "execute"
  const allUsers = await db.select().from(user)

  // Build lookup maps by name
  const nameMap = new Map<string, typeof allUsers[0]>()
  for (const u of allUsers) {
    if (u.name) {
      nameMap.set(u.name.toLowerCase().trim(), u)
      // Also map Last First and First Last
      const parts = u.name.split(" ")
      if (parts.length > 1) {
        nameMap.set(`${parts[0]} ${parts[parts.length - 1]}`.toLowerCase().trim(), u)
        nameMap.set(`${parts[parts.length - 1]} ${parts[0]}`.toLowerCase().trim(), u)
      }
    }
  }

  const results: {
    alreadyExists: { name: string; officialEmail: string; currentSubsidiary: string | null }[]
    toCreate: { name: string; generatedEmail: string }[]
  } = { alreadyExists: [], toCreate: [] }

  for (const staff of LUFT_PAYTV_STAFF) {
    const fullName = [staff.first, staff.middle, staff.last].filter(Boolean).join(" ").trim()
    const firstLast = `${staff.first} ${staff.last}`.trim()
    const lastFirst = `${staff.last} ${staff.first}`.trim()
    
    // Check by name variations
    let existingUser = nameMap.get(fullName.toLowerCase()) 
      || nameMap.get(firstLast.toLowerCase()) 
      || nameMap.get(lastFirst.toLowerCase())

    if (existingUser) {
      results.alreadyExists.push({
        name: fullName,
        officialEmail: existingUser.email,
        currentSubsidiary: existingUser.subsidiary,
      })
      continue
    }

    // Generate an official email for new users
    const cleanFirst = staff.first.toLowerCase().replace(/[^a-z]/g, '')
    const cleanLast = staff.last.toLowerCase().replace(/[^a-z]/g, '')
    const generatedEmail = `${cleanFirst}.${cleanLast}@luftpaytv.com`

    results.toCreate.push({ name: fullName, generatedEmail })
  }

  if (mode === "execute") {
    const created: string[] = []
    const transferred: string[] = []
    const defaultPassword = "EIBGroup@2026"

    for (const entry of results.toCreate) {
      try {
        await auth.api.signUpEmail({
          body: {
            email: entry.generatedEmail,
            password: defaultPassword,
            name: entry.name,
          },
        })
        const rows = await db.select().from(user).where(eq(user.email, entry.generatedEmail))
        if (rows.length > 0) {
          await db.update(user).set({ subsidiary: "Luft Pay TV" }).where(eq(user.id, rows[0].id))
        }
        created.push(entry.generatedEmail)
      } catch (e: any) {
        created.push(`FAILED: ${entry.generatedEmail} — ${e.message}`)
      }
    }

    for (const existing of results.alreadyExists) {
      if (existing.currentSubsidiary !== "Luft Pay TV") {
        const rows = await db.select().from(user).where(eq(user.email, existing.officialEmail))
        if (rows.length > 0) {
          await db.update(user).set({ subsidiary: "Luft Pay TV" }).where(eq(user.id, rows[0].id))
          transferred.push(`${existing.name} (${existing.officialEmail}) moved from ${existing.currentSubsidiary} to Luft Pay TV`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      created,
      transferred,
      analysis: results,
    })
  }

  return NextResponse.json({
    mode: "analyze",
    summary: {
      totalStaff: LUFT_PAYTV_STAFF.length,
      alreadyExist: results.alreadyExists.length,
      toCreate: results.toCreate.length,
    },
    details: results,
  })
}
