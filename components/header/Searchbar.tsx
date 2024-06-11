import { lazy, Suspense } from "preact/compat";

import { useUI } from "../../sdk/useUI.ts";
import { headerHeight } from "../../components/header/constants.ts";
import type { Props as SearchbarProps } from "../../components/search/Searchbar.tsx";

const LazySearchbar = lazy(() =>
  import("../../components/search/Searchbar.tsx")
);

interface Props {
  searchbar: SearchbarProps;
}

function Searchbar({ searchbar }: Props) {
  const { displaySearchbar } = useUI();
  const open = displaySearchbar.value;

  return (
    <div
      class={`${
        open ? "block border-y border-base-200 shadow" : "hidden"
      } absolute left-0 top-0 w-screen z-50 bg-base-100`}
      style={{ marginTop: 91 }}
    >
      {open && (
        <Suspense fallback={<span class="loading loading-ring" />}>
          <LazySearchbar {...searchbar} variant="desktop" />
        </Suspense>
      )}
    </div>
  );
}

export default Searchbar;
