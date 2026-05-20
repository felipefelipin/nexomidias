import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { Resend } from "https://esm.sh/resend";
import qrcode from "https://esm.sh/qrcode-generator@1.4.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 58;
const RIGHT_X = PAGE_WIDTH - MARGIN_X;
const CONTENT_WIDTH = RIGHT_X - MARGIN_X;

const TYPO = {
  title: 16,
  section: 13,
  body: 11,
  bodySmall: 10,
  meta: 9,
  tiny: 7.5,
  lineHeight: 15,
  lineHeightSmall: 12.5,
};

const COLORS = {
  black: rgb(0, 0, 0),
  text: rgb(0.08, 0.08, 0.08),
  muted: rgb(0.4, 0.4, 0.4),
  soft: rgb(0.55, 0.55, 0.55),
  divider: rgb(0.87, 0.87, 0.87),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const body = await req.json();

    const {
      file_path,
      original_name,
      full_name,
      email,
      birth_date,
      cpf_cnpj,
      pix_key,
      city,
      description,
      recorded_by_user,
      social_handle,
      platform,
      signature,
      signature_hash,
      contract_hash,
      contract_version,
      accepted_at,
      ip_address,
      user_agent,
      user_id,
    } = body;

    if (!file_path) throw new Error("Campo obrigatório ausente: file_path");
    if (!original_name) throw new Error("Campo obrigatório ausente: original_name");
    if (!full_name) throw new Error("Campo obrigatório ausente: full_name");
    if (!email) throw new Error("Campo obrigatório ausente: email");
    if (!signature) throw new Error("Campo obrigatório ausente: signature");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl) throw new Error("Secret ausente: SUPABASE_URL");
    if (!supabaseServiceRoleKey) throw new Error("Secret ausente: SUPABASE_SERVICE_ROLE_KEY");
    if (!resendApiKey) throw new Error("Secret ausente: RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const resend = new Resend(resendApiKey);

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const safeFullName = sanitizePdfText(full_name);
    const safeEmail = sanitizePdfText(email);
    const safeBirthDate = formatDateBR(birth_date);
    const safeCpfCnpj = sanitizePdfText(cpf_cnpj);
    const safeOriginalName = sanitizePdfText(original_name);
    const safeDescription = sanitizeMultilinePdfText(description);
    const safeUserAgent = sanitizePdfText(user_agent);
    const safeIpAddress = sanitizePdfText(getClientIp(req, ip_address));
    const safePixKey = sanitizePdfText(pix_key);
    const safeCity = sanitizePdfText(city);
    const safeSocialHandle = sanitizePdfText(social_handle);
    const safePlatform = sanitizePdfText(platform);
    const safeRecordedByUser = recorded_by_user ? "Sim" : "Não";
    const safeWhoRecordedVideo = recorded_by_user ? safeFullName : "-";
    const safeWantsCredits = safeSocialHandle ? "Sim" : "-";
    const safeNoExclusivity = "Sim";
    const safeContentGuidelines = "Sim";

    const contractId = crypto.randomUUID();
    const acceptedDate = formatDateBR(accepted_at);
    const acceptedTime = formatTimeBR(accepted_at);
    const acceptedDateTime = formatDateTimeBR(accepted_at);

    const { data: videoUrlData } = supabase.storage.from("videos").getPublicUrl(file_path);
    const videoPublicUrl = videoUrlData?.publicUrl ?? file_path;

    // -----------------------------------------------------------------------
    // ASSETS FIXOS
    // -----------------------------------------------------------------------
    const logoImage = await tryLoadImageFromBucket(pdfDoc, supabase, "assets", "logoofc.png");
    const felipeSignatureImage = await tryLoadImageFromBucket(
      pdfDoc,
      supabase,
      "assets",
      "assinatura-felipe.png",
    );
    const mariaSignatureImage = await tryLoadImageFromBucket(
      pdfDoc,
      supabase,
      "assets",
      "assinatura-maria-fatima.png",
    );

    // -----------------------------------------------------------------------
    // LOGO PARA E-MAIL (URL PÚBLICA)
    // -----------------------------------------------------------------------
    const { data: logoPublicData } = supabase.storage
      .from("public_assets")
      .getPublicUrl("logoofc.png");

    const logoEmailUrl = logoPublicData?.publicUrl ?? "";

    // -----------------------------------------------------------------------
    // ASSINATURA DO USUÁRIO
    // -----------------------------------------------------------------------
    const { data: signatureFile, error: signatureDownloadError } = await supabase.storage
      .from("signatures")
      .download(signature);

    if (signatureDownloadError) {
      throw new Error(`Erro ao baixar assinatura: ${signatureDownloadError.message}`);
    }

    const signatureBytes = new Uint8Array(await signatureFile.arrayBuffer());

    let signatureImage;
    const signatureLower = String(signature).toLowerCase();

    if (signatureLower.endsWith(".png")) {
      signatureImage = await pdfDoc.embedPng(signatureBytes);
    } else if (signatureLower.endsWith(".jpg") || signatureLower.endsWith(".jpeg")) {
      signatureImage = await pdfDoc.embedJpg(signatureBytes);
    } else {
      throw new Error("Formato de assinatura não suportado. Use PNG ou JPG.");
    }

    // =========================================================================
    // PÁGINA 1
    // =========================================================================
    {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = 792;

      if (logoImage) {
        const { width, height } = fitImage(logoImage, 390, 180);
        page.drawImage(logoImage, {
          x: (PAGE_WIDTH - width) / 2,
          y: 700,
          width,
          height,
        });
        y = 710;
      }

      drawCenteredText(page, "CONTRATO DE CESSÃO DE DIREITOS AUTORAIS", {
        y,
        font: bold,
        size: TYPO.title,
      });

      y -= 36;

      y = drawWrappedText(page, {
        text:
          `Cedente: ${safeFullName}, inscrito no CPF/CNPJ ${safeCpfCnpj}, nascido(a) no dia ${safeBirthDate}, ` +
          `titular do endereço eletrônico ${safeEmail}.`,
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      y = drawWrappedText(page, {
        text:
          "Cessionário: NEXO MIDIAS LTDA, inscrita no CNPJ 62.895.781/0001-87, " +
          "com sede à Rua Dona Luzia Patrocínio, nº 54, Andar Superior, Centro, Frei Lagonegro/MG, " +
          "CEP: 39.708-000, representada por seu sócio administrador, Felipe Gomes Pimentel, " +
          "CPF: 162.214.316-70.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 16;

      y = drawWrappedText(page, {
        text:
          "Pelo presente instrumento particular, as partes acima qualificadas, têm justo e acertado na melhor forma " +
          "de direito este CONTRATO DE CESSÃO DE DIREITOS AUTORAIS, que se regerá pelas cláusulas e condições " +
          "seguintes, que mutuamente aceitam.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 22;

      drawCenteredText(page, "OBJETO DO CONTRATO", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 22;

      y = drawWrappedText(page, {
        text:
          '1.1 O presente contrato tem por objeto a cessão dos direitos autorais sobre o(s) vídeo(s) viral(ais) criado(s) ' +
          'pelo Cedente, doravante denominado "Obra", pelo Cedente ao Cessionário, nos termos da legislação vigente.',
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "1.2 O Cedente declara ciência de que o Cessionário poderá ou não fazer uso do material enviado pelo Cedente, " +
          "ficando a exclusivo encargo do Cessionário essa decisão.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      y = drawWrappedText(page, {
        text: `Link de acesso da "Obra": ${sanitizePdfText(videoPublicUrl)}`,
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.bodySmall,
        lineHeight: 13.5,
      });

      y -= 20;

      drawCenteredText(page, "DIREITOS CEDIDOS", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 22;

      y = drawWrappedText(page, {
        text:
          "2.1 O Cedente cede ao Cessionário todos os direitos patrimoniais de autor referentes à Obra, incluindo, mas " +
          "não se limitando a, direitos de reprodução, distribuição, comunicação ao público, edição, adaptação, tradução, " +
          "entre outros.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "2.2 Para todos os efeitos, o Cedente continua sendo proprietário do material cedido, não havendo transferência " +
          "da propriedade, mas sim, a cessão dos direitos autorais, concedendo uma licença exclusiva e por prazo " +
          "indeterminado ao Cessionário para utilização do material, nos termos do presente instrumento.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 20;

      drawCenteredText(page, "EXTENSÃO DA CESSÃO", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 22;

      y = drawWrappedText(page, {
        text:
          "3.1 A cessão dos direitos autorais será válida para todo o território nacional e internacional, por prazo " +
          "indeterminado, contado a partir da assinatura deste contrato.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 20;

      drawCenteredText(page, "DA CONTRAPARTIDA", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 22;

      drawWrappedText(page, {
        text:
          "4.1 Em contrapartida à cessão dos direitos autorais, o Cessionário fará a exposição do nome do Cedente ou o " +
          "identificador das redes sociais (@), concedendo expressa e publicamente os créditos ao Cedente.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });
    }

    // =========================================================================
    // PÁGINA 2
    // =========================================================================
    {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = 785;

      drawCenteredText(page, "DA CESSÃO A TÍTULO ONEROSO", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "5.1 O Cedente declara ter cedido a Obra para o Cessionário a título oneroso, havendo, a título de compensação, " +
          "exclusivamente a contrapartida prevista no item anterior, sem que disso seja devido ao Cedente qualquer " +
          "remuneração ou reembolso pecuniário.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 24;

      drawCenteredText(page, "DA EXCLUSIVIDADE NO USO DO MATERIAL PELO CESSIONÁRIO", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "6.1 O Cedente se compromete a não licenciar a obra para nenhuma empresa além do Cessionário, " +
          "cedendo o material exclusivamente ao Cessionário.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text: "6.2 O Cedente poderá continuar fazendo uso pessoal da obra em todas as suas redes sociais.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 24;

      drawCenteredText(page, "RESPONSABILIDADES DO CEDENTE", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "7.1 O Cedente declara ser o único e legítimo titular dos direitos autorais sobre a Obra, responsabilizando-se " +
          "pela garantia de sua originalidade e ausência de violação a direitos de terceiros. São obrigações do Cedente:",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      const itemsPage2 = [
        "1. ceder os direitos livres e desembaraçados de quaisquer ônus, na data e prazo estipulados neste contrato;",
        "2. ceder, de forma irrevogável e irretratável, o direito ao uso da imagem e voz constante na obra cedida;",
        "3. enviar o vídeo com a melhor qualidade possível, conforme orientações do Cessionário, sob pena de não ser utilizado pelo Cessionário;",
        "4. garantir que possui autorização para uso da imagem e da voz de terceiros que eventualmente apareçam no vídeo cedido, isentando o Cessionário de qualquer responsabilidade a este título;",
        "5. garantir que a obra cedida não tenha conteúdos de nudez, pornografia infantil, violência extrema (com sangue), bem como outros conteúdos que são vedados pelas mídias digitais e mídias tradicionais;",
        "6. informar o Cessionário sobre quaisquer ônus ou quaisquer outros fatos, ações ou medidas administrativas que possam atingir os direitos autorais da obra objeto deste contrato;",
        "7. realizar as diligências e prestar toda assistência necessária ao Cessionário para que esse possa se valer dos direitos autorais cedidos, na forma e para as finalidades previstas neste contrato;",
        "8. se responsabilizar integralmente por todos e quaisquer danos causados ao Cessionário e a terceiros em decorrência da violação de quaisquer direitos, inclusive de propriedade intelectual e de produção de conteúdo violador, havendo direito de regresso do Cessionário contra o Cedente, caso o Cessionário seja prejudicado pelo material disponibilizado pelo Cedente;",
        "9. assumir ampla e total responsabilidade civil e penal, quanto ao conteúdo, citações, referências e outros elementos que fazem parte da Obra;",
        "10. concordar que os dados pessoais fornecidos no formulário serão utilizados neste instrumento, para fins exclusivos de identificação do Cedente, sem necessidade de transcrição;",
        "11. a assinatura digital feita no formulário equivale à sua assinatura manual, para todos os fins de direito;",
        "12. manter em sigilo absoluto todas as informações adquiridas em razão da presente contratação, fornecidas pelo Cessionário ou por terceiros;",
      ];

      for (const item of itemsPage2) {
        y = drawWrappedText(page, {
          text: item,
          x: MARGIN_X + 8,
          y,
          maxWidth: CONTENT_WIDTH - 8,
          font,
          size: 10.35,
          lineHeight: 13.3,
        });
        y -= 6;
      }
    }

    // =========================================================================
    // PÁGINA 3
    // =========================================================================
    {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = 785;

      y = drawWrappedText(page, {
        text:
          "7.2. O Cedente será civil e/ou criminalmente responsabilizado, em caso de violação de qualquer das obrigações " +
          "contratuais pelo Cedente, em caso de fornecimento de declarações e informações falsas e em caso de " +
          "necessidade de reparação pelos danos causados ao Cessionário, respondendo pela ação ou omissão " +
          "cometida, e em possível ação de regresso ou outra forma de recompor o dano, nos termos da Lei Civil vigente no País.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 24;

      drawCenteredText(page, "RESPONSABILIDADES DO CESSIONÁRIO", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "8.1 O Cessionário compromete-se a utilizar a Obra cedida de acordo com as disposições legais vigentes, " +
          "respeitando os direitos morais do Cedente e preservando a integridade e autoria da Obra.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "8.2 Caso decida fazer uso da obra cedida pelo Cedente, esta será utilizada somente pela empresa Cessionária " +
          "(NEXO MIDIAS LTDA), nos termos previstos nesse contrato.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "8.3 O Cessionário representará e promoverá a obra cedida pelo Cedente, buscando oportunidades de " +
          "licenciamentos, negociações e acordos com terceiros, monetizando re-uploads do conteúdo e tentando " +
          "gerar receita nos perfis do Cessionário.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      y = drawWrappedText(page, {
        text:
          "Parágrafo 1º. O Cedente tem ciência de que, apesar dos esforços do Cessionário, a promoção da obra " +
          "descrita no item anterior dependerá diretamente da receptividade e do momento do mercado, tratando-se de " +
          "condição externa a este contrato, variável e não relacionada ao Cessionário, em relação a qual o Cessionário " +
          "não se responsabilizará em hipótese alguma.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "Parágrafo 2º. O Cedente declara saber, desde já, que o retorno financeiro em relação à obra cedida é uma " +
          "possibilidade e não garantia, não tendo qualquer relação com a contrapartida prevista no item 4.1.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "O Cedente poderá consultar o Cessionário para saber se a obra disponibilizada gerou receita, via e-mail: " +
          "licenciamento@nexomidias.com.br.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "Parágrafo 3º. Em caso de efetivo licenciamento e monetização da obra cedida em valor que supere R$50,00 " +
          "(cinquenta reais) e desde que a obra cedida não esteja monetizada em um mesmo material juntamente com " +
          "outras obras, o Cedente fará jus ao pagamento de 50% (cinquenta por cento) das vendas de licenças para " +
          "terceiros e monetização de re-upload, a ser pago todo dia 15 pelo Cessionário.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 24;

      drawCenteredText(page, "DA PROTEÇÃO DE DADOS", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "9.1 As partes comprometem-se a adotar todas as medidas para garantir, por si, a privacidade e proteção de " +
          "todos os dados pessoais fornecidos em razão desse contrato, exclusivamente para atender a finalidade " +
          "específica da execução do presente contrato.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      y = drawWrappedText(page, {
        text:
          "9.2 As partes atuarão com os dados e informações de pessoas obtidos para a execução do presente contrato " +
          "conforme as exigências de tratamento de dados determinadas pela Lei nº 13.709/2018 – Lei Geral de Proteção " +
          "de Dados Pessoais – LGPD.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 24;

      drawCenteredText(page, "DISPOSIÇÕES GERAIS", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "10.1 O presente contrato é firmado em caráter irrevogável e irretratável, vinculando as partes, seus herdeiros e " +
          "sucessores a qualquer título, substituindo qualquer outro ajuste realizado entre as partes anteriormente, em " +
          "especial, eventuais conversas havidas entre Cedente e Cessionário em mensagens diretas de redes sociais (DM).",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 10;

      drawWrappedText(page, {
        text:
          "10.2 Qualquer modificação deste contrato será válida somente se realizada por escrito e assinada por ambas as partes.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });
    }

    // =========================================================================
    // PÁGINA 4
    // =========================================================================
    {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = 785;

      drawCenteredText(page, "FORO E ASSINATURAS", {
        y,
        font: bold,
        size: TYPO.section,
      });

      y -= 24;

      y = drawWrappedText(page, {
        text:
          "11.1 Fica eleito o foro da comarca de Belo Horizonte/MG para dirimir quaisquer questões oriundas deste " +
          "contrato, com renúncia a qualquer outro, por mais privilegiado que seja.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      y = drawWrappedText(page, {
        text:
          "11.2 As assinaturas do presente instrumento serão realizadas por ferramenta de assinatura digital, e constituem " +
          "obrigações válidas e exigíveis para todos os fins legais, representando a vontade de todos que o assinam, " +
          "como prova documental e título executivo extrajudicial, para todos os fins e efeitos.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      y = drawWrappedText(page, {
        text:
          "E, por estarem de acordo com todos os termos e condições deste contrato, as partes assinam em duas vias de " +
          "igual teor, na presença da testemunha abaixo.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 26;

      y = drawWrappedText(page, {
        text:
          `Cedente: ${safeFullName}, inscrito no CPF/CNPJ ${safeCpfCnpj}, nascido(a) no dia ${safeBirthDate}, ` +
          `titular do endereço eletrônico ${safeEmail}.`,
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 12;

      y = drawWrappedText(page, {
        text:
          "Cessionário: NEXO MIDIAS LTDA, inscrita no CNPJ 62.895.781/0001-87, com sede à Rua Dona Luzia " +
          "Patrocínio, nº 54, Andar Superior, Centro, Frei Lagonegro/MG, CEP: 39.708-000, representada por seu sócio " +
          "administrador, Felipe Gomes Pimentel, CPF: 162.214.316-70.",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 34;

      page.drawText("Testemunha", {
        x: MARGIN_X,
        y,
        size: TYPO.body,
        font: bold,
        color: COLORS.black,
      });

      y -= 28;

      const signatureBlockTopY = y;

      y = drawWrappedText(page, {
        text: "Nome: Maria de Fátima Pimentel",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 8;

      y = drawWrappedText(page, {
        text: "CPF: 039.820.236-29",
        x: MARGIN_X,
        y,
        maxWidth: CONTENT_WIDTH,
        font,
        size: TYPO.body,
        lineHeight: TYPO.lineHeight,
      });

      y -= 42;

      drawDivider(page, MARGIN_X, 280, y);

      if (mariaSignatureImage) {
        const { width, height } = fitImage(mariaSignatureImage, 210, 65);
        page.drawImage(mariaSignatureImage, {
          x: MARGIN_X,
          y: y + 10,
          width,
          height,
        });
      }

      page.drawText("Assinatura digital da testemunha", {
        x: MARGIN_X,
        y: y - 16,
        size: TYPO.meta,
        font,
        color: COLORS.muted,
      });

      page.drawText(`Data: ${acceptedDate}`, {
        x: 360,
        y: signatureBlockTopY + 10,
        size: TYPO.meta,
        font,
        color: COLORS.muted,
      });

      page.drawText(`Hora: ${acceptedTime}`, {
        x: 360,
        y: signatureBlockTopY - 8,
        size: TYPO.meta,
        font,
        color: COLORS.muted,
      });
    }

    // =========================================================================
    // PÁGINA 5 - PROTOCOLO DE ASSINATURAS
    // =========================================================================
    {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = 790;

      if (logoImage) {
        const { width, height } = fitImage(logoImage, 170, 70);
        page.drawImage(logoImage, {
          x: MARGIN_X,
          y: 760,
          width,
          height,
        });
      }

      page.drawText("Protocolo de Assinaturas", {
        x: 345,
        y: 790,
        size: TYPO.section,
        font: bold,
        color: COLORS.black,
      });

      y -= 10;
      drawDivider(page, MARGIN_X, RIGHT_X, y);

      y -= 24;
      drawLabelValue(page, bold, font, MARGIN_X, y, "Documento", "CONTRATO DE CESSÃO DE DIREITOS AUTORAIS - NEXO MIDIAS");
      y -= 22;
      drawLabelValue(page, bold, font, MARGIN_X, y, "Nome de arquivo", `${contractId}.pdf`);
      y -= 22;
      drawLabelValue(page, bold, font, MARGIN_X, y, "Identificação do documento", contractId);
      y -= 22;
      drawLabelValue(page, bold, font, MARGIN_X, y, "Formato de data da trilha de auditoria", "DD / MM / YYYY");
      y -= 22;
      drawLabelValue(page, bold, font, MARGIN_X, y, "Status", "Assinado e concluído");

      y -= 28;
      drawDivider(page, MARGIN_X, RIGHT_X, y);

      y -= 24;
      page.drawText("Histórico do documento", {
        x: MARGIN_X,
        y,
        size: 12,
        font: bold,
        color: COLORS.black,
      });

      y -= 28;

      y = drawAuditEntry(page, {
        label: "ENVIADO",
        date: acceptedDate,
        time: acceptedTime,
        text:
          `Enviado para assinatura de ${safeFullName} (${safeEmail}) e NEXO MIDIAS LTDA ` +
          `(licenciamento@nexomidias.com.br) por suporte@nexomidias.com.br\n` +
          `IP: ${safeIpAddress}`,
        x: MARGIN_X,
        y,
        font,
        bold,
      });

      y -= 18;

      const felipeEntryStart = y;
      y = drawAuditEntry(page, {
        label: "ASSINADO",
        date: acceptedDate,
        time: acceptedTime,
        text:
          "Assinado por Felipe Gomes Pimentel (licenciamento@nexomidias.com.br)\n" +
          `IP: ${safeIpAddress}\n` +
          "Assinatura:",
        x: MARGIN_X,
        y,
        font,
        bold,
      });

      if (felipeSignatureImage) {
        const { width, height } = fitImage(felipeSignatureImage, 125, 40);
        page.drawImage(felipeSignatureImage, {
          x: 332,
          y: felipeEntryStart - 54,
          width,
          height,
        });
      }

      y -= 18;

      const userEntryStartY = y;
      y = drawAuditEntry(page, {
        label: "ASSINADO",
        date: acceptedDate,
        time: acceptedTime,
        text:
          `Assinado por ${safeFullName} (${safeEmail})\n` +
          `IP: ${safeIpAddress}\n` +
          "Assinatura:",
        x: MARGIN_X,
        y,
        font,
        bold,
      });

      const sigDims = signatureImage.scale(1);
      const maxSignatureWidth = 140;
      const maxSignatureHeight = 48;
      const sigScale = Math.min(
        maxSignatureWidth / sigDims.width,
        maxSignatureHeight / sigDims.height,
        1,
      );
      const sigWidth = sigDims.width * sigScale;
      const sigHeight = sigDims.height * sigScale;

      page.drawImage(signatureImage, {
        x: 332,
        y: userEntryStartY - 54,
        width: sigWidth,
        height: sigHeight,
      });

      y -= 18;

      y = drawAuditEntry(page, {
        label: "CONCLUÍDO",
        date: acceptedDate,
        time: acceptedTime,
        text: "O documento foi concluído",
        x: MARGIN_X,
        y,
        font,
        bold,
      });

      y -= 26;
      drawDivider(page, MARGIN_X, RIGHT_X, y);

      y -= 18;

      const validationUrl = `https://nexomidias.com.br/contratos/${contractId}`;

      drawQrCode(page, {
        data: validationUrl,
        x: MARGIN_X,
        y: y - 84,
        size: 84,
      });

      drawWrappedText(page, {
        text:
          "A autenticidade deste documento pode ser conferida no link abaixo:\n" +
          validationUrl,
        x: MARGIN_X + 104,
        y: y - 8,
        maxWidth: 350,
        font,
        size: 9.5,
        lineHeight: 12.5,
      });

      page.drawText(`Gerado em: ${acceptedDateTime}`, {
        x: MARGIN_X,
        y: 28,
        size: 8,
        font,
        color: COLORS.muted,
      });

      page.drawText(`Hash assinatura: ${sanitizePdfText(signature_hash || "-")}`, {
        x: MARGIN_X,
        y: 16,
        size: TYPO.tiny,
        font,
        color: COLORS.muted,
      });

      page.drawText(`Hash contrato: ${sanitizePdfText(contract_hash || "-")}`, {
        x: 300,
        y: 16,
        size: TYPO.tiny,
        font,
        color: COLORS.muted,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const contractFileName = `${contractId}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("contracts")
      .upload(contractFileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Erro ao salvar PDF: ${uploadError.message}`);
    }

    const { data: contractUrlData } = supabase.storage
      .from("contracts")
      .getPublicUrl(contractFileName);

    const contract_url = contractUrlData?.publicUrl ?? null;

    const { data: signatureUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(signature);

    const signature_url = signatureUrlData?.publicUrl ?? null;

    const { data: inserted, error: insertError } = await supabase
      .from("videos")
      .insert({
        user_id,
        file_path,
        original_name,
        full_name,
        email,
        birth_date,
        cpf_cnpj,
        pix_key,
        city,
        description,
        recorded_by_user,
        social_handle,
        platform,
        signature,
        signature_hash,
        contract_hash,
        contract_version,
        accepted_at,
        ip_address: safeIpAddress,
        user_agent,
        status: "pending",
        signature_path: signature,
        signature_url,
        contract_path: contractFileName,
        contract_url,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Erro ao registrar no banco: ${insertError.message}`);
    }

    const emailHtml = `
  <div style="margin:0;padding:0;background:#ffffff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#ffffff;">
      <tr>
        <td align="center" style="padding:28px 16px 18px 16px;">
          <img src="${logoEmailUrl}" alt="NEXO MIDIAS" style="display:block;max-width:210px;height:auto;border:0;">
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:0 16px 28px 16px;">
          <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" style="width:680px;max-width:680px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#1f1f1f;">
            <tr>
              <td style="font-size:14px;line-height:1.6;padding:0 0 14px 0;">
                Prezado(a) ${escapeHtml(safeFullName)}, tudo bem?
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;padding:0 0 18px 0;">
                Agradecemos por enviar seu vídeo à <b>NEXO MIDIAS LTDA</b>. Segue abaixo uma cópia das informações fornecidas no formulário de envio que estão vinculadas ao contrato de <b>CESSÃO DE DIREITOS AUTORAIS</b>.
              </td>
            </tr>

            ${emailRow("NOME COMPLETO", escapeHtml(safeFullName))}
            ${emailRow("DATA DE NASCIMENTO", escapeHtml(safeBirthDate))}
            ${emailRow("EMAIL", `<a href="mailto:${escapeHtmlAttr(safeEmail)}" style="color:#2a66cc;">${escapeHtml(safeEmail)}</a>`)}
            ${emailRow("CPF OU CNPJ", escapeHtml(safeCpfCnpj))}
            ${emailRow("URL DO VÍDEO", `<a href="${escapeHtmlAttr(videoPublicUrl)}" style="color:#2a66cc;">Clique para acessar o vídeo</a>`)}
            ${emailRow("ONDE FOI FILMADO", escapeHtml(safeCity || "-"))}
            ${emailRow("DESCRIÇÃO", escapeHtml(safeDescription || "-"))}
            ${emailRow("VOCÊ QUE GRAVOU ESSE VÍDEO", escapeHtml(safeRecordedByUser))}
            ${emailRow("QUEM GRAVOU ESSE VÍDEO", escapeHtml(safeWhoRecordedVideo))}
            ${emailRow("GOSTARIA DE RECEBER CRÉDITOS", escapeHtml(safeWantsCredits))}
            ${emailRow("PLATAFORMA", escapeHtml(safePlatform || "-"))}
            ${emailRow("NOME OU NOME DE USUÁRIO", escapeHtml(safeSocialHandle || "-"))}
            ${emailRow("PIX", escapeHtml(safePixKey || "-"))}
            ${emailRow("NÃO ASSINEI NENHUM CONTRATO DE EXCLUSIVIDADE PARA ESTE VÍDEO COM MAIS NINGUÉM", escapeHtml(safeNoExclusivity))}
            ${emailRow("MEU CLIPE ATENDE ÀS DIRETRIZES DOS VÍDEOS (NÃO CONTÉM NUDEZ, VIOLÊNCIA GRÁFICA, ETC.)", escapeHtml(safeContentGuidelines))}

            <tr>
              <td style="font-size:14px;line-height:1.6;padding:18px 0 12px 0;">
                Adicionalmente, anexamos a este e-mail o contrato de <b>CESSÃO DE DIREITOS AUTORAIS</b> para sua revisão ou esclarecimento de qualquer dúvida que possa surgir.
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;padding:0 0 12px 0;">
                Além disso, informamos que neste exato momento, enviamos um e-mail contendo os dados de acesso à nossa plataforma. Isso permitirá que você acompanhe a receita gerada pelos seus vídeos de forma transparente.
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;padding:0 0 12px 0;">
                Caso necessite de informações adicionais ou tenha alguma pergunta, estamos à disposição através do e-mail:
                <a href="mailto:licenciamento@nexomidias.com.br" style="color:#2a66cc;">licenciamento@nexomidias.com.br</a>.
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.8;padding:8px 0 0 0;">
                Atenciosamente,<br>
                <b>NEXO MIDIAS LTDA.</b>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

    await resend.emails.send({
      from: "NEXO MIDIAS <licenciamento@nexomidias.com.br>",
      to: [email],
      subject: "Recebemos seu vídeo e seu contrato está anexado",
      html: emailHtml,
      attachments: [
        {
          filename: signatureLower.endsWith(".jpg") || signatureLower.endsWith(".jpeg")
            ? "assinatura.jpg"
            : "assinatura.png",
          content: bytesToBase64(signatureBytes),
        },
        {
          filename: "contrato.pdf",
          content: bytesToBase64(pdfBytes),
        },
      ],
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contrato criado com sucesso",
        contract_id: contractId,
        contract_path: contractFileName,
        contract_url,
        signature_path: signature,
        signature_url,
        video: inserted,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro interno",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 500,
      },
    );
  }
});

function getClientIp(req: Request, fallback?: string) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  return fallback || "127.0.0.1";
}

function emailRow(title: string, value: string) {
  return `
    <tr>
      <td style="padding:0 0 10px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="background:#9fd8dd;color:#0b3f43;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;text-transform:uppercase;padding:8px 10px;">
              ${escapeHtml(title)}
            </td>
          </tr>
          <tr>
            <td style="background:#f5f5f5;color:#1f1f1f;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;padding:10px 10px;">
              ${value || "-"}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function escapeHtml(value: string) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttr(value: string) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function sanitizePdfText(value: unknown): string {
  if (value == null) return "";

  return String(value)
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu,
      "",
    )
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
}

function sanitizeMultilinePdfText(value: unknown): string {
  return String(value ?? "")
    .split("\n")
    .map((line) => sanitizePdfText(line))
    .join("\n");
}

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  const paragraphs = sanitizeMultilinePdfText(text).split("\n");
  const result: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let line = "";

    for (const word of words) {
      const safeWord = sanitizePdfText(word);
      const testLine = line ? `${line} ${safeWord}` : safeWord;
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth && line) {
        result.push(line);
        line = safeWord;
      } else {
        line = testLine;
      }
    }

    if (line) result.push(line);
  }

  return result;
}

function drawWrappedText(
  page: any,
  params: {
    text: string;
    x: number;
    y: number;
    maxWidth: number;
    font: any;
    size: number;
    lineHeight?: number;
  },
) {
  const { x, y, maxWidth, font, size, lineHeight = 12 } = params;
  const text = sanitizeMultilinePdfText(params.text);
  const lines = wrapText(text, font, size, maxWidth);

  let currentY = y;
  for (const line of lines) {
    page.drawText(line, {
      x,
      y: currentY,
      size,
      font,
      color: COLORS.text,
    });
    currentY -= lineHeight;
  }

  return currentY;
}

function drawCenteredText(
  page: any,
  text: string,
  params: {
    y: number;
    font: any;
    size: number;
  },
) {
  const safeText = sanitizePdfText(text);
  const width = params.font.widthOfTextAtSize(safeText, params.size);

  page.drawText(safeText, {
    x: (PAGE_WIDTH - width) / 2,
    y: params.y,
    size: params.size,
    font: params.font,
    color: COLORS.black,
  });
}

function drawDivider(page: any, x1: number, x2: number, y: number) {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness: 1,
    color: COLORS.divider,
  });
}

function drawLabelValue(
  page: any,
  bold: any,
  font: any,
  x: number,
  y: number,
  label: string,
  value: string,
) {
  page.drawText(label, {
    x,
    y,
    size: 9.2,
    font: bold,
    color: COLORS.black,
  });

  page.drawText(sanitizePdfText(value), {
    x: x + 188,
    y,
    size: 9.2,
    font,
    color: COLORS.text,
  });
}

function drawAuditEntry(
  page: any,
  params: {
    label: string;
    date: string;
    time: string;
    text: string;
    x: number;
    y: number;
    font: any;
    bold: any;
  },
) {
  const { label, date, time, text, x, y, font, bold } = params;

  page.drawText(label, {
    x,
    y,
    size: 9,
    font: bold,
    color: COLORS.soft,
  });

  page.drawText(date, {
    x: x + 92,
    y,
    size: 10.5,
    font: bold,
    color: COLORS.black,
  });

  page.drawText(time, {
    x: x + 92,
    y: y - 14,
    size: 10,
    font,
    color: COLORS.text,
  });

  const endY = drawWrappedText(page, {
    text,
    x: x + 205,
    y: y + 2,
    maxWidth: 275,
    font,
    size: 10.2,
    lineHeight: 12.5,
  });

  return Math.min(endY, y - 62);
}

function formatDateBR(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return sanitizePdfText(value);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTimeBR(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return sanitizePdfText(value);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDateTimeBR(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return sanitizePdfText(value);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function fitImage(image: any, maxWidth: number, maxHeight: number) {
  const dims = image.scale(1);
  const scale = Math.min(maxWidth / dims.width, maxHeight / dims.height, 1);
  return {
    width: dims.width * scale,
    height: dims.height * scale,
  };
}

async function tryLoadImageFromBucket(
  pdfDoc: PDFDocument,
  supabase: any,
  bucket: string,
  path: string,
) {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error || !data) return null;

    const bytes = new Uint8Array(await data.arrayBuffer());
    const lower = path.toLowerCase();

    if (lower.endsWith(".png")) {
      return await pdfDoc.embedPng(bytes);
    }

    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
      return await pdfDoc.embedJpg(bytes);
    }

    return null;
  } catch {
    return null;
  }
}

function drawQrCode(
  page: any,
  params: {
    data: string;
    x: number;
    y: number;
    size: number;
  },
) {
  const { data, x, y, size } = params;

  const qr = qrcode(0, "M");
  qr.addData(data);
  qr.make();

  const count = qr.getModuleCount();
  const cell = size / count;

  page.drawRectangle({
    x,
    y,
    width: size,
    height: size,
    color: rgb(1, 1, 1),
    borderWidth: 0,
  });

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        page.drawRectangle({
          x: x + col * cell,
          y: y + size - (row + 1) * cell,
          width: cell,
          height: cell,
          color: rgb(0, 0, 0),
          borderWidth: 0,
        });
      }
    }
  }
}