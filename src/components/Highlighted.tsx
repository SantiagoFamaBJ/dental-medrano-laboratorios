/**
 * Renderiza texto plano donde los fragmentos envueltos en **doble asterisco**
 * se muestran resaltados en color marca (naranja). Se usa para permitir que
 * los textos editables desde el admin conserven el resaltado visual sin
 * necesitar un editor de texto enriquecido.
 *
 * Ejemplo: "Soluciones para el **presente** y el **futuro**"
 */
export default function Highlighted({ text }: { text: string }) {
  const partes = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {partes.map((parte, i) => {
        const match = parte.match(/^\*\*([^*]+)\*\*$/);
        if (match) {
          return (
            <span key={i} className="text-brand">
              {match[1]}
            </span>
          );
        }
        return <span key={i}>{parte}</span>;
      })}
    </>
  );
}
