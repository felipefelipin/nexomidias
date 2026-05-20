import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import * as Select from "@radix-ui/react-select"
import "./EnvieVideo.css"

/* ✅ RADIX SELECT (fora do component!) */
const SelectRoot = Select.Root
const SelectTrigger = Select.Trigger
const SelectValue = Select.Value
const SelectIcon = Select.Icon
const SelectPortal = Select.Portal
const SelectContent = Select.Content
const SelectViewport = Select.Viewport
const SelectItem = Select.Item
const SelectItemText = Select.ItemText

type Point = { x: number; y: number }

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return await response.blob()
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

function formatCPF(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

function formatDateInput(value: string) {
  const digits = onlyDigits(value).slice(0, 8)

  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
}

function isValidDateString(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (month < 1 || month > 12) return false
  if (day < 1) return false

  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function formatDateToISO(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ""

  const day = match[1]
  const month = match[2]
  const year = match[3]

  return `${year}-${month}-${day}`
}

function EnvieVideo() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    birth_date: "",
    cpf_cnpj: "",
    pix_key: "",
    city: "",
    description: "",
    recorded_by_user: true,
    social_handle: "",
    platform: "",
  })

  const [file, setFile] = useState<File | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)

  const [signature, setSignature] = useState<string | null>(null)

  function isCanvasBlank(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return true
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    )
    return !pixelBuffer.some((color) => color !== 0)
  }

  function resizeCanvasToDisplaySize() {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    const displayWidth = Math.max(1, Math.round(rect.width * dpr))
    const displayHeight = Math.max(1, Math.round(rect.height * dpr))

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      const prev = canvas.toDataURL()

      canvas.width = displayWidth
      canvas.height = displayHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctxRef.current = ctx

      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = "#2AC8FF"
      ctx.lineWidth = 2.6
      ctx.imageSmoothingEnabled = true

      if (signature && prev && prev !== "data:,") {
        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        img.src = prev
      }
    } else {
      const ctx = canvas.getContext("2d")
      if (ctx && !ctxRef.current) {
        ctxRef.current = ctx
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = "#2AC8FF"
        ctx.lineWidth = 2.6
        ctx.imageSmoothingEnabled = true
      }
    }
  }

  function getPointFromEvent(e: React.PointerEvent<HTMLCanvasElement>): Point | null {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    const x = (e.clientX - rect.left) * dpr
    const y = (e.clientY - rect.top) * dpr
    return { x, y }
  }

  function startDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    e.preventDefault()
    resizeCanvasToDisplaySize()

    const p = getPointFromEvent(e)
    if (!p) return

    canvas.setPointerCapture(e.pointerId)

    isDrawingRef.current = true
    lastPointRef.current = p

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return
    const ctx = ctxRef.current
    if (!ctx) return

    e.preventDefault()

    const p = getPointFromEvent(e)
    const last = lastPointRef.current
    if (!p || !last) return

    const midX = (last.x + p.x) / 2
    const midY = (last.y + p.y) / 2

    ctx.quadraticCurveTo(last.x, last.y, midX, midY)
    ctx.stroke()

    lastPointRef.current = p
  }

  function stopDrawing(e?: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    if (e) e.preventDefault()

    isDrawingRef.current = false
    lastPointRef.current = null

    ctx.closePath()
    setSignature(canvas.toDataURL("image/png"))
  }

  function clearSignature() {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignature(null)
  }

  useEffect(() => {
    resizeCanvasToDisplaySize()
    const onResize = () => resizeCanvasToDisplaySize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    if (name === "birth_date") {
      setForm({ ...form, [name]: formatDateInput(value) })
      return
    }

    if (name === "cpf_cnpj") {
      setForm({ ...form, [name]: formatCPF(value) })
      return
    }

    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!file) {
      setError("Selecione um vídeo.")
      return
    }

    if (!isValidDateString(form.birth_date)) {
      setError("Digite uma data válida no formato dd/mm/aaaa.")
      return
    }

    const cpfDigits = onlyDigits(form.cpf_cnpj)
    if (cpfDigits.length !== 11) {
      setError("Digite um CPF válido com 11 números.")
      return
    }

    const canvas = canvasRef.current
    if (!canvas || isCanvasBlank(canvas)) {
      setError("Assinatura digital é obrigatória.")
      return
    }

    setLoading(true)

    try {
      const acceptedAt = new Date().toISOString()
      const contractVersion = "v1.0"
      const encoder = new TextEncoder()
      const submitterId = crypto.randomUUID()

      const fileExt = file.name.split(".").pop() || "mp4"
      const fileName = `${submitterId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("videos").upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

      if (uploadError) throw uploadError

      const sigData = signature ?? canvas.toDataURL("image/png")
      const signatureBlob = await dataUrlToBlob(sigData)
      const signatureFileName = `${submitterId}/${Date.now()}-signature.png`

      const { data: signatureUploadData, error: signatureUploadError } = await supabase.storage
        .from("signatures")
        .upload(signatureFileName, signatureBlob, {
          contentType: "image/png",
          upsert: false,
        })

      console.log("signatureFileName:", signatureFileName)
      console.log("signatureUploadData:", signatureUploadData)
      console.log("signatureUploadError:", signatureUploadError)

      if (signatureUploadError) throw signatureUploadError

      const signaturePath = signatureUploadData?.path ?? signatureFileName

      console.log("signaturePath final:", signaturePath)

      const contractText = `
        CONTRATO ${contractVersion}
        EMPRESA: NEXO MIDIAS LTDA
        USUÁRIO: ${form.full_name}
        CPF/CNPJ: ${form.cpf_cnpj}
        EMAIL: ${form.email}
        DATA: ${acceptedAt}
      `

      const contractHashBuffer = await crypto.subtle.digest(
        "SHA-256",
        encoder.encode(contractText)
      )

      const contractHash = Array.from(new Uint8Array(contractHashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      const signatureHashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(sigData))

      const signatureHash = Array.from(new Uint8Array(signatureHashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      const payload = {
        user_id: user?.id ?? null,
        file_path: fileName,
        original_name: file.name,

        full_name: form.full_name,
        email: form.email,
        birth_date: formatDateToISO(form.birth_date),
        cpf_cnpj: form.cpf_cnpj,
        pix_key: form.pix_key,
        city: form.city,
        description: form.description,
        recorded_by_user: form.recorded_by_user,
        social_handle: form.social_handle,
        platform: form.platform,

        signature: signaturePath,

        signature_hash: signatureHash,
        contract_hash: contractHash,

        contract_version: contractVersion,
        accepted_at: acceptedAt,
        ip_address: "127.0.0.1",
        user_agent: navigator.userAgent,
      }

      console.log("PAYLOAD create-contract:", payload)

      const { data, error: functionError } = await supabase.functions.invoke("create-contract", {
        body: payload,
      })

      console.log("create-contract response data:", data)
      console.log("create-contract response error:", functionError)

      if (functionError) {
        let rawError = ""

        try {
          rawError = await functionError.context?.text?.()
        } catch {
          rawError = ""
        }

        console.error("create-contract raw error body:", rawError)
        throw new Error(rawError || functionError.message || "Erro ao chamar create-contract")
      }

      setSuccess("Vídeo enviado com sucesso.")
      navigate("/envio-sucesso")
    } catch (err: any) {
      console.error("Erro no envio:", err)
      setError(err.message || "Erro ao enviar vídeo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="envie-hero">
        <div className="hero-content">
          <p className="hero-mini">PROCESSO DE LICENCIAMENTO</p>
          <h1>ENVIE SEU VÍDEO COM PROTEÇÃO LEGAL</h1>
          <p className="hero-sub">
            Seu conteúdo será analisado e licenciado oficialmente pela Nexo Midias para
            monetização segura.
          </p>

          <div className="envie-benefitsStrip">
            <p className="envie-benefitsStrip__kicker">
              VOCÊ PODE GANHAR DINHEIRO COM ESTE VÍDEO
            </p>

            <ul className="envie-benefitsStrip__list">
              <li>Receba monetização sem precisar postar</li>
              <li>Seus vídeos podem ser exibidos na TV e grandes portais</li>
              <li>Você mantém os créditos de autoria</li>
              <li>A Nexo Midias negocia por você</li>
            </ul>
          </div>
        </div>

        <div className="envie-layout">
          <main className="envie-main">
            <form className="envie-form" onSubmit={handleSubmit}>
              <div className="envie-section">
                <p className="envie-section__kicker">DADOS DO CRIADOR</p>

                <div className="envie-fields">
                  <input
                    name="full_name"
                    placeholder="Nome completo"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                  <div className="date-field">
                    <input
                      name="birth_date"
                      type="text"
                      inputMode="numeric"
                      placeholder="dd/mm/aaaa"
                      value={form.birth_date}
                      onChange={handleChange}
                      maxLength={10}
                      required
                    />
                  </div>

                  <input
                    name="cpf_cnpj"
                    type="text"
                    inputMode="numeric"
                    placeholder="CPF"
                    value={form.cpf_cnpj}
                    onChange={handleChange}
                    maxLength={14}
                    required
                  />

                  <input
                    name="pix_key"
                    placeholder="Chave PIX"
                    value={form.pix_key}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="city"
                    placeholder="Onde foi filmado - Ex: São Paulo/SP"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="envie-divider" />

              <div className="envie-section">
                <p className="envie-section__kicker">INFORMAÇÕES DO CONTEÚDO</p>

                <div className="envie-fields">
                  <textarea
                    name="description"
                    placeholder="Conte-nos sobre o seu vídeo"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />

                  <div className="recorded-toggle">
                    <span className="recorded-toggle__label">Você gravou este vídeo?</span>

                    <div className="recorded-toggle__control">
                      <input
                        className="recorded-toggle__input"
                        id="recorded-yes"
                        type="radio"
                        name="recorded_by_user"
                        checked={form.recorded_by_user === true}
                        onChange={() => setForm({ ...form, recorded_by_user: true })}
                      />
                      <label className="recorded-toggle__option" htmlFor="recorded-yes">
                        SIM
                      </label>

                      <input
                        className="recorded-toggle__input"
                        id="recorded-no"
                        type="radio"
                        name="recorded_by_user"
                        checked={form.recorded_by_user === false}
                        onChange={() => setForm({ ...form, recorded_by_user: false })}
                      />
                      <label className="recorded-toggle__option" htmlFor="recorded-no">
                        NÃO
                      </label>

                      <span className="recorded-toggle__thumb" />
                    </div>
                  </div>

                  <input
                    name="social_handle"
                    placeholder="@ da rede social para receber créditos"
                    value={form.social_handle}
                    onChange={handleChange}
                    required
                  />

                  <div className="nexo-select">
                    <label className="nexo-select__label">Plataforma</label>

                    <SelectRoot
                      value={form.platform}
                      onValueChange={(value) => setForm({ ...form, platform: value })}
                    >
                      <SelectTrigger
                        className="nexo-select__trigger"
                        aria-label="Selecione uma plataforma"
                      >
                        <SelectValue placeholder="Selecione uma plataforma" />
                        <SelectIcon className="nexo-select__icon">▾</SelectIcon>
                      </SelectTrigger>

                      <SelectPortal>
                        <SelectContent
                          className="nexo-select__content"
                          position="popper"
                          sideOffset={8}
                        >
                          <SelectViewport className="nexo-select__viewport">
                            <SelectItem className="nexo-select__item" value="Instagram">
                              <SelectItemText>Instagram</SelectItemText>
                            </SelectItem>

                            <SelectItem className="nexo-select__item" value="TikTok">
                              <SelectItemText>TikTok</SelectItemText>
                            </SelectItem>

                            <SelectItem className="nexo-select__item" value="YouTube">
                              <SelectItemText>YouTube</SelectItemText>
                            </SelectItem>

                            <SelectItem className="nexo-select__item" value="Facebook">
                              <SelectItemText>Facebook</SelectItemText>
                            </SelectItem>
                          </SelectViewport>
                        </SelectContent>
                      </SelectPortal>
                    </SelectRoot>

                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      className="nexo-select__hiddenRequired"
                      value={form.platform}
                      onChange={() => {}}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="envie-divider" />

              <div className="envie-section">
                <p className="envie-section__kicker">ENVIO DO MATERIAL</p>

                <div className="envie-fields">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    required
                  />

                  <div className="envie-video__notice envie-video__notice--alert">
                    <p className="envie-video__noticeTitle">NÃO ENVIE VÍDEOS QUE</p>

                    <ul className="envie-video__noticeList">
                      <li>Não são seus;</li>
                      <li>Inclui texto;</li>
                      <li>Violem direitos autorais;</li>
                      <li>Apresente violência física ou nudez;</li>
                      <li>Ou qualquer outra ilegalidade.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="envie-divider" />

              <div className="envie-section envie-video__legal">
                <p className="envie-section__kicker">ASSINATURA E AUTORIZAÇÃO</p>

                <p className="envie-legal__intro">
                  Ao assinar abaixo, você autoriza a Nexo Midias a representar e monetizar este
                  conteúdo em seu nome através de licenciamento oficial.
                </p>

                <div className="signature-wrapper">
                  <div className="signature-card">
                    <p className="signature-title">Assinatura Digital</p>

                    <div className="signature-area">
                      <canvas
                        ref={canvasRef}
                        style={{ touchAction: "none" }}
                        onPointerDown={startDrawing}
                        onPointerMove={draw}
                        onPointerUp={stopDrawing}
                        onPointerCancel={stopDrawing}
                        onPointerLeave={stopDrawing}
                      />

                      <button
                        type="button"
                        className="signature-reset"
                        onClick={clearSignature}
                        aria-label="Limpar assinatura"
                        title="Limpar assinatura"
                      >
                        ↻
                      </button>
                    </div>

                    {!signature && <p className="signature-error">Assinatura é obrigatória</p>}
                  </div>

                  <div className="signature-legal">
                    <p className="signature-legal__partner">
                      *NEXO MIDIAS LTDA é nosso parceiro de licenciamento de conteúdo confiável.
                    </p>

                    <p className="signature-legal__text">
                      Ao assinar, declaro que li e concordo com o{" "}
<a
  href="/contrato-cessao-direitos.pdf"
  target="_blank"
  rel="noopener noreferrer"
>
  Contrato de CESSÃO DE DIREITOS AUTORAIS
</a>
                      e que todas as informações contidas neste formulário são verdadeiras e
                      precisas. Entendo que estou transferindo os direitos exclusivos sobre o
                      conteúdo enviado e que a NEXO MIDIAS LTDA pode representar esse conteúdo em
                      meu nome.
                    </p>
                  </div>
                </div>

                <label className="checkbox">
                  <input type="checkbox" required />
                  Não assinei contrato de exclusividade para este vídeo.
                </label>

                <label className="checkbox">
                  <input type="checkbox" required />
                  Meu vídeo segue as diretrizes de conteúdo.
                </label>
              </div>

              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}

              <button type="submit" disabled={loading} className="envie-video__cta">
                {loading ? "Processando envio..." : "ENVIAR VÍDEO PARA ANÁLISE"}
              </button>
            </form>
          </main>
        </div>
      </section>
    </>
  )
}

export default EnvieVideo