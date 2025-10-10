
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("notes").select("*").order("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// export async function POST(req: Request) {
//   const { title } = await req.json();
//   if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

//   const supabase = await createClient();
//   const { error } = await supabase.from("notes").insert({ title });

//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ message: "Note created" });
// }

// export async function PUT(req: Request) {
//   const { id, title } = await req.json();
//   if (!id || !title) return NextResponse.json({ error: "ID and title required" }, { status: 400 });

//   const supabase = await createClient();
//   const { error } = await supabase.from("notes").update({ title }).eq("id", id);

//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ message: "Note updated" });
// }

// export async function DELETE(req: Request) {
//   const { id } = await req.json();
//   if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

//   const supabase = await createClient();
//   const { error } = await supabase.from("notes").delete().eq("id", id);

//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ message: "Note deleted" });
// }
