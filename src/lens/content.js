// Each stop is a roll of film. One frame is in the gate at a time, and the
// shutter reveals only that frame's card, so every line here has to stand
// alone -- there is no surrounding paragraph to lean on.
export const FRAMES = {
  rest: [
    {
      id: 'name',
      caption: 'Nayeem',
      title: 'Nayeem Rahman',
      line: 'Tinkerer and product manager.',
      tone: 'ink',
    },
    {
      id: 'building',
      caption: 'Building',
      title: 'I build small things',
      line: 'Voice agents, side projects, and tools I actually use.',
      tone: 'bronze',
    },
    {
      id: 'place',
      caption: 'New York',
      title: 'Usually with a camera',
      line: 'Walking the city and pointing a lens at it.',
      tone: 'teal',
    },
  ],
  about: [
    {
      id: 'memory',
      caption: 'Memory',
      title: 'Memory and connection',
      line: 'I like building things that hold onto a moment.',
      tone: 'teal',
    },
    {
      id: 'craft',
      caption: 'Craft',
      title: 'Code and photography',
      line: 'Two ways of paying attention to the same thing.',
      tone: 'bronze',
    },
    {
      id: 'work',
      caption: 'Day job',
      title: 'Product management',
      line: 'Shipping with people who are sharper than me.',
      tone: 'ink',
    },
  ],
  work: [
    {
      id: 'reston',
      caption: 'Reston',
      title: 'Reston',
      line: 'Voice AI for the hours between therapy sessions.',
      action: { label: 'Open', href: 'https://reston-nayeemrahman13.replit.app/' },
      tone: 'teal',
    },
    {
      id: 'voice-agent',
      caption: 'Voice',
      title: 'Voice agent',
      line: 'Customer support that can speak like Yoda, if you look.',
      action: {
        label: 'Open',
        href: 'https://regal-voice-ai-agent-nayeemrahman13.replit.app/',
      },
      tone: 'bronze',
    },
    {
      id: 'resume-agent',
      caption: 'Résumé',
      title: 'Resume agent',
      line: 'Ask it what I have done. It answers out loud.',
      tone: 'ink',
    },
  ],
  photos: [
    {
      id: 'japan',
      caption: 'Japan',
      title: 'Japan',
      line: 'Fifteen days across Tokyo, Hakone, Kyoto, and Osaka.',
      art: '/lens/film/japan.svg',
      tone: 'japan',
    },
    {
      id: 'southwest',
      caption: 'Southwest',
      title: 'American Southwest',
      line: 'Grand Canyon, Zion, Bryce, and the long light between.',
      art: '/lens/film/southwest.svg',
      tone: 'southwest',
    },
    {
      id: 'acadia',
      caption: 'Acadia',
      title: 'Acadia',
      line: 'We abandoned the car. The week was still a good one.',
      art: '/lens/film/acadia.svg',
      tone: 'acadia',
    },
  ],
  contact: [
    {
      id: 'email',
      caption: 'Email',
      title: 'Say hello',
      line: 'Collaboration, a walk, or nothing in particular.',
      action: { label: 'nayeemr613@gmail.com', href: 'mailto:nayeemr613@gmail.com' },
      tone: 'bronze',
    },
    {
      id: 'resume',
      caption: 'Résumé',
      title: 'Ask my resume',
      line: 'The agent in the corner has read it. Talk to it.',
      tone: 'teal',
    },
    {
      id: 'site',
      caption: 'Site',
      title: 'nayeem.nyc',
      line: 'This page, and whatever it turns into next.',
      tone: 'ink',
    },
  ],
};

export function framesForStop(stopId) {
  return FRAMES[stopId] ?? FRAMES.rest;
}
