const QUESTION_PATTERN = /^(?:q|question|front|prompt)\s*[:\-]\s*(.+)$/i;
const ANSWER_PATTERN = /^(?:a|answer|back)\s*[:\-]\s*(.+)$/i;
const INLINE_QA_PATTERN =
  /^(?:q|question|front|prompt)\s*[:\-]\s*(.+?)\s+(?:a|answer|back)\s*[:\-]\s*(.+)$/i;
const DECK_HEADER_PATTERN = /^#\s*deck\s*:/i;
const NOTE_PAIR_PATTERN = /^([^:|#][^:|]{1,100})\s*:\s*(.+)$/;
const BULLET_PATTERN = /^[-*•]\s+(.+)$/;

function compactValue(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function buildQaLine(front: string, backParts: string[]): string {
  return `${compactValue(front)} | ${compactValue(backParts.join(' '))}`;
}

export function normalizeNotebookLmImportText(source: string): string {
  if (source.trim().length === 0) {
    return source;
  }

  const lines = source.split(/\r?\n/);
  const normalizedLines: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? '';
    const line = rawLine.trim();

    if (line.length === 0) {
      normalizedLines.push('');
      continue;
    }

    if (DECK_HEADER_PATTERN.test(line) || line.includes('|')) {
      normalizedLines.push(line);
      continue;
    }

    const inlineMatch = line.match(INLINE_QA_PATTERN);

    if (inlineMatch != null) {
      normalizedLines.push(buildQaLine(inlineMatch[1] ?? '', [inlineMatch[2] ?? '']));
      continue;
    }

    const questionMatch = line.match(QUESTION_PATTERN);

    if (questionMatch != null) {
      const backParts: string[] = [];
      let cursor = index + 1;

      while (cursor < lines.length) {
        const candidate = (lines[cursor] ?? '').trim();

        if (candidate.length === 0) {
          if (backParts.length > 0) {
            break;
          }

          cursor += 1;
          continue;
        }

        if (DECK_HEADER_PATTERN.test(candidate) || QUESTION_PATTERN.test(candidate)) {
          break;
        }

        const answerMatch = candidate.match(ANSWER_PATTERN);
        backParts.push(answerMatch?.[1] ?? candidate);
        cursor += 1;
      }

      if (backParts.length > 0) {
        normalizedLines.push(buildQaLine(questionMatch[1] ?? '', backParts));
        index = cursor - 1;
        continue;
      }
    }

    const noteMatch = line.match(NOTE_PAIR_PATTERN);

    if (noteMatch != null) {
      normalizedLines.push(`${compactValue(noteMatch[1] ?? '')} | ${compactValue(noteMatch[2] ?? '')}`);
      continue;
    }

    const bulletParts: string[] = [];
    let bulletCursor = index + 1;

    while (bulletCursor < lines.length) {
      const candidate = (lines[bulletCursor] ?? '').trim();
      const bulletMatch = candidate.match(BULLET_PATTERN);

      if (bulletMatch == null) {
        break;
      }

      bulletParts.push(bulletMatch[1] ?? '');
      bulletCursor += 1;
    }

    if (bulletParts.length > 0) {
      normalizedLines.push(buildQaLine(line, bulletParts));
      index = bulletCursor - 1;
      continue;
    }

    normalizedLines.push(line);
  }

  return normalizedLines.join('\n').replace(/\n{3,}/g, '\n\n');
}
