"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-[1.6_1_520px] flex-col">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-t border-[#2A2A2A]">
            <h3 className="m-0">
              <button
                type="button"
                id={`cr-faq-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`cr-faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-[22px] text-left text-[19px] font-semibold text-[#F4F4EE]"
                style={{ font: "inherit", fontWeight: 600, fontSize: 19 }}
              >
                <span>{f.q}</span>
                <span aria-hidden="true" className="cr-mono flex-none text-[22px] text-[#DDF76A]">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <p id={`cr-faq-panel-${i}`} role="region" aria-labelledby={`cr-faq-btn-${i}`} hidden={!isOpen} className="m-0 mb-[22px] max-w-[640px] text-[#C9CBC3]">
              {f.a}
            </p>
          </div>
        );
      })}
      <div className="border-t border-[#2A2A2A]" />
    </div>
  );
}
