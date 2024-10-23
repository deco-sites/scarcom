import { ProductDetailsPage } from "apps/commerce/types.ts";

function SpecificationsTab(
  { page, state }: { page: ProductDetailsPage; state: boolean },
) {
  const { product: { additionalProperty, description } } = page;
  const specifications = additionalProperty &&
    additionalProperty.some((property) =>
      property.propertyID?.toLocaleLowerCase() === "specification"
    );

  return (
    <div class={`${state ? "flex" : "hidden"}`}>
      {specifications
        ? (
          <div class="not-italic font-semibold text-[14px] leading-[16px] text-[#848689]">
          </div>
        )
        : (
          <div
            class="not-italic font-semibold text-[14px] leading-[16px] text-[#848689]"
            dangerouslySetInnerHTML={{ __html: description ? description : "" }}
          />
        )}
    </div>
  );
}

export default SpecificationsTab;
