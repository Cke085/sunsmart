// src/data/clothing.js

export const clothingItems = [
  {
    id: 1,
    icon: '🎩',
    name: 'Broad Brim Hat',
    desc: 'Shields your face, ears and neck from the sun. Pick a hat with a wide brim all the way around. At UV 6+, choose one with a UPF 50+ label.',
    badge: 'recommended', // default, upgrades to must at UV 6+
    minUV: 3
  },
  {
    id: 2,
    icon: '👕',
    name: 'Long Sleeve Top',
    desc: 'Covers your arms and shoulders. At UV 6+, go for UPF 50+ fabric, it blocks over 97% of UV rays.',
    badge: 'recommended',
    minUV: 3
  },
  {
    id: 3,
    icon: '👖',
    name: 'Long Pants or Skirt',
    desc: 'Keeps your legs covered and out of direct sun. At UV 6+, look for UPF 40–50+ rated fabric.',
    badge: 'recommended',
    minUV: 3
  },
  {
    id: 4,
    icon: '🕶️',
    name: 'UV Sunglasses',
    desc: 'Protects your eyes from UV damage. At UV 6+, wraparound frames block UV from the sides too.',
    badge: 'recommended',
    minUV: 3
  },
  {
    id: 5,
    icon: '🧢',
    name: 'Baseball Cap',
    desc: 'Covers the top of your head but leaves your ears and neck fully exposed, not enough on a sunny day.',
    badge: 'avoid', // always avoid, never changes
    minUV: 3
  },
  {
    id: 6,
    icon: '👚',
    name: 'Singlet / Tank Top',
    desc: 'Leaves your arms and shoulders bare, too much skin exposed when UV is 3 or above.',
    badge: 'avoid',
    minUV: 3
  },
  {
    id: 7,
    icon: '🩳',
    name: 'Shorts',
    desc: 'Your legs get a lot of sun exposure in shorts, swap for light long pants or a skirt instead.',
    badge: 'avoid',
    minUV: 3
  }
]
