import type { ImageWidget } from "apps/admin/widgets.ts";

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
