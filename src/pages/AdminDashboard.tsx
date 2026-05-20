import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"

interface Video {
  id: string
  full_name: string
  email: string
  original_name: string
  status: string
  created_at: string
  rejection_reason: string | null
  video_url?: string | null
  thumbnail_url?: string | null
  title?: string | null
  category?: string | null
}

function AdminDashboard() {
  const { user } = useAuth()

  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({})
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    setLoading(true)

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setVideos(data)
    }

    setLoading(false)
  }

  async function approveVideo(video: Video) {
    setProcessingId(video.id)

    const { error } = await supabase
      .from("videos")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        rejected_at: null,
        rejection_reason: null,
      })
      .eq("id", video.id)

    if (!error) {
      await supabase.functions.invoke("send-video-status-email", {
        body: {
          email: video.email,
          name: video.full_name,
          video_name: video.original_name,
          status: "approved",
        },
      })

      await fetchVideos()
    }

    setProcessingId(null)
  }

  async function rejectVideo(video: Video) {
    const reason = rejectionReasons[video.id]

    if (!reason || !reason.trim()) {
      alert("Informe o motivo da rejeição.")
      return
    }

    setProcessingId(video.id)

    const { error } = await supabase
      .from("videos")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        approved_at: null,
        rejection_reason: reason,
      })
      .eq("id", video.id)

    if (!error) {
      await supabase.functions.invoke("send-video-status-email", {
        body: {
          email: video.email,
          name: video.full_name,
          video_name: video.original_name,
          status: "rejected",
          rejection_reason: reason,
        },
      })

      setRejectionReasons((prev) => ({ ...prev, [video.id]: "" }))
      await fetchVideos()
    }

    setProcessingId(null)
  }

  async function removeFromLibrary(video: Video) {
    setProcessingId(video.id)

    const { error } = await supabase
      .from("videos")
      .update({
        status: "pending",
        approved_at: null,
      })
      .eq("id", video.id)

    if (!error) {
      await fetchVideos()
    }

    setProcessingId(null)
  }

  function getStatusLabel(status: string) {
    if (status === "approved") return "Aprovado"
    if (status === "rejected") return "Rejeitado"
    return "Em análise"
  }

  function getStatusColor(status: string) {
    if (status === "approved") return "#22c55e"
    if (status === "rejected") return "#ef4444"
    return "#facc15"
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const stats = useMemo(() => {
    const pending = videos.filter((v) => v.status === "pending").length
    const approved = videos.filter((v) => v.status === "approved").length
    const rejected = videos.filter((v) => v.status === "rejected").length

    return {
      total: videos.length,
      pending,
      approved,
      rejected,
    }
  }, [videos])

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase()

    return videos.filter((video) => {
      const matchesFilter = activeFilter === "all" || video.status === activeFilter

      const matchesSearch =
        !q ||
        video.original_name?.toLowerCase().includes(q) ||
        video.full_name?.toLowerCase().includes(q) ||
        video.email?.toLowerCase().includes(q) ||
        video.title?.toLowerCase().includes(q)

      return matchesFilter && matchesSearch
    })
  }, [videos, activeFilter, search])

  if (!user) {
    return (
      <div style={{ padding: "120px 40px", color: "#fff" }}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top center, rgba(42,200,255,0.08), transparent 30%), linear-gradient(180deg, #050816 0%, #081427 45%, #0A1833 100%)",
        padding: "140px 24px 80px",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <p
            style={{
              margin: 0,
              color: "#2AC8FF",
              fontWeight: 700,
              letterSpacing: "0.12em",
              fontSize: 12,
            }}
          >
            NEXO MIDIAS
          </p>

          <h1
            style={{
              margin: "10px 0 10px",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Painel Administrativo
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 760,
              lineHeight: 1.7,
            }}
          >
            Gerencie os vídeos enviados, aprove conteúdos para a biblioteca e acompanhe o fluxo de aprovação da plataforma.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            { label: "Total", value: stats.total, color: "#ffffff" },
            { label: "Em análise", value: stats.pending, color: "#facc15" },
            { label: "Aprovados", value: stats.approved, color: "#22c55e" },
            { label: "Rejeitados", value: stats.rejected, color: "#ef4444" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: 18,
                borderRadius: 18,
                border: "1px solid rgba(42,200,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 8 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "Todos" },
              { key: "pending", label: "Em análise" },
              { key: "approved", label: "Aprovados" },
              { key: "rejected", label: "Rejeitados" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveFilter(item.key as "all" | "pending" | "approved" | "rejected")}
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 999,
                  border:
                    activeFilter === item.key
                      ? "1px solid rgba(42,200,255,0.45)"
                      : "1px solid rgba(255,255,255,0.10)",
                  background:
                    activeFilter === item.key
                      ? "rgba(42,200,255,0.12)"
                      : "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Buscar por nome, vídeo ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 360,
              height: 44,
              padding: "0 16px",
              borderRadius: 999,
              border: "1px solid rgba(42,200,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(42,200,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            padding: 24,
          }}
        >
          {loading && <p style={{ color: "rgba(255,255,255,0.72)" }}>Carregando vídeos...</p>}

          {!loading && filteredVideos.length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.68)" }}>
              Nenhum vídeo encontrado para este filtro.
            </p>
          )}

          {!loading &&
            filteredVideos.map((video) => (
              <div
                key={video.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: 18,
                  background: "#0b1324",
                  padding: 18,
                  borderRadius: 18,
                  marginBottom: 18,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    borderRadius: 14,
                    overflow: "hidden",
                    background:
                      "radial-gradient(circle at center, rgba(42,200,255,0.12), transparent 70%), rgba(255,255,255,0.03)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.original_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 28, color: "rgba(255,255,255,0.5)" }}>▶</span>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>
                        {video.title || video.original_name}
                      </h3>
                      <p
                        style={{
                          margin: "8px 0 0",
                          fontSize: 14,
                          color: "rgba(255,255,255,0.68)",
                        }}
                      >
                        Enviado por {video.full_name}
                      </p>
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        color: getStatusColor(video.status),
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${getStatusColor(video.status)}33`,
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontSize: 13,
                      }}
                    >
                      {getStatusLabel(video.status)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 10,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.76)",
                      marginBottom: 14,
                    }}
                  >
                    <div>Email: {video.email}</div>
                    <div>Enviado em: {formatDate(video.created_at)}</div>
                  </div>

                  {video.video_url && (
                    <div style={{ marginBottom: 14 }}>
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#2AC8FF",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}
                      >
                        Abrir vídeo
                      </a>
                    </div>
                  )}

                  {video.status === "rejected" && video.rejection_reason && (
                    <div
                      style={{
                        marginBottom: 14,
                        fontSize: 13,
                        color: "#fca5a5",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.18)",
                        borderRadius: 12,
                        padding: 12,
                      }}
                    >
                      Motivo da rejeição: {video.rejection_reason}
                    </div>
                  )}

                  {video.status === "pending" && (
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Motivo da rejeição"
                          value={rejectionReasons[video.id] || ""}
                          onChange={(e) =>
                            setRejectionReasons((prev) => ({
                              ...prev,
                              [video.id]: e.target.value,
                            }))
                          }
                          style={{
                            flex: "1 1 260px",
                            minWidth: 220,
                            height: 42,
                            padding: "0 14px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.04)",
                            color: "#fff",
                            outline: "none",
                          }}
                        />

                        <button
                          onClick={() => approveVideo(video)}
                          disabled={processingId === video.id}
                          style={{
                            height: 42,
                            padding: "0 18px",
                            borderRadius: 10,
                            border: "none",
                            background: "#22c55e",
                            color: "#04130a",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {processingId === video.id ? "Processando..." : "Aprovar"}
                        </button>

                        <button
                          onClick={() => rejectVideo(video)}
                          disabled={processingId === video.id}
                          style={{
                            height: 42,
                            padding: "0 18px",
                            borderRadius: 10,
                            border: "none",
                            background: "#ef4444",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {processingId === video.id ? "Processando..." : "Rejeitar"}
                        </button>
                      </div>
                    </div>
                  )}

                  {video.status === "approved" && (
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => removeFromLibrary(video)}
                          disabled={processingId === video.id}
                          style={{
                            height: 42,
                            padding: "0 18px",
                            borderRadius: 10,
                            border: "1px solid rgba(250,204,21,0.25)",
                            background: "rgba(250,204,21,0.12)",
                            color: "#fde68a",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {processingId === video.id ? "Processando..." : "Remover da biblioteca"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard