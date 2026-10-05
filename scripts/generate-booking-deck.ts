/**
 * Booking sayfası içeriğine uyumlu kurumsal sunum (.pptx).
 * Çalıştır: pnpm run deck:booking
 */
import fs from "node:fs";
import path from "node:path";
import pptxgen from "pptxgenjs";
import { BOOKING_FAQ_ITEMS } from "../lib/booking-faq";
import { BOOKING_OFFER_OPTIONS } from "../lib/booking-offer-options";

const COLORS = {
  bg: "09090B",
  surface: "18181B",
  surfaceHover: "1C1C22",
  border: "3F3F46",
  hairline: "27272A",
  text: "FAFAFA",
  muted: "A1A1AA",
  dim: "71717A",
  accent: "D946EF",
  accent2: "22D3EE",
} as const;

/** Office’te güvenle açılır; Helvetica yerine Calibri */
const FONT = "Calibri";

const SLIDE_W = 13.33;
const SLIDE_H = 7.5;
const PAD_X = 0.95;
const PAD_RIGHT = 0.85;
const CONTENT_W = SLIDE_W - PAD_X - PAD_RIGHT;
const RAIL_W = 0.11;
const BODY_TOP = 1.38;
const FOOTER_Y = 6.78;

const WHATSAPP_LINE = "WhatsApp: +90 541 799 79 73";
const SITE = "noqt.club/booking";

const LOGO_WORDMARK = path.join(process.cwd(), "public", "noqta-wordmark.png");

type DeckSlide = ReturnType<InstanceType<typeof pptxgen>["addSlide"]>;
type Pptx = InstanceType<typeof pptxgen>;

function assertWordmarkPath() {
  if (!fs.existsSync(LOGO_WORDMARK)) {
    throw new Error(`Wordmark bulunamadı: ${LOGO_WORDMARK}`);
  }
}

function slideDark(pptx: Pptx): DeckSlide {
  const s = pptx.addSlide();
  s.background = { color: COLORS.bg };
  return s;
}

function addLeftRail(slide: DeckSlide, pptx: Pptx) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: RAIL_W,
    h: SLIDE_H,
    fill: { color: COLORS.accent },
    line: { pt: 0 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: SLIDE_H * 0.55,
    w: RAIL_W,
    h: SLIDE_H * 0.45,
    fill: { color: COLORS.accent2 },
    line: { pt: 0 },
  });
}

function addFooterBar(slide: DeckSlide, pptx: Pptx) {
  slide.addShape(pptx.ShapeType.rect, {
    x: PAD_X,
    y: FOOTER_Y,
    w: CONTENT_W,
    h: 0.02,
    fill: { color: COLORS.hairline },
    line: transparencyLine(),
  });
  const lw = 1.05;
  slide.addImage({
    path: LOGO_WORDMARK,
    x: PAD_X,
    y: FOOTER_Y + 0.12,
    w: lw,
  });
  slide.addText("noqta · DJ Booking", {
    x: PAD_X + lw + 0.22,
    y: FOOTER_Y + 0.2,
    w: 4.5,
    h: 0.35,
    fontSize: 9,
    color: COLORS.dim,
    fontFace: FONT,
  });
}

function transparencyLine() {
  return { color: COLORS.hairline, transparency: 100, pt: 0 };
}

function contentSlide(pptx: Pptx): DeckSlide {
  const s = slideDark(pptx);
  addLeftRail(s, pptx);
  addFooterBar(s, pptx);
  return s;
}

function sectionEyebrow(slide: DeckSlide, label: string, y: number) {
  slide.addText(label.toUpperCase(), {
    x: PAD_X,
    y,
    w: CONTENT_W,
    h: 0.32,
    fontSize: 9,
    color: COLORS.accent2,
    fontFace: FONT,
    bold: true,
  });
}

function sectionTitle(slide: DeckSlide, title: string, y: number) {
  slide.addText(title, {
    x: PAD_X,
    y,
    w: CONTENT_W,
    h: 0.75,
    fontSize: 26,
    bold: true,
    color: COLORS.text,
    fontFace: FONT,
  });
}

function sectionSubtitle(slide: DeckSlide, text: string, y: number) {
  slide.addText(text, {
    x: PAD_X,
    y,
    w: CONTENT_W * 0.92,
    h: 0.95,
    fontSize: 13,
    color: COLORS.muted,
    fontFace: FONT,
    valign: "top",
  });
}

function sectionHeader(slide: DeckSlide, eyebrow: string, title: string, subtitle: string) {
  let y = 0.42;
  sectionEyebrow(slide, eyebrow, y);
  y += 0.34;
  sectionTitle(slide, title, y);
  y += 0.72;
  sectionSubtitle(slide, subtitle, y);
}

function addCoverCardBand(slide: DeckSlide, pptx: Pptx) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.65,
    y: 4.35,
    w: SLIDE_W - 1.3,
    h: 2.75,
    fill: { color: COLORS.surface },
    line: { color: COLORS.border, pt: 0.75 },
    rectRadius: 0.08,
  });
}

async function main() {
  assertWordmarkPath();

  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = "noqta — DJ Booking";
  pptx.subject = "Etkinlik müziği ve DJ booking";
  pptx.author = "noqta";

  // — Kapak
  {
    const s = slideDark(pptx);
    addCoverCardBand(s, pptx);

    s.addImage({
      path: LOGO_WORDMARK,
      x: (SLIDE_W - 4.1) / 2,
      y: 0.72,
      w: 4.1,
    });

    s.addText("DJ Booking & etkinlik müziği", {
      x: 0.65,
      y: 1.92,
      w: SLIDE_W - 1.3,
      h: 0.85,
      fontSize: 34,
      bold: true,
      color: COLORS.text,
      fontFace: FONT,
      align: "center",
    });

    s.addText("Net akış · Özel deneyim · Türkiye geneli", {
      x: 0.65,
      y: 2.68,
      w: SLIDE_W - 1.3,
      h: 0.5,
      fontSize: 15,
      color: COLORS.accent2,
      fontFace: FONT,
      align: "center",
    });

    s.addText(
      "Düğün ve kutlamalardan kurumsal geceye; mekân ve sahneye uygun müzik kurgusu. Planı birlikte netleştirip gününde profesyonel uygulama.",
      {
        x: 0.95,
        y: 4.58,
        w: SLIDE_W - 1.9,
        h: 0.95,
        fontSize: 13,
        color: COLORS.muted,
        fontFace: FONT,
        align: "center",
        valign: "top",
      },
    );

    s.addText(`${SITE}  ·  ${WHATSAPP_LINE}`, {
      x: 0.65,
      y: 5.72,
      w: SLIDE_W - 1.3,
      h: 0.4,
      fontSize: 11,
      color: COLORS.dim,
      fontFace: FONT,
      align: "center",
    });
  }

  // — Özet
  {
    const s = contentSlide(pptx);
    sectionHeader(
      s,
      "Öne çıkanlar",
      "Özet",
      "Konsepte uyumlu müzik akışı; özel davetten kurumsal etkinliğe esnek kurgu.",
    );
    s.addText(
      "Planı birlikte netleştirip, gününde profesyonel şekilde uyguluyoruz.",
      {
        x: PAD_X,
        y: BODY_TOP,
        w: CONTENT_W * 0.88,
        h: 0.45,
        fontSize: 13,
        color: COLORS.text,
        fontFace: FONT,
      },
    );
    const bullets = [
      "Konsepte uyumlu müzik akışı",
      "Özel davetlerden marka etkinliklerine esnek kurgu",
      "Türkiye genelinde seçili projeler",
    ];
    s.addText(
      bullets.map((t) => ({
        text: t,
        options: { bullet: { type: "bullet" }, color: COLORS.text, fontSize: 15, indentLevel: 0 },
      })),
      {
        x: PAD_X + 0.05,
        y: BODY_TOP + 0.55,
        w: CONTENT_W * 0.9,
        h: 2.4,
        fontFace: FONT,
        valign: "top",
      },
    );
  }

  // — Neden noqta (kartlar)
  {
    const s = contentSlide(pptx);
    sectionHeader(
      s,
      "Farkımız",
      "Neden noqta?",
      "Müzik tarafını sakin biçimde üstlenirsiniz; siz etkinliğin akışına odaklanırsınız.",
    );
    const items = [
      {
        title: "Etkinliğe özel müzik kurgusu",
        text: "Line-up ve akış; mekân, davet profili ve tempo ile uyumlu planlanır.",
      },
      {
        title: "Kitle ve enerjiye göre set",
        text: "Gece ilerledikçe tonu doğru yerde yükseltip yumuşatırız; doğal bir yayılma.",
      },
      {
        title: "Türkçe / global dengesi",
        text: "İhtiyaca göre dengeli seleksiyon — konsept konuşur.",
      },
      {
        title: "Profesyonel iletişim",
        text: "Zaman çizgisi ve teknik çerçeve net; sürprize yer bırakmadan ilerlersiniz.",
      },
    ];
    const gap = 0.32;
    const cardW = (CONTENT_W - gap) / 2;
    const cardH = 1.72;
    const y0 = BODY_TOP - 0.05;
    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = PAD_X + col * (cardW + gap);
      const y = y0 + row * (cardH + gap);

      s.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: cardW,
        h: cardH,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, pt: 0.5 },
        rectRadius: 0.06,
      });
      s.addShape(pptx.ShapeType.rect, {
        x,
        y,
        w: 0.07,
        h: cardH,
        fill: { color: COLORS.accent },
        line: { pt: 0 },
      });
      s.addText(item.title, {
        x: x + 0.24,
        y: y + 0.2,
        w: cardW - 0.34,
        h: 0.42,
        fontSize: 12,
        bold: true,
        color: COLORS.text,
        fontFace: FONT,
        valign: "top",
      });
      s.addText(item.text, {
        x: x + 0.24,
        y: y + 0.62,
        w: cardW - 0.34,
        h: cardH - 0.72,
        fontSize: 11,
        color: COLORS.muted,
        fontFace: FONT,
        valign: "top",
      });
    });
  }

  // — Süreç (üst 3 + alt 2 ortalı)
  {
    const u = contentSlide(pptx);
    sectionHeader(u, "Süreç", "Nasıl ilerliyoruz?", "Uzun süreç yok — adımlar net ve öngörülebilir.");

    const steps = [
      { title: "Talep bırak", hint: "Form veya iletişim" },
      { title: "Kısa değerlendirme", hint: "Tarih ve uygunluk" },
      { title: "Konsept & ihtiyaç", hint: "Birlikte netleşelim" },
      { title: "Teklif & planlama", hint: "Akış ve koordinasyon" },
      { title: "Etkinlik günü", hint: "Uygulama" },
    ];

    const gap = 0.22;
    const boxW = (CONTENT_W - 2 * gap) / 3;
    const y0 = BODY_TOP + 0.1;

    const drawStep = (
      slide: DeckSlide,
      idx: number,
      st: (typeof steps)[0],
      x: number,
      y: number,
      w: number,
    ) => {
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w,
        h: 1.72,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, pt: 0.5 },
        rectRadius: 0.06,
      });
      slide.addText(String(idx + 1).padStart(2, "0"), {
        x: x + 0.16,
        y: y + 0.14,
        w: w - 0.28,
        h: 0.28,
        fontSize: 10,
        bold: true,
        color: COLORS.accent,
        fontFace: FONT,
      });
      slide.addText(st.title, {
        x: x + 0.16,
        y: y + 0.42,
        w: w - 0.28,
        h: 0.55,
        fontSize: 12,
        bold: true,
        color: COLORS.text,
        fontFace: FONT,
        valign: "top",
      });
      slide.addText(st.hint, {
        x: x + 0.16,
        y: y + 0.98,
        w: w - 0.28,
        h: 0.62,
        fontSize: 10,
        color: COLORS.dim,
        fontFace: FONT,
        valign: "top",
      });
    };

    for (let i = 0; i < 3; i++) {
      drawStep(u, i, steps[i], PAD_X + i * (boxW + gap), y0, boxW);
    }

    const y1 = y0 + 1.72 + 0.35;
    const pairW = (CONTENT_W - gap) / 2;
    const pairTotal = pairW * 2 + gap;
    const xStart = PAD_X + (CONTENT_W - pairTotal) / 2;
    drawStep(u, 3, steps[3], xStart, y1, pairW);
    drawStep(u, 4, steps[4], xStart + pairW + gap, y1, pairW);
  }

  // — Hizmet tablosu (daha ferah satırlar)
  {
    const s = contentSlide(pptx);
    sectionHeader(
      s,
      "Kapsam",
      "Hizmet alanları",
      "Etkinlik türüne göre müzik kurgusu ve sahne dili; teklifte netleştiririz.",
    );

    const headerFill = COLORS.surfaceHover;
    const rowAlt = COLORS.surface;
    const rows: pptxgen.TableRow[] = [
      [
        { text: "Alan", options: { bold: true, color: COLORS.text, fill: { color: headerFill } } },
        { text: "Özet", options: { bold: true, color: COLORS.text, fill: { color: headerFill } } },
      ],
      ...BOOKING_OFFER_OPTIONS.map((o, i) => [
        {
          text: `${o.title}\n${o.subtitle}`,
          options: { color: COLORS.text, fontSize: 11, valign: "middle", fill: { color: i % 2 ? rowAlt : COLORS.bg } },
        },
        {
          text: o.summary,
          options: { color: COLORS.muted, fontSize: 11, valign: "middle", fill: { color: i % 2 ? rowAlt : COLORS.bg } },
        },
      ]),
    ];

    s.addTable(rows, {
      x: PAD_X,
      y: BODY_TOP + 0.05,
      w: CONTENT_W,
      colW: [3.55, CONTENT_W - 3.55],
      rowH: [0.42, ...BOOKING_OFFER_OPTIONS.map(() => 0.56)],
      border: { type: "solid", color: COLORS.hairline, pt: 0.5 },
      fontFace: FONT,
    });
  }

  // — Hizmet detayları: 2 sütun, başlıklar vurgulu
  {
    const s = contentSlide(pptx);
    sectionHeader(
      s,
      "Yaklaşım",
      "Her alanda nasıl çalışıyoruz?",
      "Web sitemizdeki özet kartlarla aynı çerçeve — kurumsal paylaşım için derli toplu metin.",
    );
    const mid = PAD_X + CONTENT_W / 2 + 0.18;
    const colW = (CONTENT_W / 2) - 0.22;

    const renderCol = (opts: typeof BOOKING_OFFER_OPTIONS, x0: number) => {
      let y = BODY_TOP + 0.05;
      opts.forEach((o) => {
        s.addText(o.title, {
          x: x0,
          y,
          w: colW,
          h: 0.34,
          fontSize: 12,
          bold: true,
          color: COLORS.accent2,
          fontFace: FONT,
        });
        y += 0.36;
        s.addText(o.detail, {
          x: x0,
          y,
          w: colW,
          h: 1.08,
          fontSize: 10.5,
          color: COLORS.muted,
          fontFace: FONT,
          valign: "top",
        });
        y += 1.14;
      });
    };

    renderCol(BOOKING_OFFER_OPTIONS.slice(0, 3), PAD_X);
    renderCol(BOOKING_OFFER_OPTIONS.slice(3), mid);
  }

  // — SSS
  {
    const half = Math.ceil(BOOKING_FAQ_ITEMS.length / 2);
    const chunks = [BOOKING_FAQ_ITEMS.slice(0, half), BOOKING_FAQ_ITEMS.slice(half)];
    chunks.forEach((chunk, pageIdx) => {
      const s = contentSlide(pptx);
      sectionHeader(
        s,
        "SSS",
        pageIdx === 0 ? "Sık sorulanlar" : "Sık sorulanlar (devam)",
        "Kısa cevaplar; ayrıntı için tek mesaj yeterli.",
      );
      let y = BODY_TOP + 0.02;
      chunk.forEach((item) => {
        const blockH = 1.22;
        s.addShape(pptx.ShapeType.roundRect, {
          x: PAD_X,
          y,
          w: CONTENT_W,
          h: blockH,
          fill: { color: COLORS.surface },
          line: { color: COLORS.border, pt: 0.5 },
          rectRadius: 0.05,
        });
        s.addShape(pptx.ShapeType.rect, {
          x: PAD_X,
          y,
          w: 0.06,
          h: blockH,
          fill: { color: COLORS.accent2 },
          line: { pt: 0 },
        });
        s.addText(item.q, {
          x: PAD_X + 0.22,
          y: y + 0.14,
          w: CONTENT_W - 0.38,
          h: 0.38,
          fontSize: 12,
          bold: true,
          color: COLORS.text,
          fontFace: FONT,
          valign: "top",
        });
        s.addText(item.a, {
          x: PAD_X + 0.22,
          y: y + 0.48,
          w: CONTENT_W - 0.38,
          h: 0.62,
          fontSize: 11,
          color: COLORS.muted,
          fontFace: FONT,
          valign: "top",
        });
        y += blockH + 0.18;
      });
    });
  }

  // — CTA
  {
    const s = contentSlide(pptx);
    sectionHeader(
      s,
      "İletişim",
      "Sonraki adım",
      "Etkinlik detaylarını paylaşın; takvim ve konsepte uygun akışı birlikte planlayalım.",
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: PAD_X,
      y: BODY_TOP + 0.05,
      w: CONTENT_W,
      h: 2.55,
      fill: { color: COLORS.surface },
      line: { color: COLORS.border, pt: 0.75 },
      rectRadius: 0.08,
    });

    s.addText("Teklif ve form", {
      x: PAD_X + 0.45,
      y: BODY_TOP + 0.35,
      w: CONTENT_W - 0.9,
      h: 0.38,
      fontSize: 14,
      bold: true,
      color: COLORS.accent2,
      fontFace: FONT,
    });
    s.addText(SITE, {
      x: PAD_X + 0.45,
      y: BODY_TOP + 0.75,
      w: CONTENT_W - 0.9,
      h: 0.38,
      fontSize: 15,
      color: COLORS.text,
      fontFace: FONT,
    });
    s.addText(WHATSAPP_LINE, {
      x: PAD_X + 0.45,
      y: BODY_TOP + 1.18,
      w: CONTENT_W - 0.9,
      h: 0.38,
      fontSize: 15,
      color: COLORS.text,
      fontFace: FONT,
    });
    s.addText(
      "Yerel sayfalar: Kayseri DJ · Nevşehir & Kapadokya · Ankara kurumsal — noqt.club üzerinden.",
      {
        x: PAD_X + 0.45,
        y: BODY_TOP + 1.85,
        w: CONTENT_W - 0.9,
        h: 0.65,
        fontSize: 11,
        color: COLORS.dim,
        fontFace: FONT,
        valign: "top",
      },
    );
  }

  const outDir = path.join(process.cwd(), "output");
  fs.mkdirSync(outDir, { recursive: true });
  const fileName = path.join(outDir, "noqta-booking-deck.pptx");
  await pptx.writeFile({ fileName });
  // eslint-disable-next-line no-console
  console.log(`Yazıldı: ${fileName}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
