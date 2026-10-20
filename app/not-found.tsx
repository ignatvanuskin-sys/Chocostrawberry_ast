import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page container">
      <div className="success" style={{ maxWidth: 620 }}>
        <span className="eyebrow">Ошибка 404</span>
        <h1>Такой страницы нет</h1>
        <p className="lead">
          Возможно, товар больше не продаётся или ссылка устарела. Посмотрите каталог — там 24
          позиции, включая наборы клубники, сердца и финики в шоколаде.
        </p>
        <div className="success__actions">
          <Link href="/catalog" className="btn btn--primary">
            Перейти в каталог
          </Link>
          <Link href="/" className="btn btn--ghost">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
