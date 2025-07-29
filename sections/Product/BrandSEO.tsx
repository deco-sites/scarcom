import type { FnContext } from "@deco/deco";
import type { RichText } from "apps/admin/widgets.ts";
import { getTermFromURL, slugify } from "../../utils/search.ts";
import ExpandableDescription from "../../islands/ExpandableDescription.tsx";
import ResponsiveButtonSlider from "../../components/ui/ResponsiveButtonSlider.tsx";

/**
 * @titleBy text
 */
export interface CTA {
  /**
   * @title Texto do botão
   */
  text: string;
  /**
   * @title Link do botão
   */
  href: string;
  /**
   * @title Link externo
   */
  external?: boolean;
}

/**
 * @titleBy title
 */
export interface BrandContent {
  /**
   * @title Termos de busca
   * @description Lista de termos para buscar na URL. Por exemplo, para "Western Digital", você pode adicionar "western-digital". Estes são insensíveis a maiúsculas e minúsculas.
   */
  matchers: string[];
  /**
   * @title Título
   * @description Título principal exibido como H1. Se vazio, o nome da marca da VTEX será usado.
   */
  title?: string;
  /**
   * @title Botões de ação (CTAs)
   */
  ctas?: CTA[];
  /**
   * @title Descrição
   * @description Use H2, H3, H4... para títulos e subtítulos.
   */
  description?: RichText;
}

export interface Props {
  /**
   * @title Marcas
   */
  brands: BrandContent[];
  /**
   * @title Altura do texto expandido
   * @description A altura máxima do texto expandido quando estiver fechado. Por exemplo, "100px" para 100 pixels.
   */
  maxHeight?: string;
}

interface VtexBrand {
  id: number;
  name: string;
  isActive: boolean;
  title: string;
  metaTagDescription?: string;
}

interface LoaderResult extends Omit<BrandContent, "matchers"> {
  title?: string;
  maxHeight?: string;
  isMobile?: boolean;
}

const API_URL = "https://scarcom.myvtex.com/api/catalog_system/pub/brand/list";

export async function loader(
  { brands, maxHeight }: Props,
  req: Request,
  ctx: FnContext,
): Promise<LoaderResult | null> {
  const term = getTermFromURL(new URL(req.url));

  if (!term) return null;

  const slugifiedTerm = slugify(term);

  const matchedBrand =
    brands?.find(({ matchers }) =>
      matchers.some((matcher) => slugify(matcher) === slugifiedTerm)
    ) || null;

  if (matchedBrand) {
    return {
      ...matchedBrand,
      title: matchedBrand?.title?.trim(),
      maxHeight,
      isMobile: ctx.device !== "desktop",
    };
  }

  try {
    const vtexBrandsResponse = await fetch(API_URL);
    if (!vtexBrandsResponse.ok) throw new Error("VTEX API request failed.");

    const vtexBrands: VtexBrand[] = await vtexBrandsResponse.json();
    const vtexBrand = vtexBrands.find((b) => slugify(b.name) === slugifiedTerm);

    if (vtexBrand) {
      return {
        title: vtexBrand.name,
        maxHeight,
        isMobile: ctx.device !== "desktop",
      };
    }
  } catch (error) {
    console.error("Failed to fetch or process VTEX brands:", error);
  }

  return null;
}

function BrandSEO(props: Awaited<ReturnType<typeof loader>>) {
  if (!props) return null;

  const { title, description, ctas, maxHeight, isMobile } = props;

  return (
    <div class="mb-16 w-full">
      <div class="flex flex-col">
        <div className="my-10 bg-[#023F67] py-10">
          <h1 class="container px-5 text-2xl font-bold uppercase tracking-wider text-white md:text-3xl">
            {title}
          </h1>
        </div>

        <ResponsiveButtonSlider items={ctas || []} isMobile={isMobile} />

        {description && (
          <ExpandableDescription
            description={description}
            className="[&_*]:!text-[#474747]"
            maxHeight={maxHeight}
          />
        )}
      </div>
    </div>
  );
}

export default BrandSEO;
