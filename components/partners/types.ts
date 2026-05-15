import type { ImageWidget } from "apps/admin/widgets.ts";

/** @titleBy label */
export interface StatItem {
  /** @title Valor */
  value: string;
  /** @title Rótulo */
  label: string;
}

/** @titleBy alt */
export interface PartnerItem {
  image: ImageWidget;
  alt: string;
  /**
   * @title Segmento
   * @description O filtro é criado automaticamente a partir deste valor (ex.: Tecnologia, Varejo).
   */
  segment: string;
}
