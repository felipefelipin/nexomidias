import { useEffect, useRef } from "react"
import SignaturePad from "signature_pad"

type SignatureFieldProps = {
  onReady?: (signaturePad: SignaturePad) => void
}

export default function SignatureField({ onReady }: SignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const width = canvas.offsetWidth || 600
    const height = 220

    canvas.width = width * ratio
    canvas.height = height * ratio

    const context = canvas.getContext("2d")
    if (!context) return

    context.scale(ratio, ratio)

    const signaturePad = new SignaturePad(canvas)
    onReady?.(signaturePad)

    return () => {
      signaturePad.off()
    }
  }, [onReady])

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "220px",
          border: "1px solid #2a3b5f",
          borderRadius: "12px",
          background: "#081224",
        }}
      />
    </div>
  )
}