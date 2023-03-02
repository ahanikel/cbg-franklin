import { getMetadata, decorateIcons, decorateButtons } from '../../scripts/lib-franklin.js';

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
    const m1 = menuRight.querySelector('ul');
    const m2 = m1.querySelector('ul');
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.appendChild(m2);
    p.appendChild(a);
    m1.remove(m2);
    m1.appendChild(p);

    for (let li of m2.querySelectorAll('li')) {
        const text = li.childNodes[0];
        const a = document.createElement('a');
        li.removeChild(text);
        a.appendChild(text);
        a.setAttribute('href', '#');
        li.appendChild(a);
    }

    const leftItems = document.createElement('div');
    leftItems.classList.add('align-left');
    leftItems.appendChild(logo);

    const breadCrumb = document.createElement('p');
    breadCrumb.classList.add('breadcrumb');
    for (let item of ['bread', 'crumb', 'path']) {
        const p = document.createElement('span');
        p.textContent = item;
        breadCrumb.appendChild(p);
    }
    leftItems.appendChild(breadCrumb);

    const rightItem = document.createElement('nav');
    const headerMenuToggle = document.createElement('input');
    headerMenuToggle.setAttribute('type', 'checkbox');
    headerMenuToggle.id = 'header-menu-toggle';

    const headerMenuIcon = document.createElement('label');
    headerMenuIcon.setAttribute('for', headerMenuToggle.id);
    headerMenuIcon.classList.add('header-menu-icon');
    headerMenuIcon.textContent = '☰';
    m2.classList.add('header-menu-right');

    rightItem.appendChild(headerMenuToggle);
    rightItem.appendChild(m2);
    rightItem.appendChild(headerMenuIcon);
    block.appendChild(leftItems);
    block.appendChild(rightItem);
    decorateButtons(m1);
  }
}
