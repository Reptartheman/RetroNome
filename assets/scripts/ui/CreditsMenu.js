/**
 * CreditsMenu - Shows credits/links on the screen
 * Toggled by tapping the "RetroNome v2" brand text
 */

import { ScreenMenu } from './ScreenMenu.js';

const LINKS = [
  { label: 'GITHUB', url: '#' },
  { label: 'COFFEE', url: '#' },
  { label: 'WEBSITE', url: '#' },
];

class CreditsMenu extends ScreenMenu {
  constructor() {
    super('credits-menu');
  }

  _createMenu() {
    const menu = document.createElement('div');
    menu.className = 'credits-menu';

    const title = document.createElement('div');
    title.className = 'credits-title';
    title.textContent = 'CREDITS';
    menu.appendChild(title);

    const byline = document.createElement('div');
    byline.className = 'credits-byline';
    byline.textContent = 'by Jeff Moro';
    menu.appendChild(byline);

    const linksContainer = document.createElement('div');
    linksContainer.className = 'credits-links';

    LINKS.forEach(({ label, url }) => {
      const link = document.createElement('a');
      link.className = 'credits-link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = label;
      linksContainer.appendChild(link);
    });

    menu.appendChild(linksContainer);
    return menu;
  }
}

// Export singleton instance
export const creditsMenu = new CreditsMenu();
