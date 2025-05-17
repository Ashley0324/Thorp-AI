import { NextResponse } from "next/server"

export async function GET() {
  const apiUrl = process.env.FASTGPT_API_URL
  const apiKey = process.env.FASTGPT_API_KEY

  if (!apiUrl || !apiKey) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }

  return NextResponse.json({ configured: true })
}
