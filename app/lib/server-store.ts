import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS = path.join(DATA_DIR, "orders.json");

export type StoredOrder = {
  id: string;
  createdAt: string;
  type: "order" | "custom";
  status: "new" | "confirmed" | "in_progress" | "done" | "cancelled";
  customer: Record<string, unknown>;
  items?: Array<Record<string, unknown>>;
  total?: number;
  custom?: Record<string, unknown>;
  notified: boolean;
};

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readOrders(): StoredOrder[] {
  try {
    if (!fs.existsSync(ORDERS)) return [];
    return JSON.parse(fs.readFileSync(ORDERS, "utf8")) as StoredOrder[];
  } catch {
    return [];
  }
}

export function appendOrder(order: StoredOrder) {
  ensureDir();
  const orders = readOrders();
  orders.unshift(order);
  fs.writeFileSync(ORDERS, JSON.stringify(orders, null, 2), "utf8");
}

export function updateOrder(id: string, patch: Partial<StoredOrder>): StoredOrder | null {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...patch };
  ensureDir();
  fs.writeFileSync(ORDERS, JSON.stringify(orders, null, 2), "utf8");
  return orders[index];
}

export function makeOrderId(prefix = "CS") {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

/**
 * Уведомление владельца в Telegram.
 * Токен и chat_id читаются только из переменных окружения — в клиент не попадают.
 */
export async function notifyTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function isAdmin(request: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return request.headers.get("x-admin-token") === token;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
