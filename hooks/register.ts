import type { Register, RenderElement, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// CRANEO 3D v4, casual take ("informal mode"): the four pigments finally get to play.
// Light = sticker-sheet paper with cobalt accent. Dark = cobalt night with a cadmium accent.
const { theme, problems } = makeColors({
  label: 'CRANEO 3D v4 · casual',
  roles: { accent: '#3A5BD9', danger: '#D54C25', success: '#008F77', warning: '#DC9E12', pro: '#7A5AC8' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#F1EEE4',
        'surface-1': '#F7F5EE',
        'surface-2': '#FBFAF5',
        'surface-3': '#FBFAF5',
        'text-primary': '#1E2022',
        'text-secondary': '#45484B',
        'text-muted': '#585C5F',
      },
    },
  },
  dark: {
    roles: { accent: '#DC9E12', warning: '#E8742A' },
    gray: {
      anchors: {
        'surface-0': '#151A30',
        'surface-1': '#1B2140',
        'surface-2': '#222949',
        'surface-3': '#262E50',
        'text-primary': '#F1EEE4',
        'text-secondary': '#D5D6DC',
        'text-muted': '#AEB2C4',
      },
    },
  },
})

// A sticker sheet drifting slowly: ruler on the left edge, a contained dot field, four pigments.
// Everything sits at the edges; the middle (words) and the foot (message box) stay clear.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.f{transform-box:fill-box;transform-origin:center}
.a{animation:spin 90s linear infinite}
.b{animation:bob 14s ease-in-out infinite}
.c{animation:bob 18s ease-in-out -6s infinite}
.d{animation:bob 22s ease-in-out -11s infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@media (prefers-reduced-motion:reduce){.a,.b,.c,.d{animation:none}}
</style>
<defs>
<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.6" fill="#8D938F"/></pattern>
</defs>
<rect x="56" y="48" width="336" height="216" fill="url(#dots)" opacity="0.6"/>
<g stroke="#8D938F" stroke-width="2" opacity="0.55">
<line x1="20" y1="0" x2="20" y2="1000"/>
<path d="M20 40h14M20 80h14M20 120h14M20 160h14M20 200h26M20 240h14M20 280h14M20 320h14M20 360h14M20 400h26M20 440h14M20 480h14M20 520h14M20 560h14M20 600h26M20 640h14M20 680h14M20 720h14M20 760h14M20 800h26M20 840h14M20 880h14M20 920h14M20 960h14"/>
</g>
<rect class="f a" x="1380" y="70" width="130" height="130" fill="#DC9E12" opacity="0.9"/>
<circle class="f b" cx="1650" cy="640" r="190" fill="#D54C25" opacity="0.88"/>
<circle class="f c" cx="-30" cy="700" r="140" fill="none" stroke="#3A5BD9" stroke-width="30" opacity="0.85"/>
<path class="f d" d="M1180 70 L1260 210 L1100 210 Z" fill="#008F77" opacity="0.88"/>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'sticker-sheet', glass: { blur: 10, opacity: 0.6 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return h(Svg, {
      source: SCENE,
      alt: 'A sticker sheet drifting: ruler, dot field, four pigments',
      isInteractive: true,
    }) as RenderElement
  })
}
