// VariantSelect: allows a variant to be set up within a document hierarchy
//
// For example, given two paths `/docs/v1.0/foo` and `/docs/v2.0/foo`, the
// second folder acts as a variant.  If you use <VariantSelect root="/docs">
// then you'll get a selection for the different variants (v1.0, v2.0).

import React from 'react'
import {ActionList, ActionMenu, ThemeProvider} from '@primer/react'
import NavHierarchy from '../util/nav-hierarchy'

function VariantSelect(props) {
  const [open, setOpen] = React.useState(false)
  const path = NavHierarchy.getPath(props.location.pathname)
  const vp = NavHierarchy.getVariantAndPage(props.root, path)

  if (!vp) {
    return null
  }

  const variantPages = NavHierarchy.getVariantsForPage(props.root, vp.page)
  const items = []
  let selectedItem = variantPages[0]

  if (variantPages.length === 0) {
    return null
  }

  function anchorClickHandler(event, url) {
    event.preventDefault()
    window.location.href = `${url}?v=true`
  }

  function onItemEnterKey(event, url) {
    if (event.key === 'Enter') {
      window.location.href = `${url}?v=true`
    }
  }

  for (const [index, match] of variantPages.entries()) {
    let active = false
    if (match.page.url === path) {
      selectedItem = match
      active = true
    }
    items.push(
      <ActionList.Item
        onKeyDown={e => onItemEnterKey(e, match.page.url)}
        onClick={e => anchorClickHandler(e, match.page.url)}
        id={match.variant.shortName}
        key={index}
        active={active}
      >
        {match.variant.title}
      </ActionList.Item>,
    )
  }

  // const ariaLabelMenuButton = open ? 'Version release' : selectedItem.variant.title

  return (
    <ThemeProvider>
      <p id="label-versions-list-item">
        Select CLI Version:
      </p>
      <ActionMenu open={open} onOpenChange={setOpen}>
        {/* Disabling to remove lint warnings. This property was added as "autofocus"
        in a previous accessibility audit which did not trigger the lint warning. */
        /* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <ActionMenu.Button autoFocus aria-labelledby="label-versions-list-item">
          {selectedItem.variant.title}
        </ActionMenu.Button>
        <ActionMenu.Overlay width="medium" onEscape={() => setOpen(false)}>
          <ActionList id="versions-list-item">
            {items}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </ThemeProvider>
  )
}

export default VariantSelect
