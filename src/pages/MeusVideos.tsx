import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './MeusVideos.css'

type VideoRow = {
  id: string
  title: string | null
  thumbnail_url: string | null
  video_url: string | null
  status: string | null
  created_at: string
}

const PAGE_SIZE = 8

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}

function statusLabel(status?: string | null) {
  const s = (status || '').toLowerCase()
  if (s.includes('aprov')) return 'Aprovado'
  if (s.includes('reje')) return 'Rejeitado'
  if (s.includes('anal')) return 'Em análise'
  if (s.includes('pend')) return 'Pendente'
  return status || '—'
}

function statusTone(status?: string | null) {
  const s = (status || '').toLowerCase()
  if (s.includes('aprov')) return 'ok'
  if (s.includes('reje')) return 'bad'
  if (s.includes('anal')) return 'warn'
  if (s.includes('pend')) return 'neutral'
  return 'neutral'
}

function SkeletonGrid({ count = PAGE_SIZE }: { count?: number }) {
  return (
    <div className="nx-grid nx-grid--skeleton" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="nx-skelCard">
          <div className="nx-skelThumb" />
          <div className="nx-skelBody">
            <div className="nx-skelLine nx-skelLine--lg" />
            <div className="nx-skelLine" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MeusVideos() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [rows, setRows] = useState<VideoRow[]>([])
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])

  async function fetchVideos() {
    setLoading(true)
    setError(null)

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    try {
      let query = supabase
        .from('videos')
        .select('id,title,thumbnail_url,video_url,status,created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`)
      }

      const { data, count, error: qError } = await query.range(from, to)

      if (qError) {
        setError('Não foi possível carregar seus vídeos. Verifique sua conexão e tente novamente.')
        setRows([])
        setTotal(0)
      } else {
        setRows((data || []) as VideoRow[])
        setTotal(count || 0)
      }
    } catch {
      setError('Não foi possível carregar seus vídeos. Verifique sua conexão e tente novamente.')
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      fetchVideos()
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <section className="nx-videos">
      <div className="nx-videos__wrap">
        <header className="nx-videos__header">
          <h1 className="nx-videos__title">Meus Vídeos</h1>
          <p className="nx-videos__subtitle">Gerencie e acompanhe todos os seus vídeos enviados</p>

          {/* ✅ Toolbar glass premium */}
          <div className="nx-videos__topbar nx-toolbar">
            <Link to="/envie-seu-video" className="nx-btn nx-btn--inline">
              Envie seu vídeo
            </Link>

            <div className="nx-search">
              <span className="nx-search__icon" aria-hidden="true">⌕</span>
              <input
                className="nx-search__input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar resultados..."
                aria-label="Buscar resultados"
              />
              {search.trim().length > 0 && (
                <button
                  className="nx-search__clear"
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Limpar busca"
                  title="Limpar"
                >
                  ×
                </button>
              )}
            </div>

            <button className="nx-iconBtn" type="button" aria-label="Filtros (em breve)" title="Filtros (em breve)">
              ⎚
            </button>
          </div>
        </header>

        <div className="nx-videos__card">
          {/* ✅ Skeleton premium */}
          {loading && (
            <>
              <div className="nx-state nx-state--compact">
                <div className="nx-dotPulse" aria-hidden="true" />
                <p className="nx-state__text">Carregando seus vídeos…</p>
              </div>
              <SkeletonGrid />
            </>
          )}

          {!loading && error && (
            <div className="nx-state nx-state--error">
              <p className="nx-state__title">⚠️ Ops…</p>
              <p className="nx-state__text">{error}</p>
              <button className="nx-btn nx-btn--inline" onClick={fetchVideos}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="nx-state nx-state--empty">
              <p className="nx-state__title">Nada por aqui ainda</p>
              <p className="nx-state__text">
                Envie seu primeiro vídeo e acompanhe o status de aprovação em tempo real.
              </p>
              <div className="nx-state__actions">
                <Link to="/envie-seu-video" className="nx-btn nx-btn--inline">
                  Envie seu vídeo
                </Link>
                <Link to="/envie-seu-video" className="nx-btn nx-btn--ghost nx-btn--inline">
                  Ver requisitos
                </Link>
              </div>

              {/* visualzinho discreto pra não ficar vazio */}
              <div className="nx-emptyPreview" aria-hidden="true">
                <div className="nx-emptyPreview__card" />
                <div className="nx-emptyPreview__card" />
                <div className="nx-emptyPreview__card" />
              </div>
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <>
              <div className="nx-grid">
                {rows.map((v, idx) => (
                  <article
                    key={v.id}
                    className="nx-videoCard nx-appear"
                    style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
                  >
                    <div className="nx-videoCard__thumb">
                      {v.thumbnail_url ? (
                        <img src={v.thumbnail_url} alt={v.title || 'Vídeo'} loading="lazy" />
                      ) : (
                        <div className="nx-videoCard__thumbFallback" aria-hidden="true">
                          ▶
                        </div>
                      )}

                      <span className={`nx-badge nx-badge--${statusTone(v.status)}`}>
                        {statusLabel(v.status)}
                      </span>

                      <div className="nx-videoCard__hoverHint" aria-hidden="true">
                        Ver detalhes
                      </div>
                    </div>

                    <div className="nx-videoCard__body">
                      <h3 className="nx-videoCard__title" title={v.title || 'Sem título'}>
                        {v.title || 'Sem título'}
                      </h3>

                      <div className="nx-videoCard__meta">
                        <span className="nx-metaItem">Enviado em {formatDate(v.created_at)}</span>

                        {v.video_url && (
                          <a className="nx-link" href={v.video_url} target="_blank" rel="noreferrer">
                            Abrir
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="nx-pagination">
                <button
                  className="nx-iconBtn"
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Página anterior"
                >
                  ‹
                </button>

                <div className="nx-pagination__info">
                  <span className="nx-pagination__strong">Página {page}</span>
                  <span className="nx-pagination__muted">de {totalPages}</span>
                </div>

                <button
                  className="nx-iconBtn"
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Próxima página"
                >
                  ›
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}