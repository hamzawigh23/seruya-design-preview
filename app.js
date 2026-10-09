const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
});
const closeNavigation = () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
};
navigation.querySelectorAll('a,button').forEach(el => el.addEventListener('click', closeNavigation));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNavigation(); });
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.querySelectorAll('[data-close]').forEach(link => link.addEventListener('click', () => dialog.close()));
});
const products = {
  fragrance: { brand: 'THE ART OF FRAGRANCE', title: 'Find your signature.', image: 'assets/campaign-noir.webp', description: 'Explore fragrance from Tom Ford, Bvlgari and other exceptional houses with the S.M. Seruya team. Discover the notes and compositions that feel like you.' },
  skincare: { brand: 'YOUR DAILY RITUAL', title: 'A moment for you.', image: 'assets/campaign-beauty.webp', description: 'Explore skincare from La Mer and other beauty houses, with personalised guidance from the team. Discover a routine suited to you.' },
  niche: { brand: 'UNEXPECTED DISCOVERIES', title: 'Beyond the familiar.', image: 'assets/campaign-light.webp', description: 'Explore distinctive fragrance houses including Creed, Diptyque and Maison Francis Kurkdjian. Discover the collection in store with a fragrance adviser.' }
};
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
  const p = products[button.dataset.product];
  document.getElementById('product-brand').textContent = p.brand;
  document.getElementById('product-title').textContent = p.title;
  document.getElementById('product-description').textContent = p.description;
  const image = document.getElementById('product-image'); image.src = p.image; image.alt = 'Original campaign concept for ' + p.brand.toLowerCase(); image.style.objectPosition = button.dataset.product === 'skincare' ? '72% center' : 'center';
  document.getElementById('product-dialog').showModal();
}));
const brands = ['Acqua di Parma','Aveda','Benefit','Bobbi Brown','Bvlgari','Chanel','Christian Dior','Clarins','Clinique','Creed','Diptyque','Drunk Elephant','Elemis','Estée Lauder','Frédéric Malle','Giorgio Armani','Gucci','Hermès','Jo Malone','Kilian','La Mer','La Prairie','Lancôme','L’Occitane','M·A·C','Maison Francis Kurkdjian','Maison Margiela','Medik8','Molton Brown','Moroccanoil','NARS','Parfums de Marly','Penhaligon’s','Prada','Rituals','Shiseido','Sisley','Sol de Janeiro','Tom Ford','Valentino','Versace','Xerjoff','Yves Saint Laurent'];
const search = document.getElementById('brand-search');
function renderBrands() {
  const found = brands.filter(name => name.toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase()));
  const directory = document.getElementById('brand-directory'); directory.replaceChildren();
  found.forEach(name => { const entry = document.createElement('span'); entry.textContent = name; directory.appendChild(entry); });
  document.getElementById('brand-status').textContent = found.length ? `${found.length} featured brands` : 'No matching brand in this selection. Try another name or contact our team.';
}
search.addEventListener('input', renderBrands); renderBrands();

// Nocturne-inspired editorial scenes; no third-party animation dependencies.
const edits = [
  {number:'01', category:'FRAGRANCE · YOUR SIGNATURE', copy:'A scent.<br>A memory.<br><em>Entirely yours.</em>', description:'Explore Tom Ford, Bvlgari and the extraordinary world of fragrance at S.M. Seruya.', image:'assets/campaign-noir.webp', alt:'Amber fragrance campaign concept', caption:'THE ART OF FRAGRANCE', product:'fragrance', label:'Explore fragrances', className:''},
  {number:'02', category:'SKINCARE · THE DAILY RITUAL', copy:'Slow down.<br>Take care.<br><em>Make it a ritual.</em>', description:'Explore La Mer skincare and find a little space for yourself, with personal guidance from our team.', image:'assets/campaign-beauty.webp', alt:'Luminous skin in a beauty campaign concept', caption:'BEAUTY · A PERSONAL RITUAL', product:'skincare', label:'Explore skincare', className:'skincare'},
  {number:'03', category:'NICHE FRAGRANCE · A PERSONAL DISCOVERY', copy:'Beyond familiar.<br>Beyond expected.<br><em>Find your signature.</em>', description:'Discover Creed and a world of distinctive fragrance houses, from Diptyque to Maison Francis Kurkdjian.', image:'assets/campaign-light.webp', alt:'Sculptural fragrance campaign concept', caption:'THE UNEXPECTED · NICHE FRAGRANCE', product:'niche', label:'Explore niche fragrance', className:'niche'}
];
document.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => {
  const data = edits[Number(button.dataset.edit)];
  document.querySelectorAll('[data-edit]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  document.getElementById('edit-number').textContent=data.number;
  document.getElementById('edit-category').textContent=data.category;
  document.getElementById('edit-copy').innerHTML=data.copy;
  document.getElementById('edit-description').textContent=data.description;
  const image=document.getElementById('edit-image');image.src=data.image;image.alt=data.alt;
  document.querySelector('.edit-visual').className='edit-visual '+data.className;
  document.getElementById('edit-image-caption').textContent=data.caption;
  const details=document.getElementById('edit-details');details.dataset.product=data.product;details.textContent=data.label;
  const panel=document.querySelector('.edit-panel');panel.classList.remove('flash');requestAnimationFrame(()=>panel.classList.add('flash'));
}));
