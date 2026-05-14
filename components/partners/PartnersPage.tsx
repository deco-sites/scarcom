import { ImageWidget } from "apps/admin/widgets.ts";

export interface PartnersLogo {
    image: ImageWidget;
    alt: string;
}

export interface Props {
    /**
     * @title Segmentos de Atuação
     */
    segments?: string[];
    /**
     * @title Logos dos parceiros
     */
    logos?: PartnersLogo[];
}

export default function PartnersPage({ segments, logos }: Props) {
  return (
    <div>
      <div>
        <div>
            <div>
                <p>125+</p>
                <p>Parceiros Ativos</p>
            </div>
            <div>
                <p>+6</p>
                <p>Segmentos</p>
            </div>
            <div>
                <p>15</p>
                <p>Anos de Experiência</p>
            </div>
            <div>
                <p>98%</p>
                <p>Satisfação</p>
            </div>
        </div>
        <div>
            <div>
                <h1>
                    <img src="" alt="" />
                    Empresas que confiam na Scarcom
                </h1>
                <p>Trabalhamos com as principais marcas do mercado, oferecendo soluções integradas em tecnologia, comunicação e inovação.</p>
            </div>
            <div>
                <div>
                    {segments?.map((segment) => (
                        <div>
                            <button type='button'>
                                {segment}
                                <p>125</p>
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    <p>Exibindo 125 empresas</p>
                </div>
            </div>
            <div>
                <div>
                    <ul>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                        <li>
                            <img src="" alt="" />
                        </li>
                    </ul>
                </div>
                <button type='button'>Ver mais parceiros</button>
            </div>
        </div>
      </div>
      <div>
        <div>
            <p>Sobre Nossas Parcerias</p>
            <h1>Parceiros e Marcas da Scarcom</h1>
            <p>
                A Scarcom mantém parcerias estratégicas com as marcas líderes do mercado brasileiro e internacional, consolidando sua posição como referência em soluções tecnológicas e inovação empresarial. Nossa rede de parceiros abrange diferentes segmentos, desde tecnologia e varejo até indústria, saúde e serviços especializados. Essa diversidade nos permite oferecer uma integração de sistemas robusta e eficiente, atendendo às demandas específicas de cada setor com excelência e comprometimento. Trabalhamos constantemente para expandir nossa base de colaboradores e fortalecer relacionamentos duradouros que beneficiem nossos clientes.

                Através da integração de sistemas avançados e do trabalho conjunto com parceiros estratégicos, a Scarcom desenvolve soluções personalizadas que impulsionam a transformação digital das empresas. Nossa expertise em tecnologia, combinada com o conhecimento profundo dos nossos parceiros, permite criar ecossistemas de negócios integrados, escaláveis e preparados para os desafios do futuro. Cada parceria é cuidadosamente selecionada para garantir alinhamento de valores, qualidade de entrega e inovação contínua. Acreditamos que a colaboração com marcas líderes é fundamental para oferecer as melhores soluções tecnológicas aos nossos clientes.
            </p>
        </div>
      </div>
    </div>
  );
}