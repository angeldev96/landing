"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { deleteArticleAction, refreshAdminArticlesAction, saveArticleAction } from "@/app/admin/article-actions";
import { createClient } from "@/lib/supabase/client";
import { buildStoragePublicUrl, CROCHET_LANDING_BUCKET } from "@/lib/crochet-landing";
import {
  ARTICLE_HUBS,
  ARTICLE_SECTIONS,
  articleHref,
  findArticleCategory,
  type Article,
  type ArticleFormPayload,
  type ArticleSection,
} from "@/lib/articles";

const inputClassName =
  "w-full rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/50 focus:bg-white";

function emptyForm(section: ArticleSection): ArticleFormPayload {
  return {
    section,
    category: ARTICLE_HUBS[section].categories[0].id,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    coverPath: "",
    videoUrl: "",
    priceLabel: "",
    isPublished: false,
    sortOrder: 0,
  };
}

function articleToForm(article: Article): ArticleFormPayload {
  return {
    id: article.id,
    section: article.section,
    category: article.category,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    body: article.body ?? "",
    coverPath: article.coverPath ?? "",
    videoUrl: article.videoUrl ?? "",
    priceLabel: article.priceLabel ?? "",
    isPublished: article.isPublished,
    sortOrder: article.sortOrder,
  };
}

function normalizeFilename(filename: string) {
  return filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

export function AdminArticles({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [activeSection, setActiveSection] = useState<ArticleSection>("aprende");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleFormPayload>(() => emptyForm("aprende"));
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const selectedArticle = articles.find((article) => article.id === selectedId) ?? null;
  const sectionArticles = articles.filter((article) => article.section === activeSection);
  const formHub = ARTICLE_HUBS[form.section];

  function syncArticles(nextArticles: Article[], nextSelectedId: string | null) {
    setArticles(nextArticles);
    const nextSelected = nextArticles.find((article) => article.id === nextSelectedId) ?? null;
    setSelectedId(nextSelected?.id ?? null);
    setForm(nextSelected ? articleToForm(nextSelected) : emptyForm(activeSection));

    if (nextSelected) {
      setActiveSection(nextSelected.section);
    }
  }

  function runAsyncTask(task: () => Promise<void>) {
    setIsBusy(true);
    setMessage(null);

    startTransition(async () => {
      try {
        await task();
      } finally {
        setIsBusy(false);
      }
    });
  }

  function handleSelectSection(section: ArticleSection) {
    setActiveSection(section);
    setSelectedId(null);
    setForm(emptyForm(section));
    setMessage(null);
  }

  function handleSelectArticle(article: Article) {
    setSelectedId(article.id);
    setForm(articleToForm(article));
    setMessage(null);
  }

  function handleNewArticle() {
    setSelectedId(null);
    setForm(emptyForm(activeSection));
    setMessage(`Preparando un artículo nuevo para ${ARTICLE_HUBS[activeSection].label}.`);
  }

  function handleChangeSection(section: ArticleSection) {
    setForm((current) => ({
      ...current,
      section,
      category: ARTICLE_HUBS[section].categories[0].id,
      priceLabel: section === "patrones" ? current.priceLabel : "",
    }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      setMessage("El título es obligatorio.");
      return;
    }

    const previousCover = selectedArticle?.coverPath ?? null;

    runAsyncTask(async () => {
      const result = await saveArticleAction({
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        body: form.body.trim(),
        videoUrl: form.videoUrl.trim(),
        priceLabel: form.priceLabel.trim(),
      });

      if (result.error || !result.articles) {
        setMessage(result.error ?? "No pudimos guardar el artículo.");
        return;
      }

      if (previousCover && previousCover !== form.coverPath) {
        await createClient().storage.from(CROCHET_LANDING_BUCKET).remove([previousCover]);
      }

      syncArticles(result.articles, result.selectedId ?? null);
      setMessage(form.isPublished ? "Artículo guardado y publicado." : "Artículo guardado como borrador.");
    });
  }

  function handleDelete() {
    if (!selectedArticle) {
      return;
    }

    const confirmed = window.confirm(`Eliminar "${selectedArticle.title}"? Esta accion no se puede deshacer.`);
    if (!confirmed) {
      return;
    }

    runAsyncTask(async () => {
      const result = await deleteArticleAction(selectedArticle.id);

      if (result.error || !result.articles) {
        setMessage(result.error ?? "No pudimos eliminar el artículo.");
        return;
      }

      const unsavedCover = form.coverPath && form.coverPath !== result.coverPath ? form.coverPath : null;
      const pathsToRemove = [result.coverPath, unsavedCover].filter((path): path is string => Boolean(path));

      if (pathsToRemove.length) {
        await createClient().storage.from(CROCHET_LANDING_BUCKET).remove(pathsToRemove);
      }

      syncArticles(result.articles, null);
      setMessage("Artículo eliminado.");
    });
  }

  async function uploadCover(file: File) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Tu sesion expiro. Vuelve a iniciar sesion.");
      return;
    }

    const extension = file.name.split(".").pop() ?? "jpg";
    const safeFileName = normalizeFilename(file.name.replace(/\.[^.]+$/, ""));
    const storagePath = `${user.id}/articles/${crypto.randomUUID()}-${safeFileName}.${extension}`;

    const { error } = await supabase.storage.from(CROCHET_LANDING_BUCKET).upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    // A cover uploaded earlier in this edit and never saved is replaced, so drop it.
    if (form.coverPath && form.coverPath !== selectedArticle?.coverPath) {
      await supabase.storage.from(CROCHET_LANDING_BUCKET).remove([form.coverPath]);
    }

    setForm((current) => ({ ...current, coverPath: storagePath }));
    setMessage("Portada lista. Guarda el artículo para aplicarla.");
  }

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    runAsyncTask(async () => {
      await uploadCover(file);
    });
  }

  function handleRefresh() {
    runAsyncTask(async () => {
      const result = await refreshAdminArticlesAction();

      if (result.error || !result.articles) {
        setMessage(result.error ?? "No pudimos refrescar los artículos.");
        return;
      }

      syncArticles(result.articles, selectedId);
      setMessage("Datos actualizados.");
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-primary/20 bg-surface/80 p-5 shadow-xl shadow-primary/5 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2 rounded-full border border-primary/15 bg-background p-1">
          {ARTICLE_SECTIONS.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => handleSelectSection(section)}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                activeSection === section ? "bg-primary text-foreground" : "text-foreground-light hover:text-foreground"
              }`}
            >
              {section === "patrones" ? "Patrones" : "Aprende"}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleNewArticle}
            className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
          >
            Nuevo artículo
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-full border border-primary/30 px-4 py-3 text-sm font-bold text-foreground transition hover:bg-primary/10"
          >
            Refrescar
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {sectionArticles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-primary/30 bg-background p-5 text-sm text-foreground-light">
              Aun no hay artículos en {ARTICLE_HUBS[activeSection].label}. Mientras tanto la página muestra
              &quot;Próximamente&quot;.
            </div>
          ) : (
            sectionArticles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => handleSelectArticle(article)}
                className={`w-full rounded-[1.6rem] border p-3 text-left transition ${
                  selectedId === article.id
                    ? "border-primary/50 bg-primary-light/70 shadow-lg shadow-primary/10"
                    : "border-primary/15 bg-background/80 hover:border-primary/35 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-primary/15">
                    {article.coverPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={buildStoragePublicUrl(article.coverPath)}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{article.title}</p>
                    <p className="mt-1 truncate text-xs text-foreground-light">
                      {findArticleCategory(article.section, article.category)?.title ?? article.category}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-dark">
                      {article.isPublished ? "Publicado" : "Borrador"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-primary/20 bg-surface/85 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-dark">Editor de artículos</p>
              <h3 className="font-display text-3xl text-foreground">
                {selectedArticle ? `Editar ${selectedArticle.title}` : "Crear artículo"}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/guia"
                className="rounded-full px-3 py-2 text-sm font-bold text-primary-dark transition hover:bg-primary/10"
              >
                ¿Cómo funciona? Ver guía
              </Link>
              {selectedArticle?.isPublished ? (
                <a
                  href={articleHref(selectedArticle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-bold text-foreground transition hover:bg-primary/10"
                >
                  Ver en la página ↗
                </a>
              ) : null}
              <div className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-foreground-light">
                {isBusy ? "Guardando cambios..." : "Listo para trabajar"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Página</span>
              <select
                value={form.section}
                onChange={(event) => handleChangeSection(event.target.value as ArticleSection)}
                className={inputClassName}
              >
                {ARTICLE_SECTIONS.map((section) => (
                  <option key={section} value={section}>
                    {ARTICLE_HUBS[section].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Sección</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className={inputClassName}
              >
                {formHub.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Título</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className={inputClassName}
                placeholder="Ej. Cómo hacer el anillo mágico"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className={inputClassName}
                placeholder="Opcional. Se autogenera desde el título."
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Video (opcional)</span>
              <input
                value={form.videoUrl}
                onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))}
                className={inputClassName}
                placeholder="Link de YouTube, TikTok o Instagram"
              />
            </label>
            {form.section === "patrones" ? (
              <label className="space-y-2">
                <span className="text-sm font-bold text-foreground">Precio (opcional)</span>
                <input
                  value={form.priceLabel}
                  onChange={(event) => setForm((current) => ({ ...current, priceLabel: event.target.value }))}
                  className={inputClassName}
                  placeholder="Ej. L 150. Vacío = gratis"
                />
              </label>
            ) : null}
            <label className="space-y-2">
              <span className="text-sm font-bold text-foreground">Orden</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sortOrder: Number.parseInt(event.target.value || "0", 10) }))
                }
                className={inputClassName}
              />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-foreground">Resumen</span>
            <textarea
              value={form.excerpt}
              onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
              className="min-h-20 w-full rounded-3xl border border-primary/20 bg-background px-4 py-4 text-sm outline-none transition focus:border-primary/50 focus:bg-white"
              placeholder="Una o dos frases que aparecen en la tarjeta del artículo."
            />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-foreground">Contenido</span>
            <textarea
              value={form.body}
              onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
              className="min-h-72 w-full rounded-3xl border border-primary/20 bg-background px-4 py-4 font-mono text-sm leading-relaxed outline-none transition focus:border-primary/50 focus:bg-white"
              placeholder={"Escribe el paso a paso.\n\n## Materiales\n- Hilo de algodón\n- Aguja de 3 mm\n\n## Vuelta 1\n6 puntos bajos en anillo mágico."}
            />
            <span className="block text-xs text-foreground-light">
              Deja una línea en blanco entre párrafos. Usa &quot;## &quot; al inicio para un subtítulo y &quot;- &quot; para
              listas.
            </span>
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem] border border-primary/15 bg-primary/10">
              {form.coverPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={buildStoragePublicUrl(form.coverPath)} alt="Portada" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Sin portada
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-3">
              <label className="flex cursor-pointer items-center justify-center rounded-[1.6rem] border border-dashed border-primary/40 bg-background px-6 py-6 text-center text-sm text-foreground-light transition hover:bg-primary/5">
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" disabled={isBusy} />
                {form.coverPath ? "Cambiar foto de portada" : "Subir foto de portada (opcional)"}
              </label>
              {form.coverPath ? (
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, coverPath: "" }))}
                  className="w-fit rounded-full border border-primary/25 px-4 py-2 text-xs font-bold text-foreground-light transition hover:bg-primary/10"
                >
                  Quitar portada
                </button>
              ) : null}
            </div>
          </div>

          <label className="mt-4 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background px-4 py-3 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
              className="h-4 w-4 accent-primary-dark"
            />
            Publicar en la página
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white disabled:opacity-60"
              disabled={isBusy}
            >
              {selectedArticle ? "Guardar cambios" : "Crear artículo"}
            </button>
            {selectedArticle ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-300 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                disabled={isBusy}
              >
                Eliminar artículo
              </button>
            ) : null}
          </div>
        </div>

        {message ? (
          <div className="rounded-[1.4rem] border border-primary/20 bg-primary-light/60 px-5 py-4 text-sm font-semibold text-foreground">
            {message}
          </div>
        ) : null}
      </section>
    </div>
  );
}
