export async function GET() {
  const res = await fetch("http://localhost:8080/api/tables")

  if (!res.ok) {
    return new Response("Failed to fetch tables", { status: 500 })
  }

  const data = await res.json()

  return Response.json(data)
}
