import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdminContext } from "@/lib/auth";
import { ARTICLE_HUBS, ARTICLE_SECTIONS } from "@/lib/articles";

function Ui({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-full bg-primary-light px-2.5 py-0.5 text-[0.9em] font-bold text-primary-dark">
      {children}
    </span>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-primary-light px-1.5 py-0.5 font-mono text-[0.88em] text-primary-dark">{children}</code>;
}

const STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Abrí la pestaña de artículos",
    body: (
      <>
        Arriba, debajo del título, tocá <Ui>Patrones y Aprende</Ui>. La pestaña <Ui>Productos</Ui> sigue siendo la de la
        tienda.
      </>
    ),
  },
  {
    title: "Elegí dónde va y creá uno nuevo",
    body: (
      <>
        En la columna de la izquierda elegí <Ui>Patrones</Ui> o <Ui>Aprende</Ui> y tocá <Ui>Nuevo artículo</Ui>.
      </>
    ),
  },
  {
    title: "Llená los datos",
    body: (
      <>
        Lo único obligatorio es el <strong className="text-foreground">título</strong>. Abajo está qué va en cada campo.
      </>
    ),
  },
  {
    title: "Agregá una foto de portada (opcional)",
    body: (
      <>
        Tocá <Ui>Subir foto de portada</Ui> y elegí la imagen. Es la foto que sale en la tarjeta del artículo.
      </>
    ),
  },
  {
    title: "Publicá y guardá",
    body: (
      <>
        Marcá la casilla <Ui>Publicar en la página</Ui> y tocá <Ui>Crear artículo</Ui>. Si no la marcás, queda guardado
        como <strong className="text-foreground">borrador</strong>: lo ves en el panel pero no en la página.
      </>
    ),
  },
  {
    title: "Revisá cómo quedó",
    body: (
      <>
        Con el artículo publicado aparece el botón <Ui>Ver en la página ↗</Ui>, que lo abre tal como lo ven tus clientas.
      </>
    ),
  },
];

const FIELDS: { name: string; desc: React.ReactNode }[] = [
  { name: "Página", desc: "Biblioteca de patrones o Aprende." },
  {
    name: "Sección",
    desc: "La subsección donde aparece (por ejemplo Tutoriales o Patrones gratuitos). Las opciones cambian según la página.",
  },
  { name: "Título", desc: "El nombre del artículo, como “Cómo hacer el anillo mágico”." },
  { name: "Slug", desc: "Dejalo vacío. Se arma solo con el título y forma la dirección del artículo." },
  {
    name: "Video",
    desc: "Link de YouTube, TikTok o Instagram. Si es de YouTube, el video se ve dentro del artículo; si es de otra red, aparece un botón “Ver el video”.",
  },
  {
    name: "Precio",
    desc: (
      <>
        Solo en patrones. Escribilo como querés que se lea, por ejemplo <Code>L 150</Code>. Si lo dejás vacío, el patrón
        aparece como <strong className="text-foreground">Gratis</strong>.
      </>
    ),
  },
  { name: "Orden", desc: "Un número. Los más bajos salen primero; si todos tienen 0, se ordenan solos." },
  { name: "Resumen", desc: "Una o dos frases que se leen en la tarjeta, antes de entrar al artículo." },
  { name: "Contenido", desc: "El texto completo: materiales, pasos, consejos. Mirá abajo cómo darle formato." },
];

const TIPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Patrones de pago",
    body: (
      <>
        En esos artículos aparece el botón <span className="font-bold text-[#1f9d55]">Pedir patrón</span>, que abre
        WhatsApp con un mensaje que ya trae el nombre del patrón. El patrón se lo mandás a la clienta por ahí.
      </>
    ),
  },
  {
    title: "Cambiar la portada",
    body: (
      <>
        Después de subir una foto nueva, tocá <Ui>Guardar cambios</Ui>; si no guardás, la foto no se aplica.
      </>
    ),
  },
  {
    title: "Editar",
    body: (
      <>
        Tocá el artículo en la lista de la izquierda, cambiá lo que necesités y tocá <Ui>Guardar cambios</Ui>.
      </>
    ),
  },
  {
    title: "Ocultar sin borrar",
    body: (
      <>
        Desmarcá <Ui>Publicar en la página</Ui> y guardá. Vuelve a ser borrador.
      </>
    ),
  },
  {
    title: "Eliminar",
    body: (
      <>
        Abrí el artículo y tocá <Ui>Eliminar artículo</Ui>. Se borra también su foto de portada y no se puede deshacer.
      </>
    ),
  },
];

const FORMAT_EXAMPLE = `El anillo mágico cierra el centro sin dejar agujero.

## Materiales
- Hilo de algodón
- Aguja de 3 mm

## Vuelta 1
6 puntos bajos dentro del anillo.
Tirá de la hebra para cerrar.`;

const cardClassName = "rounded-[2rem] border border-primary/20 bg-surface/85 p-6 shadow-xl shadow-primary/5 lg:p-8";

export default async function AdminGuidePage() {
  const context = await requireAdminContext();
  const name = context.profile.full_name?.split(" ")[0];

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeader active="guia" />

        <div className="mx-auto max-w-3xl space-y-6">
          <section className={cardClassName}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary-dark">Guía</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">Cómo publicar en Patrones y Aprende</h2>
            <p className="mt-3 leading-relaxed text-foreground-light">
              {name ? `${name}, con` : "Con"} esta guía podés subir patrones, tutoriales y consejos a la página. Lo que
              publiqués aparece en <strong className="text-foreground">Biblioteca de patrones</strong> y{" "}
              <strong className="text-foreground">Aprende</strong>; las secciones vacías siguen mostrando “Próximamente”.
            </p>
            <Link
              href="/admin/articulos"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-primary-dark hover:text-white"
            >
              Ir a Patrones y Aprende →
            </Link>
          </section>

          <section className={cardClassName}>
            <h3 className="font-display text-3xl text-foreground">Paso a paso</h3>
            <ol className="mt-6">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative pb-7 pl-13 last:pb-0">
                  <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary-dark font-bold text-white">
                    {index + 1}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span className="absolute bottom-1 left-[17px] top-10 border-l-2 border-dashed border-primary/30" />
                  ) : null}
                  <p className="font-bold text-foreground">{step.title}</p>
                  <p className="mt-1 leading-relaxed text-foreground-light">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={cardClassName}>
            <h3 className="font-display text-3xl text-foreground">Qué va en cada campo</h3>
            <dl className="mt-5 divide-y divide-primary/15 overflow-hidden rounded-3xl border border-primary/15 bg-background">
              {FIELDS.map((field) => (
                <div key={field.name} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
                  <dt className="font-bold text-foreground">{field.name}</dt>
                  <dd className="text-sm leading-relaxed text-foreground-light">{field.desc}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={cardClassName}>
            <h3 className="font-display text-3xl text-foreground">Dónde aparece cada cosa</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {ARTICLE_SECTIONS.map((section) => (
                <div key={section} className="rounded-3xl border border-primary/15 bg-background p-5">
                  <p className="font-bold text-foreground">{ARTICLE_HUBS[section].label}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground-light">
                    {ARTICLE_HUBS[section].categories.map((category) => (
                      <li key={category.id}>{category.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClassName}>
            <h3 className="font-display text-3xl text-foreground">Cómo darle formato al contenido</h3>
            <p className="mt-3 leading-relaxed text-foreground-light">
              Tres reglas: dejá una <strong className="text-foreground">línea en blanco</strong> entre párrafos, empezá un
              subtítulo con <Code>## </Code> y cada punto de una lista con <Code>- </Code> (guion y espacio).
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground-light">Lo que escribís</p>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-3xl border border-dashed border-primary-dark/50 bg-background p-4 font-mono text-sm leading-relaxed text-foreground">
                  {FORMAT_EXAMPLE}
                </pre>
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground-light">Cómo se ve en la página</p>
                <div className="space-y-3 rounded-3xl border border-primary/15 bg-background p-4 text-sm leading-relaxed text-foreground-light">
                  <p>El anillo mágico cierra el centro sin dejar agujero.</p>
                  <p className="font-display text-xl text-foreground">Materiales</p>
                  <ul className="space-y-1">
                    {["Hilo de algodón", "Aguja de 3 mm"].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-dark" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="font-display text-xl text-foreground">Vuelta 1</p>
                  <p>
                    6 puntos bajos dentro del anillo.
                    <br />
                    Tirá de la hebra para cerrar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={cardClassName}>
            <h3 className="font-display text-3xl text-foreground">Bueno saber</h3>
            <ul className="mt-5 space-y-3">
              {TIPS.map((tip) => (
                <li key={tip.title} className="leading-relaxed text-foreground-light">
                  <strong className="text-foreground">{tip.title}:</strong> {tip.body}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
