const url = "https://yvlxeabswmjhuaatycam.supabase.co/functions/v1/create-contract"

const body = {
  user_id: "c8044412-0964-4ece-a83d-e73784510b78",

  file_path: "teste-video.mp4",
  original_name: "teste-video.mp4",

  full_name: "Felipe Teste",
  email: "felipegomes771a@gmail.com",
  birth_date: "1999-02-01",
  cpf_cnpj: "16221431670",
  pix_key: "33998112264",
  city: "Frei Lagonegro/MG",
  description: "Teste de diagnóstico da edge function",
  recorded_by_user: true,
  social_handle: "@felipe",
  platform: "TikTok",

  signature: "c8044412-0964-4ece-a83d-e73784510b78-1773165536506-signature.png",

  signature_hash: "hash-teste-assinatura",
  contract_hash: "hash-teste-contrato",

  contract_version: "v1.0",
  accepted_at: new Date().toISOString(),

  ip_address: "127.0.0.1",
  user_agent: "debug-script"
}

async function run() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const raw = await response.text()

    console.log("STATUS:", response.status)
    console.log("RAW RESPONSE:")
    console.log(raw)

    try {
      const parsed = JSON.parse(raw)
      console.log("JSON RESPONSE:")
      console.dir(parsed, { depth: null })
    } catch {
      console.log("A resposta não veio em JSON.")
    }
  } catch (error) {
    console.error("ERRO DE REDE/FETCH:")
    console.error(error)
  }
}

run()