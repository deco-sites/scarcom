import type { EditableProps as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import Modals from "$store/islands/HeaderModals.tsx";
import type { Product, Suggestion } from "apps/commerce/types.ts";
// import type { Image } from "deco-sites/std/components/types.ts";
import { headerHeight } from "./constants.ts";
import { type LoaderReturnType } from "@deco/deco";
export interface NavItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;
  image?: {
    src?: string;
    alt?: string;
  };
}
export interface Props {
  /** @title Search Bar */
  searchbar?: SearchbarProps;
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: NavItem[];
  /**
   * @title Product suggestions
   * @description Product suggestions displayed on search
   */
  products?: LoaderReturnType<Product[] | null>;
  /**
   * @title Enable Top Search terms
   */
  suggestions?: LoaderReturnType<Suggestion | null>;
}
function Header({
  searchbar: _searchbar,
  // products,
  navItems = [],
  // suggestions,
}: Props) {
  // const searchbar = { ..._searchbar, products, suggestions };
  return (
    <>
      <header style={{ height: headerHeight }}>
        <div class="bg-base-100 fixed w-full z-50">
        </div>

        <Modals menu={{ items: navItems }} />
      </header>
    </>
  );
}
export default Header;
