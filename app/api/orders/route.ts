import { NextResponse } from "next/server";
import { isAdmin, readOrders, updateOrder, type StoredOrder } from "../../lib/server-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Нет доступа" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, orders: readOrders() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Нет доступа" }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string; status?: StoredOrder["status"] };
  const allowed: StoredOrder["status"][] = ["new", "confirmed", "in_progress", "done", "cancelled"];

  if (!body.id || !body.status || !allowed.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Нужны id и корректный status" }, { status: 422 });
  }

  const order = updateOrder(body.id, { status: body.status });
  if (!order) return NextResponse.json({ ok: false, error: "Заявка не найдена" }, { status: 404 });

  return NextResponse.json({ ok: true, order });
}
