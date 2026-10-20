import Link from "next/link";
import type { Metadata } from "next";
import { AdminPanel } from "../components/admin-panel";

export const metadata: Metadata = {
  title: "Управление каталогом",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden>/</span>
        <span>Админ-панель</span>
      </nav>

      <header className="page-head">
        <div>
          <span className="eyebrow">Служебный раздел</span>
          <h1 style={{ marginTop: 10, fontSize: "clamp(30px,4vw,54px)" }}>Каталог и заявки</h1>
        </div>
        <p className="page-head__aside">
          Правки цен и названий применяются сразу. Не забудьте сохранить строку — изменения
          записываются в data/products.json.
        </p>
      </header>

      <AdminPanel />
    </div>
  );
}
