import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Biblioteca.css'

type VideoRow = {
  id: string
  title: string | null
  thumbnail_url: string | null
  video_url: string | null
  status: string | null
  created_at: string
  category?: string | null
}

const PAGE_SIZE = 12

const CATEGORIES = [
  'Todos',
  'Comédia',
  'Pegadinhas',
  'Crianças',
  'Pets & Animais',
  'Curiosidades',
  'Comidas',
  'Fails & Quedas',
  'Esportes',
  'Pov',
  'Amor & Família',
  'Notícias',
] as const

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function normalize(s?: string | null) {
  return (s || '').toString().trim().toLowerCase()
}

function isApprovedStatus(s?: string | null) {
  const v = normalize(s)
  return v.includes('aprov') || v === 'approved'
}

function inferCategory(video: VideoRow): (typeof CATEGORIES)[number] {
  const explicit = normalize(video.category)
  const title = normalize(video.title)

  if (explicit) {
    const exact = CATEGORIES.find((cat) => normalize(cat) === explicit)
    if (exact) return exact
  }

  if (
    title.includes('pegadinha') ||
    title.includes('prank')
  ) return 'Pegadinhas'

  if (
    title.includes('criança') ||
    title.includes('crianca') ||
    title.includes('bebê') ||
    title.includes('bebe') ||
    title.includes('infantil')
  ) return 'Crianças'

  if (
    title.includes('pet') ||
    title.includes('cachorro') ||
    title.includes('gato') ||
    title.includes('animal')
  ) return 'Pets & Animais'

  if (
    title.includes('curios') ||
    title.includes('incrível') ||
    title.includes('incrivel') ||
    title.includes('fato')
  ) return 'Curiosidades'

  if (
    title.includes('comida') ||
    title.includes('receita') ||
    title.includes('restaurante') ||
    title.includes('culin')
  ) return 'Comidas'

  if (
    title.includes('fail') ||
    title.includes('queda') ||
    title.includes('tombo') ||
    title.includes('escorreg')
  ) return 'Fails & Quedas'

  if (
    title.includes('futebol') ||
    title.includes('esporte') ||
    title.includes('jogo') ||
    title.includes('corrida')
  ) return 'Esportes'

  if (
    title.includes('pov')
  ) return 'Pov'

  if (
    title.includes('família') ||
    title.includes('familia') ||
    title.includes('amor') ||
    title.includes('casal')
  ) return 'Amor & Família'

  if (
    title.includes('notícia') ||
    title.includes('noticia') ||
    title.includes('jornal') ||
    title.includes('urgente')
  ) return 'Notícias'

  return 'Comédia'
}

export default function Biblioteca() {
  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>('Todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [allRows, setAllRows] = useState<VideoRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [previewVideo, setPreviewVideo] = useState<VideoRow | null>(null)

  async function fetchApprovedVideos() {
    setLoading(true)
    setError(null)

    try {
      let data: VideoRow[] | null = null

      const withCategory = await supabase
        .from('videos')
        .select('id,title,thumbnail_url,video_url,status,created_at,category')
        .order('created_at', { ascending: false })

      if (withCategory.error) {
        const withoutCategory = await supabase
          .from('videos')
          .select('id,title,thumbnail_url,video_url,status,created_at')
          .order('created_at', { ascending: false })

        if (withoutCategory.error) {
          console.log('BIBLIOTECA QUERY ERROR:', withoutCategory.error)
          setError('Não foi possível carregar a biblioteca agora.')
          setAllRows([])
          return
        }

        data = (withoutCategory.data || []) as VideoRow[]
      } else {
        data = (withCategory.data || []) as VideoRow[]
      }

      const approvedOnly = (data || []).filter((v) => isApprovedStatus(v.status))
      setAllRows(approvedOnly)
    } catch (e) {
      console.log('BIBLIOTECA ERROR:', e)
      setError('Não foi possível carregar a biblioteca agora.')
      setAllRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovedVideos()
  }, [])

  const filteredRows = useMemo(() => {
    const q = normalize(search)

    return allRows.filter((video) => {
      const title = normalize(video.title)
      const category = inferCategory(video)

      const matchSearch = !q || title.includes(q)
      const matchCategory = activeCat === 'Todos' || category === activeCat

      return matchSearch && matchCategory
    })
  }, [allRows, activeCat, search])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE)),
    [filteredRows.length]
  )

  const paginatedRows = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
    return filteredRows.slice(from, to)
  }, [filteredRows, page])

  useEffect(() => {
    setPage(1)
  }, [activeCat, search])

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setPreviewVideo(null)
    }

    if (previewVideo) {
      window.addEventListener('keydown', onKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [previewVideo])

  return (
    <section className="nx-lib">
      <div className="nx-lib__wrap">
        <header className="nx-lib__header">
          <div className="nx-lib__headRow">
            <div>
              <h1 className="nx-lib__title">Biblioteca</h1>
              <p className="nx-lib__subtitle">
                Explore os vídeos aprovados — prontos para distribuição, licenciamento e performance.
              </p>
            </div>

            <div className="nx-libSearch">
              <span className="nx-libSearch__icon" aria-hidden="true">
                ⌕
              </span>
              <input
                className="nx-libSearch__input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar vídeos..."
                aria-label="Buscar vídeos"
              />
            </div>
          </div>

          <div className="nx-libCats" aria-label="Categorias">
            <div className="nx-libCats__track">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`nx-libChip ${activeCat === c ? 'nx-libChip--active' : ''}`}
                  onClick={() => setActiveCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="nx-libCard">
          <div className="nx-libCard__inner">
            {loading && (
              <div className="nx-libState">
                <div className="nx-libState__box">
                  <div className="nx-libSpinner" aria-hidden="true" />
                  <p className="nx-libState__title">Carregando biblioteca…</p>
                  <p className="nx-libState__text">Buscando vídeos aprovados.</p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="nx-libState nx-libState--error">
                <div className="nx-libState__box">
                  <div className="nx-libState__icon" aria-hidden="true">
                    !
                  </div>
                  <p className="nx-libState__title">Ops…</p>
                  <p className="nx-libState__text">{error}</p>
                  <button className="nx-libBtn" type="button" onClick={fetchApprovedVideos}>
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && filteredRows.length === 0 && (
              <div className="nx-libState">
                <div className="nx-libState__box">
                  <div className="nx-libState__icon" aria-hidden="true">
                    ▦
                  </div>
                  <p className="nx-libState__title">Nenhum vídeo aprovado encontrado</p>
                  <p className="nx-libState__text">
                    Assim que houver vídeos aprovados, eles vão aparecer aqui automaticamente.
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && filteredRows.length > 0 && (
              <>
                <div className="nx-libTopbar">
                  <div className="nx-libTopbar__left">
                    <span className="nx-libTopbar__count">{filteredRows.length}</span>
                    <span className="nx-libTopbar__label">vídeos disponíveis</span>
                  </div>

                  <div className="nx-libTopbar__right">
                    <span className="nx-libTopbar__muted">
                      Exibindo {paginatedRows.length} nesta página
                    </span>
                  </div>
                </div>

                <div className="nx-libGrid">
                  {paginatedRows.map((v) => {
                    const category = inferCategory(v)

                    return (
                      <article key={v.id} className="nx-libItem">
                        <div className="nx-libItem__thumb">
                          {v.thumbnail_url ? (
                            <img src={v.thumbnail_url} alt={v.title || 'Vídeo'} loading="lazy" />
                          ) : (
                            <div className="nx-libItem__thumbFallback" aria-hidden="true">
                              ▶
                            </div>
                          )}

                          <span className="nx-libBadge">Aprovado</span>
                          <span className="nx-libCategory">{category}</span>
                        </div>

                        <div className="nx-libItem__body">
                          <h3 className="nx-libItem__title">{v.title || 'Sem título'}</h3>

                          <div className="nx-libItem__meta">
                            <span className="nx-libItem__date">{formatDate(v.created_at)}</span>
                          </div>

                          <div className="nx-libItem__actions">
                            {v.video_url ? (
                              <>
                                <button
                                  className="nx-libActionBtn"
                                  type="button"
                                  onClick={() => setPreviewVideo(v)}
                                >
                                  Assistir
                                </button>

                                <a
                                  className="nx-libLink"
                                  href={v.video_url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Abrir link
                                </a>
                              </>
                            ) : (
                              <span className="nx-libItem__muted">Sem link disponível</span>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="nx-libPagination">
                    <button
                      className="nx-libIconBtn"
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      aria-label="Página anterior"
                    >
                      ‹
                    </button>

                    <div className="nx-libPagination__info">
                      <span className="nx-libPagination__strong">Página {page}</span>
                      <span className="nx-libPagination__muted">de {totalPages}</span>
                    </div>

                    <button
                      className="nx-libIconBtn"
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      aria-label="Próxima página"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {previewVideo && (
        <div className="nx-libModal" onClick={() => setPreviewVideo(null)}>
          <div
            className="nx-libModal__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="nx-libModal__close"
              type="button"
              onClick={() => setPreviewVideo(null)}
              aria-label="Fechar"
            >
              ×
            </button>

            <div className="nx-libModal__media">
              {previewVideo.video_url ? (
                <video
                  src={previewVideo.video_url}
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="nx-libItem__thumbFallback">▶</div>
              )}
            </div>

            <div className="nx-libModal__body">
              <h3>{previewVideo.title || 'Sem título'}</h3>
              <p>{formatDate(previewVideo.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}