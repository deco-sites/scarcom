import { ProductDetailsPage } from "apps/commerce/types.ts";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { type SectionProps as SectionProps } from "@deco/deco";
import DetailsControl from "deco-sites/scarcom/islands/DetailsControl.tsx";

export interface IContentDetailsProps {
  /** @title Imagem ou Video ? */
  /** @description Escolha entre imagem de banner ou video */
  mediaType: "IMAGE" | "VIDEO";

  /** @title Imagem */
  banner: ImageWidget;

  /** @title Link video */
  /** @description Copiar Iframe do YouTube ou do Vimeo. Usar 100% como width(Largura) */
  videoHtml?: string;

  /** @title Texto alternativo da Imagem */
  alt: string;
  /** @title Título */
  title: string;
  /** @title Descrição*/
  text: RichText;
}

export interface IAdvancedDetailListProps {
  /** @title Id do Produto */
  productId: string;
  /** @title Lista dos Detalhes */
  contentDetails: IContentDetailsProps[];
}

export interface Props {
  /** @title Lista dos produtos */
  advancedDetailList?: IAdvancedDetailListProps[];
  page: ProductDetailsPage | null;
}

export function loader(props: Props, _req: Request, _: AppContext) {
  const { advancedDetailList, page } = props;
  const productId = page?.product.productID;
  const productname = page?.product.name;

  console.log("productId", productId);
  console.log("productname", productname);
  

  if (!productId || !advancedDetailList) {
    return { success: false };
  }
  const productExistInList = advancedDetailList.filter((advancedDetail) => {
    return advancedDetail.productId === productId;
  });
  if (productExistInList.length === 0) {
    return { success: false };
  }
  return {
    success: true,
    contentDetails: productExistInList[0].contentDetails,
    page,
  };
}

function ProductAdvancedDetails(props: SectionProps<typeof loader>) {
  if (
    !props.success || !props.contentDetails || props.contentDetails.length === 0
  ) return null;

  return (
    <div className="container w-full m-auto px-5 my-5 lg:my-10">
      <DetailsControl
        contentDetails={props.contentDetails}
        page={props.page}
      />
    </div>
  );
}
export default ProductAdvancedDetails;
