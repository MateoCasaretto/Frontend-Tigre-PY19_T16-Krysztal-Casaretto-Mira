// Tarjeta de contenido con título. Lo demás que reciba (por ejemplo, aria-live) va a la sección
const SectionCardComponent = ({ title, children, ...props }) => (
  <section className="twofa-card catalog-card" {...props}>
    <h2 className="catalog-step-title">{title}</h2>
    {children}
  </section>
)

export default SectionCardComponent
