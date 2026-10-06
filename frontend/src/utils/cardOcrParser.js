import { createWorker } from 'tesseract.js';

/**
 * Clean OCR line of stray symbols, brackets, and prefixes.
 */
function cleanOcrLine(str = '') {
  return str
    .replace(/[\[\]{}()\\\/<>&*_+=~^|£@®©•*#;:!$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent parser to extract structured contact details, company name,
 * and designations from OCR text recognized from a visiting card.
 */
export function parseVisitingCardText(rawText = '') {
  if (!rawText) return {};

  // Strip obvious UI strings from modal screenshots if user uploaded a screenshot
  const cleanedRaw = rawText
    .replace(/Converted Template Live Preview/gi, '')
    .replace(/Converted Editable Design/gi, '')
    .replace(/Original Uploaded Card/gi, '')
    .replace(/Live editable design matching the card and sketch as customers will see it/gi, '')
    .replace(/Raw card artwork uploaded/gi, '');

  const rawLines = cleanedRaw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 1);

  // 1. Phone Numbers (matches Indian / international formats: 10 digits, +91, with spaces/dashes)
  const phoneRegex = /(?:(?:\+91|91|0)?[-\s]?)?[6-9]\d{4}[-\s]?\d{5}|(?:\+?\d{1,3}[-\s]?)?\(?\d{2,5}\)?[-\s]?\d{3,4}[-\s]?\d{3,4}/g;
  const rawPhones = cleanedRaw.match(phoneRegex) || [];
  const cleanPhones = rawPhones
    .map((p) => p.replace(/[^\d+]/g, ''))
    .filter((p) => p.length >= 10 && p.length <= 13);

  // Also check lines with common OCR errors for 10-digit numbers (like "oa" for "99")
  for (const l of rawLines) {
    const oaMatch = l.match(/(?:oa|aa|oo)(\d{8})/i);
    if (oaMatch && oaMatch[1]) {
      cleanPhones.push('99' + oaMatch[1]);
    }
  }

  const uniquePhones = Array.from(new Set(cleanPhones));
  const phone = uniquePhones.slice(0, 2).join(', ');

  // 2. Email Address
  let email = '';
  const standardEmailMatch = cleanedRaw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (standardEmailMatch) {
    email = standardEmailMatch[0];
  } else {
    // Handle OCR reading '@' as '.' e.g. info.company.com
    const dotEmailMatch = cleanedRaw.match(/(?:info|contact|support|sales|mail|admin)\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    if (dotEmailMatch) {
      email = dotEmailMatch[0].replace(/^([a-zA-Z]+)\./, '$1@');
    }
  }

  // 3. Website
  let website = '';
  const webMatch = cleanedRaw.match(/(?:https?:\/\/)?(?:www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i) ||
                   cleanedRaw.match(/[a-zA-Z0-9.-]+\.(?:com|in|org|net|co|io|biz|tech)/i);
  if (webMatch) {
    let rawWeb = webMatch[0].toLowerCase();
    if (!rawWeb.startsWith('http') && !rawWeb.startsWith('www.')) {
      rawWeb = 'www.' + rawWeb;
    }
    website = rawWeb;
  }

  // 4. Address detection
  const addressKeywords = /(?:floor|tower|building|plaza|complex|corporate|trinity|road|street|st\.|ave|avenue|cross|colony|nagar|plot|phase|sector|kphb|hitech|madhapur|hyderabad|bengaluru|bangalore|mumbai|delhi|chennai|pune|kolkata|india|pin|pincode|\b\d{6}\b)/i;
  const addressLines = [];
  for (const l of rawLines) {
    if (l.includes('@') || l.toLowerCase().includes('www.') || l.toLowerCase().includes('.com')) continue;
    if (uniquePhones.some((p) => l.includes(p))) continue;
    if (addressKeywords.test(l)) {
      const cleaned = cleanOcrLine(l).replace(/^(?:floor|tower)\s+[a-z]{1,3}$/i, '');
      if (cleaned.length > 2) addressLines.push(cleaned);
    }
  }
  const address = addressLines.join(', ');

  // 5. Job Title & Person Name detection
  const titleKeywords = /(?:manager|general manager|managing director|director|bdm|ceo|cto|cfo|founder|co-founder|president|vice president|vp|partner|consultant|associate|executive|officer|proprietor|advocate|architect|engineer|doctor|ca\b)/i;
  let jobTitle = '';
  let personName = '';
  let titleLineIdx = -1;

  for (let idx = 0; idx < rawLines.length; idx++) {
    const line = rawLines[idx];
    const cleanLine = cleanOcrLine(line);
    if (!cleanLine || cleanLine.length < 3) continue;

    const match = cleanLine.match(titleKeywords);
    if (match && !jobTitle) {
      jobTitle = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
      titleLineIdx = idx;

      // Check if person name is in the same line: e.g. "Jane Doe Manager"
      const beforeTitle = cleanLine.substring(0, match.index).trim();
      if (beforeTitle.length >= 3 && /^[a-zA-Z\s.]+$/.test(beforeTitle)) {
        personName = beforeTitle;
      }
      break;
    }
  }

  // If person name was not on the same line, check line immediately BEFORE the job title
  if (!personName && titleLineIdx > 0) {
    const rawPrev = rawLines[titleLineIdx - 1];
    const prevLine = cleanOcrLine(rawPrev).replace(/[0-9]/g, '').trim();
    if (
      prevLine.length >= 3 &&
      prevLine.length <= 30 &&
      !addressKeywords.test(prevLine) &&
      !prevLine.includes('@') &&
      !prevLine.includes('.com') &&
      /^[a-zA-Z\s.]+$/.test(prevLine)
    ) {
      personName = prevLine;
    }
  }

  // 6. Company Name detection
  let companyName = '';
  // Check for explicit "IT SERVICES" or "SERVICES" or "TECHNOLOGIES"
  for (const line of rawLines) {
    if (
      /(?:it services|technologies|solutions|infotech|systems|pvt ltd|enterprises|global it)/i.test(line) &&
      !line.includes('@') &&
      !line.toLowerCase().includes('www') &&
      !line.toLowerCase().includes('.com')
    ) {
      // Extract from the keyword match onwards, or clean line
      const match = line.match(/(?:(?:rr\s*)?it services|technologies|solutions|infotech|systems|pvt ltd|enterprises|global it[a-z\s]*)/i);
      companyName = match ? match[0].trim() : cleanOcrLine(line);
      break;
    }
  }

  if (companyName && !/^[a-zA-Z]/.test(companyName)) {
    companyName = companyName.replace(/^[^a-zA-Z]+/, '');
  }
  // If company name not directly recognized, infer from website or email domain
  if (!companyName && (website || email)) {
    const domainSource = website || email;
    const domainMatch = domainSource.match(/(?:www\.)?([a-zA-Z0-9-]+)\.(?:com|in|org|net)/i);
    if (domainMatch && domainMatch[1]) {
      const dName = domainMatch[1];
      companyName = dName.charAt(0).toUpperCase() + dName.slice(1);
    }
  }

  // 7. Logo Initials detection
  let logoInitials = '';
  if (companyName) {
    const words = companyName.split(/\s+/).filter((w) => w.length > 1 && !/^(it|pvt|ltd|and|&|the|llc|inc)$/i.test(w));
    if (words.length >= 2) {
      logoInitials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      logoInitials = words[0].slice(0, 2).toUpperCase();
    } else {
      logoInitials = (personName ? personName.slice(0, 2) : 'BC').toUpperCase();
    }
  } else {
    logoInitials = (personName ? personName.slice(0, 2) : 'BC').toUpperCase();
  }

  const hasQrCode = Boolean(website || email || /qr|scan|code/i.test(rawText));

  return {
    personName: personName || '',
    jobTitle: jobTitle || '',
    companyName: companyName || '',
    phone: phone || '',
    email: email || '',
    website: website || '',
    address: address || '',
    logoInitials: logoInitials || 'BC',
    hasQrCode,
  };
}

/**
 * Runs client-side OCR on an image data URL with live progress callback
 */
export async function extractCardDetailsFromImage(imageDataUrl, onProgress = null) {
  if (!imageDataUrl) return null;

  try {
    if (onProgress) onProgress('Initializing Optical Character Recognition...');
    const worker = await createWorker('eng');

    if (onProgress) onProgress('Scanning card text, contacts & company details...');
    const result = await worker.recognize(imageDataUrl);
    await worker.terminate();

    const rawText = result?.data?.text || '';
    const lines = result?.data?.lines || [];
    const parsed = parseVisitingCardText(rawText);

    return {
      rawText,
      lines,
      ...parsed,
    };
  } catch (error) {
    console.warn('OCR card extraction notice:', error);
    return null;
  }
}

/**
 * Assembles the 3-pillar analysis (BACKGROUND + CONTENT + ASSETS) into canonical TEMPLATE JSON
 */
export function buildTemplateJsonFromCardAnalysis({
  background = {},
  content = {},
  assets = {},
}) {
  const theme = background.theme || (background.color && background.color !== '#ffffff' ? 'dark' : 'light');
  return {
    version: '1.0',
    type: 'visiting_card_template',
    background: {
      type: background.type || 'gradient',
      color: background.color || '#151b2d',
      gradient: background.gradient || 'linear-gradient(135deg, #101524 0%, #1c243c 55%, #131828 100%)',
      theme,
      palette: background.palette || ['#151b2d', '#2563eb', '#fbbf24', '#38bdf8'],
      accents: [
        {
          type: 'polygon',
          position: 'top-right',
          background: 'linear-gradient(225deg, rgba(37, 99, 235, 0.35) 0%, rgba(30, 58, 138, 0.1) 60%, transparent 100%)',
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        },
        {
          type: 'polygon',
          position: 'bottom-center',
          background: 'linear-gradient(45deg, rgba(30, 58, 138, 0.25) 0%, transparent 100%)',
          clipPath: 'polygon(0 100%, 30% 0, 100% 100%)',
        },
      ],
    },
    content: {
      name: {
        text: content.name || '',
        fontSize: 22,
        fontWeight: 800,
        color: theme === 'light' ? '#0f172a' : '#ffffff',
      },
      designation: {
        text: content.designation || '',
        fontSize: 13,
        fontWeight: 600,
        color: '#94a3b8',
      },
      company: {
        text: content.company || '',
        fontSize: 15,
        fontWeight: 800,
        color: theme === 'light' ? '#004b93' : '#ffffff',
      },
      phone: {
        text: content.phone || '',
        fontSize: 11,
        fontWeight: 600,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      email: {
        text: content.email || '',
        fontSize: 11,
        color: theme === 'light' ? '#1e293b' : '#e2e8f0',
      },
      address: {
        text: content.address || '',
        fontSize: 10,
        color: theme === 'light' ? '#475569' : '#cbd5e1',
      },
      website: {
        text: content.website || '',
        fontSize: 10,
        color: '#93c5fd',
      },
    },
    assets: {
      logo: {
        type: assets.logoType || 'emblem',
        initials: assets.logoInitials || '',
        icon: 'globe',
        color: '#fbbf24',
        bg: 'radial-gradient(circle at 35% 35%, #2563eb 0%, #1e3a8a 70%, #0f172a 100%)',
      },
      qr: {
        enabled: assets.hasQrCode !== false,
        url: content.website || content.email || '',
        size: 46,
      },
      icons: [
        { type: 'phone', badgeBg: '#1e3a8a', iconColor: '#60a5fa' },
        { type: 'email', badgeBg: '#1e3a8a', iconColor: '#60a5fa' },
        { type: 'address', badgeBg: '#1e3a8a', iconColor: '#60a5fa' },
        { type: 'website', iconColor: '#60a5fa' },
      ],
    },
  };
}
