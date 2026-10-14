import { QrCode } from '@phosphor-icons/react'
import { Badge } from '@/design-system'
/** A visual camera simulation. No device media or permissions are used. */
export function PixQrInput() {
  return (
    <div className="proto-camera-cutout">
      <Badge variant="outline">Simulated camera</Badge>
      <div className="proto-camera-target" aria-hidden="true">
        <QrCode size={104} />
      </div>
      <p className="type-ui">
        Position the supplier’s QR code inside the frame.
      </p>
    </div>
  )
}
