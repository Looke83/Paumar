import fs from "node:fs";
import path from "node:path";

const DIRECTORY = "./src/components";

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".astro")) {
      let content = fs.readFileSync(fullPath, "utf-8");

      // Znajdź tagi <svg ...>, które nie mają jeszcze aria-hidden ani aria-label/labelledby
      const updated = content.replace(/<svg\b([^>]*?)>/gi, (match, attrs) => {
        if (/aria-(hidden|label|labelledby)/i.test(attrs)) {
          return match; // już ma atrybut a11y, pomijamy
        }
        return `<svg${attrs} aria-hidden="true">`;
      });

      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, "utf-8");
        console.log(`✓ Zaktualizowano: ${file}`);
      }
    }
  }
}

processDirectory(DIRECTORY);
console.log("Gotowe! Wszystkie dekoracyjne SVG otrzymały aria-hidden=\"true\".");