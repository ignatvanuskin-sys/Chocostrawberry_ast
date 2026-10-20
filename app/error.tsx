"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="page container">
      <div className="success" style={{ maxWidth: 620 }}>
        <span className="eyebrow">Что-то пошло не так</span>
        <h1>Не удалось открыть страницу</h1>
        <p className="lead">
          Попробуйте обновить страницу. Если ошибка повторяется — напишите нам, мы быстро
          поправим.
        </p>
        <div className="success__actions">
          <button type="button" className="btn btn--primary" onClick={reset}>
            Повторить
          </button>
          <Link href="/catalog" className="btn btn--ghost">
            В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
