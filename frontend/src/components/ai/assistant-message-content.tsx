import type { ReactNode } from "react";

type Table = { headers: string[]; rows: string[][] };

function tableCells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function inlineText(value: string): ReactNode[] {
  return value.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => (
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
      : <span key={index}>{part}</span>
  ));
}

function findTable(lines: string[], start: number): { table: Table; end: number } | null {
  if (!lines[start]?.includes("|") || !isTableSeparator(lines[start + 1] ?? "")) return null;

  const headers = tableCells(lines[start]);
  const rows: string[][] = [];
  let end = start + 2;
  while (end < lines.length && lines[end].includes("|")) {
    rows.push(tableCells(lines[end]));
    end += 1;
  }

  return { table: { headers, rows }, end };
}

export function AssistantMessageContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const elements: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const detectedTable = findTable(lines, index);
    if (detectedTable) {
      elements.push(
        <div key={`table-${index}`} className="my-3 overflow-x-auto rounded-xl border border-border-subtle dark:border-white/[.09]">
          <table className="w-full min-w-[360px] text-left text-sm">
            <thead className="bg-muted/75 text-muted-foreground dark:bg-white/[.05]">
              <tr>{detectedTable.table.headers.map((header, headerIndex) => <th key={`${header}-${headerIndex}`} className="px-3.5 py-2.5 font-medium">{inlineText(header)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-white/[.08]">
              {detectedTable.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-3.5 py-2.5 text-foreground">{inlineText(cell)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>,
      );
      index = detectedTable.end;
      continue;
    }

    if (/^#{1,3}\s+/.test(line)) {
      elements.push(<h3 key={`heading-${index}`} className="mt-4 text-[15px] font-semibold leading-6 text-foreground">{inlineText(line.replace(/^#{1,3}\s+/, ""))}</h3>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      elements.push(<ul key={`list-${index}`} className="my-2 list-disc space-y-1.5 pl-5 marker:text-muted-foreground">{items.map((item, itemIndex) => <li key={itemIndex}>{inlineText(item)}</li>)}</ul>);
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^#{1,3}\s+/.test(lines[index].trim()) && !/^[-*]\s+/.test(lines[index].trim()) && !findTable(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    elements.push(<p key={`paragraph-${index}`} className="mb-3 last:mb-0">{inlineText(paragraph.join(" "))}</p>);
  }

  return <>{elements}</>;
}
