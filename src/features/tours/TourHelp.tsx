import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { dismissTourHelp, isTourHelpDismissed } from './tourHelpStorage'

export default function TourHelp({ returnFocus }: {
  returnFocus: RefObject<HTMLAnchorElement | null>
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(() => !isTourHelpDismissed())

  useEffect(() => {
    const element = dialog.current
    if (!open || !element) return
    element.showModal()
    return () => element.close()
  }, [open])

  function dismiss() {
    dismissTourHelp()
    dialog.current?.close()
    setOpen(false)
    returnFocus.current?.focus()
  }

  if (!open) return null
  return <dialog ref={dialog} className="tour-help" aria-labelledby="tour-help-title"
    aria-describedby="tour-help-intro" onCancel={(event) => { event.preventDefault(); dismiss() }}>
    <h2 id="tour-help-title">Sanal tur nasıl kullanılır?</h2>
    <p id="tour-help-intro">Odaları keşfetmek için:</p>
    <ul>
      <li>Etrafınıza bakmak için panoramayı sürükleyin.</li>
      <li>Odalar arasında geçmek için panorama içindeki geçiş noktalarını seçin.</li>
      <li>Oda menüsünden doğrudan başka bir odaya geçin.</li>
      <li>Minimap üzerindeki bakış noktası düğmeleriyle konum değiştirin.</li>
      <li>Minimap’i daraltabilir ve yeniden açabilirsiniz.</li>
      <li><strong>Daireye Dön</strong> ile seçili daireye dönün.</li>
    </ul>
    <button type="button" onClick={dismiss}>Turu Keşfet</button>
  </dialog>
}
