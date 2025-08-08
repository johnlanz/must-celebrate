// utils/names.ts
type NameParts = { first_name: string | null; last_name: string | null };

export function deriveFirstLast(
  meta: Record<string, any>,
  email?: string | null
): NameParts {
  // Prefer Google’s explicit fields
  const gFirst = meta?.given_name || meta?.first_name;
  const gLast  = meta?.family_name || meta?.last_name;
  if (gFirst || gLast) {
    return {
      first_name: (gFirst ?? null) || null,
      last_name:  (gLast ?? null)  || null,
    };
  }

  // Fall back to full/display name
  const full =
    meta?.full_name ||
    meta?.name ||
    (email ? email.split('@')[0] : '') ||
    '';

  return splitFullName(full);
}

function splitFullName(full: string): NameParts {
  const clean = full.trim().replace(/\s+/g, ' ');
  if (!clean) return { first_name: null, last_name: null };

  // strip common honorifics + suffixes
  const honorifics = /^(mr|mrs|ms|miss|mx|dr|engr|sir|madam|prof|rev|fr)\.?\s+/i;
  const suffixes = /(,?\s+(jr|sr|ii|iii|iv|phd|md|dmd))$/i;
  const core = clean.replace(honorifics, '').replace(suffixes, '').trim();

  const parts = core.split(' ');
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: '' };
  }

  // Handle common surname particles (e.g., "de la Cruz", "van der Meer")
  const particles = new Set([
    'da','das','de','del','dela','de-la','de-las','de-los','di','du','la','le',
    'van','von','von-der','van-der','der','den','bin','ibn','al','el','mac','mc'
  ]);

  // Walk from the end and attach particles to the last name
  let i = parts.length - 1;
  let lastParts = [parts[i]];
  i--;
  while (i >= 0 && particles.has(parts[i].toLowerCase())) {
    lastParts.unshift(parts[i]);
    i--;
  }

  const last_name = lastParts.join(' ');
  const first_name = parts.slice(0, i + 1).join(' ') || null;

  return { first_name, last_name };
}
