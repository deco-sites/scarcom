// import { useSignal } from "@preact/signals";
// import type { JSX } from "preact";

// export interface Props {
//   /**
//    * @title Titulo do Formulário
//    * @description Coloque sua Titulo do Formulário.
//    */
//   titleForm?: string;
//   /**
//    * @title Success Message
//    * @description Coloque sua menssagem de sucesso.
//    */
//   successMessage?: string;

//     /**
//    * @title Form Data
//    * @description Os dados do formulário.
//    */
//     formData?: FormProps;
// }

// export interface FormProps {
//   nome: string;
//   email: string;
//   telefoneDDD: string;
//   telefone: string;
//   celularDDD: string;
//   celular: string;
//   pedido: string;
//   cnpj: string;
//   mensagem: string;
//   loja: string;
// }

// function CustomerForm(props: Props) {
//   const loading = useSignal(false);
//   const success = useSignal(false);

//   const getFormData = (form: HTMLFormElement): FormProps => ({
//     nome: (form.elements.namedItem("nome") as RadioNodeList)?.value,
//     email: (form.elements.namedItem("email") as RadioNodeList)?.value,
//     telefoneDDD: (form.elements.namedItem("telefoneDDD") as RadioNodeList)
//       ?.value,
//     telefone: (form.elements.namedItem("telefone") as RadioNodeList)?.value,
//     celularDDD: (form.elements.namedItem("celularDDD") as RadioNodeList)?.value,
//     celular: (form.elements.namedItem("celular") as RadioNodeList)?.value,
//     pedido: (form.elements.namedItem("pedido") as RadioNodeList)?.value,
//     cnpj: (form.elements.namedItem("cnpj") as RadioNodeList)?.value,
//     mensagem: (form.elements.namedItem("mensagem") as RadioNodeList)?.value,
//     loja: (form.elements.namedItem("loja") as RadioNodeList)?.value,
//   });

//   const handleSubmit = async (
//     e: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>,
//   ) => {
//     e.preventDefault();
//     loading.value = true;

//     try {
//       const form = getFormData(e.currentTarget);
//       console.log("Dados coletados", form);

//       const response = await fetch("/api/dataentities/RF/documents", {
//         method: "POST",
//         body: JSON.stringify(form),
//         headers: {
//           "content-type": "application/json",
//           "accept": "application/json",
//         },
//       });

//       console.log("response", response);
//       console.log("response body", response.body);

//       if (!response.ok) {
//         throw new Error("Erro ao enviar formulário.");
//       }

//       success.value = true;
//     } catch (error) {
//       console.error(error);
//     } finally {
//       loading.value = false;
//       setTimeout(() => (success.value = false), 5000);
//     }
//   };

//   return (
//     <div class="my-16 container">
//       <h1 class="text-secondary text-[28px] font-medium leading-[36.4px] mb-5 border-b border-neutral-100 pb-[10px] md:block">
//         {props.titleForm ?? "Formulário de Cadastro"}
//       </h1>
//       {success.value
//         ? (
//           <div class="text-base text-center lg:text-xl text-accent min-h-[400px]">
//             {props.successMessage ??
//               "Sua mensagem foi enviada, obrigado por entrar em contato conosco."}
//           </div>
//         )
//         : (
//           <form onSubmit={handleSubmit} class="text-sm flex flex-col gap-5">
//             {/* <div class="flex flex-col gap-5 lg:flex-row">
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="assunto"
//                 >
//                   Assunto*
//                 </label>
//                 <div class="flex gap-[10px]">
//                   <select
//                     required
//                     id="assunto"
//                     name="assunto"
//                     class="select select-bordered select-xs h-[34px] w-full border-2 border-neutral-100 text-currentColor font-semibold font-normal !outline-none"
//                   >
//                     <option disabled selected>
//                       Tipo de solicitação
//                     </option>
//                     <option value="Esclarecer uma dúvida">
//                       Esclarecer uma dúvida
//                     </option>
//                     <option value="Troca e devolução">
//                       Troca e devolução
//                     </option>
//                     <option value="Cancelamento">
//                       Cancelamento
//                     </option>
//                   </select>
//                 </div>
//               </div>
//             </div> */}
//             <div class="flex flex-col gap-5 lg:flex-row">
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="nome"
//                 >
//                   Nome*
//                 </label>
//                 <input
//                   required
//                   id="nome"
//                   placeholder="Digite seu nome"
//                   name="nome"
//                   type="text"
//                   class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
//                 />
//               </div>
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="email"
//                 >
//                   Email*
//                 </label>
//                 <input
//                   required
//                   id="email"
//                   placeholder="Digite seu e-mail"
//                   name="email"
//                   type="email"
//                   class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
//                 />
//               </div>
//             </div>
//             <div class="flex flex-col gap-5 lg:flex-row">
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="telefoneDDD"
//                 >
//                   Telefone*
//                 </label>
//                 <div class="flex gap-[10px]">
//                   <input
//                     required
//                     maxLength={3}
//                     placeholder="DDD"
//                     id="telefoneDDD"
//                     name="telefoneDDD"
//                     type="text"
//                     class="input input-bordered input-xs h-[34px] w-16 border-2 border-neutral-100 !outline-none"
//                   />
//                   <input
//                     required
//                     maxLength={9}
//                     placeholder="Digite seu telefone"
//                     name="telefone"
//                     type="text"
//                     class="input input-bordered input-xs h-[34px] w-full border-2 border-neutral-100 !outline-none"
//                   />
//                 </div>
//               </div>
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="celularDDD"
//                 >
//                   Celular
//                 </label>
//                 <div class="flex gap-[10px]">
//                   <input
//                     maxLength={3}
//                     placeholder="DDD"
//                     id="celularDDD"
//                     name="celularDDD"
//                     type="text"
//                     class="input input-bordered input-xs h-[34px] w-16 border-2 border-neutral-100 !outline-none"
//                   />
//                   <input
//                     maxLength={9}
//                     placeholder="Digite seu celular"
//                     name="celular"
//                     type="text"
//                     class="input input-bordered input-xs h-[34px] w-full border-2 border-neutral-100 !outline-none"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div class="flex flex-col gap-5 lg:flex-row">
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="loja"
//                 >
//                   Selecione a loja
//                 </label>
//                 <div class="flex gap-[10px]">
//                   <select
//                     id="loja"
//                     name="loja"
//                     class="select select-bordered select-xs h-[34px] w-full border-2 border-neutral-100 text-currentColor font-semibold font-normal"
//                   >
//                     <option disabled selected>
//                       Selecione a loja
//                     </option>
//                     <option value="virtual">Loja virtual</option>
//                     <option value="fisica">Loja física</option>
//                   </select>
//                 </div>
//               </div>
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="cnpj"
//                 >
//                   CNPJ
//                 </label>
//                 <div class="flex gap-[10px]">
//                   <input
//                     id="cnpj"
//                     placeholder="Digite seu CNPJ"
//                     name="cnpj"
//                     type="text"
//                     class="input input-bordered input-xs h-[34px] w-full border-2 border-neutral-100 !outline-none"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div class="flex flex-col gap-5 lg:flex-row">
//               <div class="form-control gap-[10px] w-full">
//                 <label
//                   class="font-medium text-currentColor font-semibold"
//                   htmlFor="pedido"
//                 >
//                   Número do Pedido
//                 </label>
//                 <div class="flex gap-[10px]">
//                   <input
//                     id="pedido"
//                     placeholder="Digite o número do seu pedido"
//                     name="pedido"
//                     type="text"
//                     class="input input-bordered input-xs h-[34px] w-full border-2 border-neutral-100 !outline-none"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div class="form-control gap-[10px]">
//               <label
//                 class="font-medium text-currentColor font-semibold"
//                 htmlFor="mensagem"
//               >
//                 Mensagem*
//               </label>
//               <textarea
//                 required
//                 id="mensagem"
//                 placeholder="Digite aqui sua mensagem"
//                 name="mensagem"
//                 class="textarea textarea-bordered textarea-xs h-28 border-2 border-neutral-100 !outline-none w-full"
//               />
//             </div>
//             <div class="flex justify-start mt-2">
//               <button
//                 class="btn btn-primary md:btn-sm text-white min-h-[48px] w-24 border-0 rounded-none text-[13px] tracking-[1.4px] disabled:loading disabled:btn-disabled"
//                 disabled={loading.value}
//               >
//                 {loading.value ? "Enviando..." : "Enviar"}
//               </button>
//             </div>
//           </form>
//         )}
//     </div>
//   );
// }

// export default CustomerForm;
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

export interface Props {
  /**
   * @title Titulo do Formulário
   * @description Coloque sua Titulo do Formulário.
   */
  titleForm?: string;
  /**
   * @title Success Message
   * @description Coloque sua menssagem de sucesso.
   */
  successMessage?: string;

  /**
   * @title Form Data
   * @description Os dados do formulário.
   */
  formData?: FormProps;
}

export interface FormProps {
  razaoSocial: string;
  cnpj: string;
  inscricaoSocial: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  contatoFinanceiro: string;
}

function CustomerForm(props: Props) {
  const loading = useSignal(false);
  const success = useSignal(false);

  const getFormData = (form: HTMLFormElement): FormProps => ({
    razaoSocial: (form.elements.namedItem("razaoSocial") as RadioNodeList)
      ?.value,
    cnpj: (form.elements.namedItem("cnpj") as RadioNodeList)?.value,
    inscricaoSocial:
      (form.elements.namedItem("inscricaoSocial") as RadioNodeList)?.value,
    cep: (form.elements.namedItem("cep") as RadioNodeList)?.value,
    logradouro: (form.elements.namedItem("logradouro") as RadioNodeList)?.value,
    numero: (form.elements.namedItem("numero") as RadioNodeList)?.value,
    complemento: (form.elements.namedItem("complemento") as RadioNodeList)
      ?.value,
    bairro: (form.elements.namedItem("bairro") as RadioNodeList)?.value,
    cidade: (form.elements.namedItem("cidade") as RadioNodeList)?.value,
    estado: (form.elements.namedItem("estado") as RadioNodeList)?.value,
    telefone: (form.elements.namedItem("telefone") as RadioNodeList)?.value,
    email: (form.elements.namedItem("email") as RadioNodeList)?.value,
    contatoFinanceiro:
      (form.elements.namedItem("contatoFinanceiro") as RadioNodeList)?.value,
  });

  const handleSubmit = async (
    e: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();
    loading.value = true;

    try {
      const form = getFormData(e.currentTarget);
      console.log("Dados coletados", form);

      const response = await fetch("/api/dataentities/RF/documents", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "content-type": "application/json",
          "accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar formulário.");
      }

      success.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
      setTimeout(() => (success.value = false), 5000);
    }
  };

  return (
    <div class="my-16 container">
      <h1 class="text-secondary text-[28px] font-medium leading-[36.4px] mb-5 border-b border-neutral-100 pb-[10px] md:block">
        {props.titleForm ?? "Formulário de Cadastro"}
      </h1>
      {success.value
        ? (
          <div class="text-base text-center lg:text-xl text-accent min-h-[400px]">
            {props.successMessage ??
              "Sua mensagem foi enviada, obrigado por entrar em contato conosco."}
          </div>
        )
        : (
          <form onSubmit={handleSubmit} class="text-sm flex flex-col gap-5">
            <div class="flex flex-col gap-5 lg:flex-row">
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="razaoSocial"
                >
                  Razão Social*
                </label>
                <input
                  required
                  id="razaoSocial"
                  placeholder="Digite a razão social"
                  name="razaoSocial"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="cnpj"
                >
                  CNPJ*
                </label>
                <input
                  required
                  id="cnpj"
                  placeholder="Digite o CNPJ"
                  name="cnpj"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
            </div>

            <div class="flex flex-col gap-5 lg:flex-row">
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="inscricaoSocial"
                >
                  Inscrição Social*
                </label>
                <input
                  required
                  id="inscricaoSocial"
                  placeholder="Digite a inscrição social"
                  name="inscricaoSocial"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="cep"
                >
                  CEP*
                </label>
                <input
                  required
                  id="cep"
                  placeholder="Digite o CEP"
                  name="cep"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
            </div>

            <div class="flex flex-col gap-5 lg:flex-row">
              <div class="form-control gap-[10px] w-full">
                <h3 class="font-medium text-currentColor font-semibold">
                  Endereço
                </h3>
              </div>
            </div>

            <div class="flex flex-col gap-5 lg:flex-row">
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="logradouro"
                >
                  Logradouro*
                </label>
                <input
                  required
                  id="logradouro"
                  placeholder="Digite o logradouro"
                  name="logradouro"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="numero"
                >
                  Número*
                </label>
                <input
                  required
                  id="numero"
                  placeholder="Digite o número"
                  name="numero"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="complemento"
                >
                  Complemento
                </label>
                <input
                  id="complemento"
                  placeholder="Digite o complemento"
                  name="complemento"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
            </div>

            <div class="flex flex-col gap-5 lg:flex-row">
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="estado"
                >
                  Estado*
                </label>
                <input
                  required
                  id="estado"
                  placeholder="Digite o estado"
                  name="estado"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="cidade"
                >
                  Cidade*
                </label>
                <input
                  required
                  id="cidade"
                  placeholder="Digite a cidade"
                  name="cidade"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
              <div class="form-control gap-[10px] w-full">
                <label
                  class="font-medium text-currentColor font-semibold"
                  htmlFor="bairro"
                >
                  Bairro*
                </label>
                <input
                  required
                  id="bairro"
                  placeholder="Digite o bairro"
                  name="bairro"
                  type="text"
                  class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
                />
              </div>
            </div>

            <div class="form-control gap-[10px] w-full">
              <label
                class="font-medium text-currentColor font-semibold"
                htmlFor="telefone"
              >
                Telefone*
              </label>
              <input
                required
                id="telefone"
                placeholder="Digite o telefone"
                name="telefone"
                type="text"
                class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
              />
            </div>

            <div class="form-control gap-[10px] w-full">
              <label
                class="font-medium text-currentColor font-semibold"
                htmlFor="email"
              >
                Email*
              </label>
              <input
                required
                id="email"
                placeholder="Digite o email"
                name="email"
                type="email"
                class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
              />
            </div>

            <div class="form-control gap-[10px] w-full">
              <label
                class="font-medium text-currentColor font-semibold"
                htmlFor="contatoFinanceiro"
              >
                Contato Financeiro*
              </label>
              <input
                required
                id="contatoFinanceiro"
                placeholder="Digite o contato financeiro"
                name="contatoFinanceiro"
                type="text"
                class="input input-bordered input-xs h-[34px] border-2 border-neutral-100 !outline-none"
              />
            </div>

            <div class="flex justify-start mt-2">
              <button
                class="btn btn-primary md:btn-sm text-white min-h-[48px] w-24 border-0 rounded-none text-[13px] tracking-[1.4px] disabled:loading disabled:btn-disabled"
                disabled={loading.value}
              >
                {loading.value ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        )}
    </div>
  );
}

export default CustomerForm;
