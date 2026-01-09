
const start = Date.parse('2022-02-24T03:00:00Z');
const timer = document.getElementById('timer');

function tick(){
  const diff = Math.floor((Date.now() - start) / 1000);

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

 
  timer.innerHTML = `
    <div class="t"><b>${days}</b><span>ДНЕЙ</span></div>
    <div class="t"><b>${hours}</b><span>ЧАСОВ</span></div>
    <div class="t"><b>${minutes}</b><span>МИН</span></div>
    <div class="t"><b>${seconds}</b><span>СЕК</span></div>
  `;
}
tick();
setInterval(tick,1000);


const snow = document.getElementById('snow');
setInterval(()=>{
 
  for(let i=0;i<4;i++){
    const d=document.createElement('div');
    d.className='drop';
    d.style.left=Math.random()*100+'vw';
    d.style.animationDuration=(Math.random()*5+6)+'s';
    snow.appendChild(d);
    setTimeout(()=>d.remove(),12000);
  }
},300);


const PHOTO_DURATION_MS = 30000;
const HERO_VISIBLE_MS = 5000;
const MARQUEE_DURATION_MS = PHOTO_DURATION_MS;

const lvivPhotos = [
  {
    src: 'Assets/ap-lviv/lviv-01.jpg',
    caption: 'Христианка молится у мемориала павшим солдатам в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-02.jpg',
    caption: 'Христианка молится во время воскресной службы в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-03.jpg',
    caption: 'Использованные военные боеприпасы и христианские иконы украшают мемориал павшим солдатам в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-04.jpg',
    caption: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-05.jpg',
    caption: 'Украинский мужчина в военной форме молится внутри гарнизонного храма Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-06.jpg',
    caption: 'Христиане стоят рядом с мемориалом павшим солдатам во время воскресной службы в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-07.jpg',
    caption: 'Христианка молится перед фотографиями павших солдат в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-08.jpg',
    caption: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-09.jpg',
    caption: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-10.jpg',
    caption: 'Украинские греко-католические священники проводят воскресную мессу в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-11.jpg',
    caption: 'Христиане зажигают свечи и молятся после воскресной мессы внутри гарнизонного храма Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-12.jpg',
    caption: 'Пожертвованная одежда и коврики для сна хранятся внутри церкви во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-13.jpg',
    caption: 'Украинцы в военной форме разговаривают внутри гарнизонного храма Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-14.jpg',
    caption: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
    credit: 'AP Photo/Bernat Armangue',
  },
];

let lvivIndex = 0;
let heroTimeout = null;

function updateTicker(photo){
  const author = document.querySelector('.author');
  if(!author){
    return;
  }
  author.innerHTML = '';
  const captionSpan = document.createElement('span');
  captionSpan.className = 'yellow';
  captionSpan.textContent = photo.caption;
  const creditSpan = document.createElement('span');
  creditSpan.className = 'blue';
  creditSpan.textContent = ` Photo: ${photo.credit}`;
  author.appendChild(captionSpan);
  author.appendChild(creditSpan);

 
  author.style.animation = 'none';
  void author.offsetWidth;
  author.style.animation = `marquee ${MARQUEE_DURATION_MS / 1000}s linear 1`;
}

function buildSharePageUrl(photo){
  const base = window.NOWAR_BASE_URL;
  const origin = base || (window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'https://in-driver.ru');
  const filename = photo.src.split('/').pop() || 'lviv-01.jpg';
  const slug = filename.replace(/\.[^.]+$/, '');
  return `${origin}/share/${slug}.html`;
}

function updateShareLinks(photo){
  const shareUrl = buildSharePageUrl(photo);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent('STOP THE WAR');
  const links = {
    fb: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    tw: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
    vk: `https://vk.com/share.php?url=${encodedUrl}`,
    wa: `https://wa.me/?text=${encodedUrl}`,
    sig: `https://signal.me/#/?text=${encodedUrl}`,
    tg: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    rd: `https://www.reddit.com/submit?url=${encodedUrl}`,
    mail: `mailto:nowar@putinpidoras.shop?subject=STOP%20THE%20WAR&body=${encodedUrl}`,
  };

  Object.entries(links).forEach(([className, href])=>{
    const el = document.querySelector(`.social .${className}`);
    if(el){
      el.href = href;
    }
  });
}

function rotateLvivBackground(){
  if(!lvivPhotos.length){
    return;
  }
  const photo = lvivPhotos[lvivIndex];
  document.body.classList.remove('hero-hidden');
  if(heroTimeout){
    clearTimeout(heroTimeout);
  }
  heroTimeout = setTimeout(()=>{
    document.body.classList.add('hero-hidden');
  }, HERO_VISIBLE_MS);
  document.body.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('${photo.src}')`;
  updateTicker(photo);
  updateShareLinks(photo);
  lvivIndex = (lvivIndex + 1) % lvivPhotos.length;
}

rotateLvivBackground();
setInterval(rotateLvivBackground, PHOTO_DURATION_MS);


const NPU_NEWS_DATA_URL = 'data/npu-news.json';

function shorten(text, limit = 90){
  if(text.length <= limit){
    return text;
  }
  return `${text.slice(0, limit - 1).trim()}…`;
}

function renderNpuNews(items){
  const container = document.getElementById('npu-news');
  if(!container){
    return;
  }
  container.innerHTML = '';
  if(!items.length){
    container.textContent = 'Новостей не найдено.';
    return;
  }

  items.forEach((item)=>{
    const card = document.createElement('article');
    card.className = 'news-card';

    const link = document.createElement('a');
    link.className = 'news-link';
    link.href = item.pageUrl || item.link || '#';
    link.target = '_blank';
    link.rel = 'noreferrer';

    if(item.image){
      const img = document.createElement('img');
      img.className = 'news-media';
      img.src = item.image;
      img.alt = item.title || '';
      img.loading = 'lazy';
      link.appendChild(img);
    }else{
      const media = document.createElement('div');
      media.className = 'news-media';
      link.appendChild(media);
    }

    const body = document.createElement('div');
    body.className = 'news-body';

    if(item.time){
      const time = document.createElement('div');
      time.className = 'news-time';
      time.textContent = item.time;
      body.appendChild(time);
    }

    const title = document.createElement('div');
    title.className = 'news-item-title';
    title.textContent = item.shortTitle || item.title || '';
    body.appendChild(title);

    if(item.excerpt){
      const excerpt = document.createElement('div');
      excerpt.className = 'news-excerpt';
      excerpt.textContent = item.excerpt;
      body.appendChild(excerpt);
    }

    link.appendChild(body);
    card.appendChild(link);
    container.appendChild(card);
  });
}

function getTranslateConfig(){
  if(typeof window === 'undefined'){
    return null;
  }
  const key = window.NOWAR_TRANSLATE_KEY;
  if(!key || key === 'PUT_TRANSLATE_API_KEY_HERE'){
    return null;
  }
  const endpoint = window.NOWAR_TRANSLATE_ENDPOINT ||
    'https://translation.googleapis.com/language/translate/v2';
  return { key, endpoint };
}

async function translateTexts(texts, source, target){
  const config = getTranslateConfig();
  if(!config || !texts.length){
    return texts;
  }
  const res = await fetch(`${config.endpoint}?key=${encodeURIComponent(config.key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      q: texts,
      source,
      target,
      format: 'text',
    }),
  });
  if(!res.ok){
    throw new Error('Translate failed');
  }
  const data = await res.json();
  const translations = data?.data?.translations || [];
  return translations.map((t)=>t.translatedText || '');
}

async function translateNewsItems(items){
  const texts = [];
  const map = [];
  items.forEach((item, index)=>{
    if(item.title){
      map.push({ index, field: 'title', pos: texts.length });
      texts.push(item.title);
    }
    if(item.excerpt){
      map.push({ index, field: 'excerpt', pos: texts.length });
      texts.push(item.excerpt);
    }
  });
  if(!texts.length){
    return items;
  }
  try{
    const translated = await translateTexts(texts, 'uk', 'ru');
    map.forEach(({ index, field, pos })=>{
      if(translated[pos]){
        items[index][field] = translated[pos];
      }
    });
    items.forEach((item)=>{
      if(item.title){
        item.shortTitle = shorten(item.title);
      }
    });
  }catch(e){
    console.error('Translate failed', e);
  }
  return items;
}

async function loadNpuNews(){
  try{
    const container = document.getElementById('npu-news');
    if(container){
      container.textContent = 'Загружаем новости...';
    }
    const res = await fetch(NPU_NEWS_DATA_URL, { cache: 'no-store' });
    if(!res.ok){
      throw new Error('NPU data fetch failed');
    }
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const translated = await translateNewsItems(items);
    renderNpuNews(translated);
  }catch(e){
    console.error('NPU news failed', e);
    const container = document.getElementById('npu-news');
    if(container){
      container.textContent = 'Не удалось загрузить новости.';
    }
  }
}

loadNpuNews();
