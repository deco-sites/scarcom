import Image from "apps/website/components/Image.tsx";
import { useState } from "preact/hooks";

interface Props {
  photoUrl?: string;
  initial: string;
}

/**
 * Foto do perfil Google; se falhar ao carregar (CORS/offline), usa inicial.
 */
export default function ReviewerAvatar(
  { photoUrl, initial }: Props,
) {
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(photoUrl) && !broken;

  return (
    <div class="w-10 h-10 rounded-full bg-base-200 overflow-hidden shrink-0">
      {showImg
        ? (
          <Image
            src={photoUrl!}
            alt=""
            width={40}
            height={40}
            class="w-10 h-10 object-cover"
            loading="lazy"
            onError={() => setBroken(true)}
          />
        )
        : (
          <span
            class="flex items-center justify-center w-full h-full text-sm font-semibold text-base-content/70"
            aria-hidden={Boolean(showImg)}
          >
            {initial}
          </span>
        )}
    </div>
  );
}
