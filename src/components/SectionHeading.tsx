import type { ReactNode } from 'react';

export function SectionHeading({ label, children }: { label: string; children: ReactNode }) {
  return <div className="section-heading"><p className="eyebrow">{label}</p><h2>{children}</h2></div>;
}
