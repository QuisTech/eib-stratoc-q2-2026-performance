"use client"

import { useState } from "react"
import { parseMarkdown } from "@/lib/markdown"

interface ScormAccordionProps {
  sections: {
    heading: string
    body: string[]
  }[]
}

export function ScormAccordion({ sections }: ScormAccordionProps) {
  if (!sections || sections.length === 0) return null

  return (
    <div 
      className="blocks-accordion bg--legacy-background block-wrapper bg bg--card-white bg--range-light bg--type-color"
      style={{
        "--color-background": "#5b92e5", 
        boxShadow: "rgb(91, 146, 229) 0px 1px 0px", 
        paddingBottom: "2rem", 
        paddingTop: "2rem", 
        "--color-background-contrast": "#000", 
        "--color-background-contrast-complementary": "#fff", 
        "--color-background-contrast-rgb": "0,0,0"
      } as React.CSSProperties}
    >
      <span></span>
      <div>
        <div className="animated fadeIn" style={{ animationDuration: "0.75s", opacity: 1, animationDelay: "0s" }}>
          <div className="blocks-accordion__container">
            <div className="blocks-accordion__row">
              <div className="blocks-accordion__col">
                <div className="blocks-accordion__wrapper flex flex-col gap-3 px-4">
                  {sections.map((section, idx) => (
                    <AccordionItem key={idx} index={idx} heading={section.heading} body={section.body} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccordionItem({ index, heading, body }: { index: number; heading: string; body: string[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `panel-accordion-${index}`
  const titleId = `title-accordion-${index}`

  return (
    <section 
      className={`blocks-accordion__item block-card bg--range-light block-card--white ${isOpen ? 'blocks-accordion__item--open' : 'blocks-accordion__item--closed'}`}
    >
      <div role="heading" aria-level={2}>
        <button 
          aria-controls={panelId} 
          aria-expanded={isOpen} 
          className="blocks-accordion__header" 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="blocks-accordion__title brand--head brand--linkColor" id={titleId}>
            <div className="fr-view">{heading}</div>
          </div>
          <span aria-hidden="true" className="blocks-accordion__toggler text-primary">
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </div>
      <section 
        aria-labelledby={titleId} 
        className="blocks-accordion__content" 
        id={panelId}
      >
        <div className="blocks-accordion__description brand--body brand--linkColor">
          <div className="fr-view flex flex-col gap-3">
            {(Array.isArray(body) ? body : (typeof body === 'string' ? [body] : [])).map((p, i) => (
              <p 
                key={i} 
                className="text-pretty leading-relaxed text-muted-foreground text-base"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(String(p)) }}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}
