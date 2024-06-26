import Button from "../../components/ui/Button.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { useSignal } from "@preact/signals";
import type { ImageObject } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  images: ImageObject[];
  width: number;
  height: number;
}

const id = "product-zoom";

function ProductImageZoom({ images, width, height }: Props) {
  const open = useSignal(false);

  return (
    <>
      <Button
        class="hidden sm:inline-flex btn-ghost"
        onClick={() => open.value = true}
      >
        <Icon id="MagnifyingGlass" size={20} />
      </Button>
      <Modal
        loading="lazy"
        mode="center"
        showHeader
        open={open.value}
        onClose={() => {
          open.value = false;
        }}
      >
        <div class="relative" id={id}>
          <Slider class="carousel w-screen overflow-y-auto">
            {images.map((image, index) => (
              <Slider.Item index={index} class="carousel-item w-full">
                <Image
                  style={{ aspectRatio: `${width} / ${height}` }}
                  src={image.url!}
                  alt={image.alternateName}
                  width={width}
                  height={height}
                />
              </Slider.Item>
            ))}
          </Slider>

          <Slider.PrevButton class="btn btn-circle btn-outline absolute left-8 top-[50vh]">
            <Icon size={20} id="ChevronLeft" strokeWidth={3} />
          </Slider.PrevButton>
          <Slider.NextButton class="btn btn-circle btn-outline absolute right-8 top-[50vh]">
            <Icon size={20} id="ChevronRight" strokeWidth={3} />
          </Slider.NextButton>
        </div>
        <Slider.JS rootId={id} />
      </Modal>
    </>
  );
}

export default ProductImageZoom;
