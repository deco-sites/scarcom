import { useId } from "preact/hooks";
import Slider from "./Slider.tsx";

export interface ButtonSliderItem {
  text: string;
  href: string;
  external?: boolean;
}

export interface Props {
  items: ButtonSliderItem[];
  className?: string;
  buttonClassName?: string;
  isMobile?: boolean;
}

export default function ResponsiveButtonSlider({
  items,
  className = "mb-16 mt-5",
  buttonClassName =
    "rounded-full border-2 border-primary px-10 py-2 font-bold text-primary transition-colors duration-300 ease-out hover:bg-primary hover:text-white",
  isMobile = false,
}: Props) {
  const id = useId();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div class={className}>
      {!isMobile && (
        <div class="container hidden flex-wrap gap-4 px-5 md:flex">
          {items.map(({ text, href, external }) => (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              class={buttonClassName}
            >
              {text}
            </a>
          ))}
        </div>
      )}

      {isMobile && (
        <div class="md:hidden">
          <div id={id} class="relative">
            <Slider class="carousel carousel-center w-full gap-4 overflow-x-auto pl-5 pr-5">
              {items.map((item, index) => (
                <Slider.Item index={index} class="carousel-item">
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    class={`${buttonClassName} whitespace-nowrap`}
                  >
                    {item.text}
                  </a>
                </Slider.Item>
              ))}
            </Slider>
            <Slider.JS rootId={id} />
          </div>
        </div>
      )}
    </div>
  );
}
