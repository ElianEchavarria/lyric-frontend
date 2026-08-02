// lib/lyrics/parse.ts
import type { SyncedLine } from "@/types";

export function parseLrc(synced: string): SyncedLine[] {
    const lines: SyncedLine[] = [];
    for (const raw of synced.split("\n")) {
        // 1. match a timestamped line. Groups: 1=min, 2=sec, 3=centiseconds, 4=text
        const match = raw.match(/^\[(\d+):(\d+)\.(\d+)\](.*)$/);

        // 2. no match → metadata ([ar:...], [ti:...]) or a blank line → skip
        if (!match) continue;

        // 3. convert the timestamp to ms and push { time, text }
        const minutes = Number(match[1]);
        const seconds = Number(match[2]);
        const centiseconds = Number(match[3]); // hundredths of a second

        // centiseconds ×10 to reach ms (lrclib uses 2-digit fractions)
        const time = minutes * 60000 + seconds * 1000 + centiseconds * 10;

        lines.push({ time, text: match[4].trim() });
    }
    return lines;
}