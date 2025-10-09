export async function GET() {
  return Response.json({ message: 'get' })
} 
export async function POST() {
  return Response.json({ message: 'Posted' })
}
export async function PUT() {
  return Response.json({ message: 'put' })
}
export async function DELETE() {
  return Response.json({ message: 'deleted' })
}

