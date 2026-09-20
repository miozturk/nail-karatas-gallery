import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { dismissTourHelp, isTourHelpDismissed } from './tourHelpStorage'
import { useI18n } from '../../i18n/useI18n'

export default function TourHelp({ returnFocus }: {
  returnFocus: RefObject<HTMLAnchorElement | null>
}) {
  const { t } = useI18n()
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
    <h2 id="tour-help-title">{t('help.title')}</h2>
    <p id="tour-help-intro">{t('help.intro')}</p>
    <ul>
      <li>{t('help.drag')}</li>
      <li>{t('help.hotspots')}</li>
      <li>{t('help.roomMenu')}</li>
      <li>{t('help.minimap')}</li>
      <li>{t('help.collapse')}</li>
      <li>{t('help.returnPrefix')} <strong>{t('tour.returnUnit')}</strong> {t('help.returnSuffix')}</li>
    </ul>
    <button className="ui-action ui-action--primary" type="button" onClick={dismiss}>{t('help.explore')}</button>
  </dialog>
}
