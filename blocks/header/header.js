import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch header content
  const navPath = getMetadata('header') || '/header';
  const resp = await fetch(`${navPath}.plain.html`, window.location.pathname.endsWith('/header') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;

    /* Snatch information from document */
    const firstSection = temp.children[0];
    const tempLogo = firstSection.children[0];
    const logoPicture = tempLogo.querySelector('picture');
    const logoLink = document.createElement('a');
    const logoLinkRef = tempLogo.children[0]?.children[1]?.textContent;
    const logoAltText = tempLogo.children[0]?.children[2]?.textContent;
    const menuRight = tempLogo.children[0]?.children[3];
    temp.remove();

    const logo = document.createElement('div');
    logo.classList.add("logo");
    logoLink.setAttribute('href', logoLinkRef);
    logoLink.appendChild(logoPicture);
    logo.appendChild(logoLink);

    logoPicture.querySelector('img').setAttribute('alt', logoAltText);
    menuRight.classList.add('top-menu-right');

    block.appendChild(logo);
    block.appendChild(menuRight);
  }
}
