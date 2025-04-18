import {
  BUTTON_VARIANTS,
  ButtonVariant,
} from "$store/components/minicart/Cart.tsx";
import Avatar from "$store/components/ui/Avatar.tsx";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import { SendEventOnClick } from "../../components/Analytics.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import DiscountBadge, { DiscountBadgeProps } from "./DiscountBadge.tsx";
import ProductHighlights from "$store/components/product/ProductHighlights.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import { useOffer } from "deco-sites/scarcom/utils/useOffer.ts";

export interface Layout {
  basics?: {
    contentAlignment?: "Left" | "Center";
    oldPriceSize?: "Small" | "Normal";
    ctaText?: string;
    mobileCtaText?: string;
    ctaVariation?: ButtonVariant;
    ctaMode?: "Go to Product Page" | "Add to Cart";
  };
  /**
   * @description Discount Percent value To Pix, Boleto etc... , sample: 10 = 10%
   */
  discountPercent?: number;
  discount?: DiscountBadgeProps;
  elementsPositions?: {
    skuSelector?: "Top" | "Bottom";
    favoriteIcon?: "Top right" | "Top left";
  };
  hide: {
    productName?: boolean;
    productDescription?: boolean;
    allPrices?: boolean;
    installments?: boolean;
    skuSelector?: boolean;
    cta?: boolean;
  };
  onMouseOver?: {
    image?: "Change image" | "Zoom image";
    showFavoriteIcon?: boolean;
    showSkuSelector?: boolean;
    showCardShadow?: boolean;
    showCta?: boolean;
  };
}

interface Props {
  product: Product;
  /**
   * @description Discount Percent value To Pix, Boleto etc... , sample: 10 = 10%
   */
  discountPercent?: number;
  /** Preload card image */
  preload?: boolean;
  /**
   * @description Flags, displayed when  products are found
   */
  highlights?: HighLight[];
  /** @description used for analytics event */
  itemListName?: string;
  /** @description index of the product card in the list */
  index?: number;
  layout?: Layout;
}

export const relative = (url: string) => {
  const link = new URL(url);
  return `${link.pathname}${link.search}`;
};

const WIDTH = 279;
const HEIGHT = 270;

function ProductCard({
  product,
  preload,
  itemListName,
  layout,
  highlights,
  index,
}: Props) {
  const { url, productID, name, image: images, offers, isVariantOf } = product;

  const productGroupID = isVariantOf?.productGroupID;
  const id = `product-card-${productID}`;

  const hasVariant = isVariantOf?.hasVariant ?? [];
  const front = images && images[0];
  let back = images &&
    images.find((obj) => {
      return obj.name === "over";
    });
  if (!back) back = images?.[1] ?? images?.[0];

  const { listPrice, price, installment_text, seller, availability_quantity } =
    useOffer(
      offers,
    );

  const possibilities = useVariantPossibilities(hasVariant, product);
  const variants = Object.entries(Object.values(possibilities)[0] ?? {});

  const l = layout;
  const align =
    !l?.basics?.contentAlignment || l?.basics?.contentAlignment == "Left"
      ? "left"
      : "center";
  const skuSelector = variants
    .map(([value, link]) => [value, relative(link ?? "")] as const)
    .map(([value, link]) => (
      <li>
        <a href={link}>
          <Avatar
            content={value}
            variant={link === url ? "active" : link ? "default" : "disabled"}
          />
        </a>
      </li>
    ));

  const addToCartButtonClassNames = (variant: string | undefined) =>
    `lg:text-sm font-medium text-xs whitespace-nowrap m-auto btn h-8 min-h-6 max-md:min-h-[2.25rem] max-md:h-[2.25rem] btn-${
      BUTTON_VARIANTS[variant ?? "primary"]
    }`;

  const cta = layout?.basics?.ctaMode === "Go to Product Page"
    ? (
      <a
        href={url && relative(url)}
        aria-label="view product"
        class={`min-w-[162px] ${
          addToCartButtonClassNames(
            layout?.basics?.ctaVariation,
          )
        }`}
      >
        <span class="max-lg:hidden flex font-medium ">
          {l?.basics?.ctaText || "Ver produto"}
        </span>
        <span class="lg:hidden flex font-medium">
          {l?.basics?.mobileCtaText || "Add ao carrinho"}
        </span>
      </a>
    )
    : l?.basics?.mobileCtaText
    ? (
      <>
        <AddToCartButton
          url={url as string}
          availability={availability_quantity as string}
          quantity={1}
          name={product.name as string}
          discount={price && listPrice ? listPrice - price : 0}
          productGroupId={product.isVariantOf?.productGroupID ?? ""}
          price={price as number}
          sellerId={seller as string}
          skuId={product.sku}
          label={l?.basics?.mobileCtaText}
          classes={`mb-5 uppercase font-bold min-w-[200px]  lg:min-w-0 ${
            addToCartButtonClassNames(
              layout?.basics?.ctaVariation,
            )
          }`}
        />
      </>
    )
    : (
      <AddToCartButton
        quantity={1}
        name={product.name as string}
        availability={availability_quantity as string}
        discount={price && listPrice ? listPrice - price : 0}
        productGroupId={product.isVariantOf?.productGroupID ?? ""}
        price={price as number}
        sellerId={seller as string}
        skuId={product.sku}
        label={l?.basics?.ctaText}
        classes={`hidden lg:flex lg:justify-center ${
          addToCartButtonClassNames(
            layout?.basics?.ctaVariation,
          )
        }`}
      />
    );

  const price2: number = price as number;
  const listPrice2: number = listPrice as number;

  return (
    <div
      class={`card card-compact opacity-100 bg-opacity-100 group w-full ${
        align === "center" ? "text-center" : "text-start"
      } ${l?.onMouseOver?.showCardShadow ? "lg:hover:card-bordered" : ""}`}
      data-deco="view-product"
      id={`product-card-${productID}`}
    >
      {/* Add click event to dataLayer */}
      <SendEventOnClick
        id={id}
        event={{
          name: "select_item" as const,
          params: {
            item_list_name: itemListName,
            items: [
              mapProductToAnalyticsItem({
                product,
                price,
                listPrice,
                index,
              }),
            ],
          },
        }}
      />
      <figure
        class="relative rounded-none"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      >
        {/* Wishlist button */}
        <div
          class={`absolute top-2 z-10
          ${
            l?.elementsPositions?.favoriteIcon === "Top left"
              ? "left-2"
              : "right-2"
          }
          ${
            l?.onMouseOver?.showFavoriteIcon
              ? "lg:hidden lg:group-hover:block"
              : "lg:hidden"
          }
        `}
        >
          <WishlistIcon productGroupID={productGroupID} productID={productID} />
        </div>
        <a
          href={url && relative(url)}
          aria-label="view product"
          class="contents relative"
        >
          <div
            class={`absolute w-full left-0 top-0 p-[10px] flex items-center z-10`}
          >
            <div class={`grid grid-cols-2 gap-y-1 w-full`}>
              {listPrice2 !== price2 && (
                <DiscountBadge
                  price={price2}
                  listPrice={listPrice2}
                  label={l?.discount?.label}
                  variant={l?.discount?.variant}
                />
              )}

              {product && (
                <ProductHighlights
                  product={product}
                  highlights={highlights}
                  listPrice={listPrice2}
                />
              )}
            </div>
          </div>

          <Image
            src={front ? front.url! : ""}
            alt={front ? front.alternateName : ""}
            width={WIDTH}
            height={HEIGHT}
            class={`
              absolute rounded-none w-full max-h-full object-contain	
              ${
              !l?.onMouseOver?.image ||
                l?.onMouseOver?.image == "Change image"
                ? "duration-100 transition-opacity opacity-100 lg:group-hover:opacity-0"
                : ""
            }
              ${
              l?.onMouseOver?.image == "Zoom image"
                ? "duration-100 transition-scale scale-100 lg:group-hover:scale-105"
                : ""
            }
            `}
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          {(!l?.onMouseOver?.image ||
            l?.onMouseOver?.image == "Change image") && (
            <Image
              src={back?.url ?? (front ? front.url! : "")}
              alt={back?.alternateName ?? (front ? front.alternateName : "")}
              width={WIDTH}
              height={HEIGHT}
              class="absolute transition-opacity rounded-none w-full max-h-full object-contain opacity-0 lg:group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, 20vw"
              loading="lazy"
              decoding="async"
            />
          )}
        </a>
      </figure>
      {/* Prices & Name */}

      <div class="flex-auto flex flex-col">
        {/* SKU Selector */}
        {(!l?.elementsPositions?.skuSelector ||
          l?.elementsPositions?.skuSelector === "Top") && (
          <>
            {l?.hide.skuSelector
              ? (
                ""
              )
              : (
                <ul
                  class={`flex items-center gap-2 w-full ${
                    align === "center" ? "justify-center" : "justify-start"
                  } ${l?.onMouseOver?.showSkuSelector ? "lg:hidden" : ""}`}
                >
                  {skuSelector}
                </ul>
              )}
          </>
        )}

        {l?.hide.productName && l?.hide.productDescription
          ? (
            ""
          )
          : (
            <div class="flex flex-col gap-0 mt-[15px]">
              {l?.hide.productName
                ? (
                  ""
                )
                : (
                  <h2 class="line-clamp-2 text-xs font-bold text-base-content">
                    {isVariantOf?.name || name}
                  </h2>
                )}
              {l?.hide.productDescription
                ? (
                  ""
                )
                : (
                  <p class="truncate text-sm lg:text-sm text-neutral">
                    {product.description}
                  </p>
                )}
            </div>
          )}
        {l?.hide.allPrices
          ? (
            ""
          )
          : (
            <div class="flex flex-col mt-2">
              {layout?.discountPercent
                ? (
                  <div class="text-xs text-primary font-normal text-gray-800 mt-[5px]">
                    <span class="text-[1.0rem] text-primary font-bold">
                      {formatPrice(
                        price! -
                          (price! * (layout?.discountPercent % 100)) / 100,
                        offers!.priceCurrency,
                      )}
                      {" "}
                    </span>
                    à vista ou
                  </div>
                )
                : null}
              <div
                class={`flex items-center gap-2.5 ${
                  l?.basics?.oldPriceSize === "Normal" ? "lg:flex-row" : ""
                } ${align === "center" ? "justify-center" : "justify-start"}`}
              >
                {listPrice && price && listPrice > price && (
                  <p
                    class={`line-through text-base-300 text-xs  ${
                      l?.basics?.oldPriceSize === "Normal" ? "lg:text-xl" : ""
                    }`}
                  >
                    {formatPrice(listPrice, offers!.priceCurrency!)}
                  </p>
                )}
                <p class="text-primary text-sm">
                  {formatPrice(price, offers!.priceCurrency!)}
                </p>
              </div>
              {l?.hide.installments
                ? (
                  ""
                )
                : (
                  <>
                    {installment_text
                      ? (
                        <div class="text-xs font-normal text-base-content mt-[5px]">
                          em até {installment_text}
                        </div>
                      )
                      : null}
                  </>
                )}
            </div>
          )}

        {/* SKU Selector */}
        {l?.elementsPositions?.skuSelector === "Bottom" && (
          <>
            {l?.hide.skuSelector
              ? (
                ""
              )
              : (
                <ul
                  class={`flex items-center gap-2 w-full ${
                    align === "center" ? "justify-center" : "justify-start"
                  } ${l?.onMouseOver?.showSkuSelector ? "lg:hidden" : ""}`}
                >
                  {skuSelector}
                </ul>
              )}
          </>
        )}

        <div
          class={`w-full flex flex-col mt-[10px]
          ${
            l?.onMouseOver?.showSkuSelector || l?.onMouseOver?.showCta
              // ? "transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
              ? "transition-opacity opacity-100"
              : "lg:hidden"
          }
        `}
        >
          {l?.onMouseOver?.showCta && cta}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
