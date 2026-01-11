
const start = Date.parse('2022-02-24T03:00:00Z');
const timer = document.getElementById('timer');
const isSimplePage = document.body?.dataset?.simplePage === 'true';
const simplePageCityKey = document.body?.dataset?.city || '';
const defaultTitle = document.title;

const PHOTO_DURATION_MS = 30000;
const HERO_VISIBLE_MS = 5000;
const MARQUEE_DURATION_MS = PHOTO_DURATION_MS;

const translations = {
  ru: {
    timer_title: 'ВОЙНА, КОТОРУЮ РАЗВЯЗАЛ ЛИЧНО ПУТИН, ПРОДОЛЖАЕТСЯ:',
    losses_title: 'ПОТЕРИ',
    losses_value_1: '400&nbsp;т.<br>человек',
    losses_value_2: '1&nbsp;млн.<br>человек',
    hero_title: 'STOP THE WAR',
    hero_line_1: 'НЕТ ВОЙНЕ!',
    hero_line_2: 'СВОБОДУ УКРАИНЕ',
    hero_line_3: 'ПУТИН - ВОЕННЫЙ ПРЕСТУПНИК',
    hero_line_4: 'ПРЕКРАТИТЕ ВОЙНУ СЕЙЧАС',
    city_button: 'ПРЕСТУПЛЕНИЯ ПУТИНА В УКРАИНЕ',
    back_button: 'Назад',
    city_info_title: 'Военные преступления',
    info_major_destruction: 'Разрушения',
    info_reported_war_crimes: 'Военные преступления',
    info_missile_attacks: 'Ракетные удары',
    info_air_strikes: 'Авиаудары',
    info_siege: 'Осада',
    info_weapon_type_reported: 'Вооружение',
    info_authoritative_sources: 'Источники',
    sources_modal_title: 'Источники',
  },
  uk: {
    timer_title: "ВІЙНА, ЯКУ РОЗВ'ЯЗАВ ОСОБИСТО ПУТІН, ТРИВАЄ:",
    losses_title: 'ВТРАТИ',
    losses_value_1: '400&nbsp;тис.<br>людей',
    losses_value_2: '1&nbsp;млн<br>людей',
    hero_title: 'ЗУПИНІТЬ ВІЙНУ',
    hero_line_1: 'НІ ВІЙНІ!',
    hero_line_2: 'СВОБОДУ УКРАЇНІ',
    hero_line_3: 'ПУТІН - ВОЄННИЙ ЗЛОЧИНЕЦЬ',
    hero_line_4: 'ЗУПИНІТЬ ВІЙНУ ЗАРАЗ',
    city_button: 'ЗЛОЧИНИ ПУТІНА В УКРАЇНІ',
    back_button: 'Назад',
    city_info_title: 'Воєнні злочини',
    info_major_destruction: 'Руйнування',
    info_reported_war_crimes: 'Воєнні злочини',
    info_missile_attacks: 'Ракетні удари',
    info_air_strikes: 'Авіаудари',
    info_siege: 'Облога',
    info_weapon_type_reported: 'Озброєння',
    info_authoritative_sources: 'Джерела',
    sources_modal_title: 'Джерела',
  },
  en: {
    timer_title: 'THE WAR STARTED PERSONALLY BY PUTIN CONTINUES:',
    losses_title: 'LOSSES',
    losses_value_1: '400&nbsp;k<br>people',
    losses_value_2: '1&nbsp;m<br>people',
    hero_title: 'STOP THE WAR',
    hero_line_1: 'NO TO WAR!',
    hero_line_2: 'FREEDOM FOR UKRAINE',
    hero_line_3: 'PUTIN IS A WAR CRIMINAL',
    hero_line_4: 'END THE WAR NOW',
    city_button: 'PUTIN CRIMES IN UKRAINE',
    back_button: 'Back',
    city_info_title: 'War crimes',
    info_major_destruction: 'Destruction',
    info_reported_war_crimes: 'War crimes',
    info_missile_attacks: 'Missile strikes',
    info_air_strikes: 'Air strikes',
    info_siege: 'Siege',
    info_weapon_type_reported: 'Weaponry',
    info_authoritative_sources: 'Sources',
    sources_modal_title: 'Sources',
  },
};

const timerLabels = {
  ru: { days: 'ДНЕЙ', hours: 'ЧАСОВ', minutes: 'МИН', seconds: 'СЕК' },
  uk: { days: 'ДНІВ', hours: 'ГОДИН', minutes: 'ХВ', seconds: 'СЕК' },
  en: { days: 'DAYS', hours: 'HOURS', minutes: 'MIN', seconds: 'SEC' },
};

const creditLabels = {
  ru: ' Фото: ',
  uk: ' Фото: ',
  en: ' Photo: ',
};

const availableLangs = ['uk', 'en', 'ru'];
let currentLang = 'ru';
let currentPhoto = null;
let heroTimeout = null;
let cities = [];
let activeCity = null;
let lvivInterval = null;

const cityButton = document.querySelector('.city-button button');
const cityMenu = document.getElementById('city-menu');
const cityList = document.getElementById('city-list');

function buildCrimeTitle(cityName){
  if(currentLang === 'uk'){
    return `Злочини: ${cityName}`;
  }
  if(currentLang === 'en'){
    return `Crimes: ${cityName}`;
  }
  return `Преступления: ${cityName}`;
}

function getCityKey(city){
  const raw = city.en || city.name_en || city.ru || city.name_ru || '';
  return raw.toLowerCase().replace(/\s+/g, '-');
}

function openCityCrimePage(city){
  if(isSimplePage){
    return;
  }
  setActiveCity(city);
}

function setActiveCity(city){
  if(!city){
    return;
  }
  activeCity = city;
  if(heroTimeout){
    clearTimeout(heroTimeout);
  }
  document.body.classList.remove('hero-hidden');
  const cityKey = getCityKey(city);
  document.body.dataset.city = cityKey;
  document.body.dataset.cityRu = city.ru || city.name_ru || '';
  document.body.dataset.cityUk = city.uk || city.name_uk || '';
  document.body.dataset.cityEn = city.en || city.name_en || '';
  document.body.classList.add('city-mode');
  updateCityPageTitle();
  updateCityInfo(city);
  stopLvivRotation();
  if(cityKey === 'mariupol'){
    loadMariupolPhotos();
  }else{
    stopMariupolRotation();
  }
}

function clearActiveCity(){
  if(isSimplePage){
    return;
  }
  activeCity = null;
  delete document.body.dataset.city;
  delete document.body.dataset.cityRu;
  delete document.body.dataset.cityUk;
  delete document.body.dataset.cityEn;
  document.body.classList.remove('city-mode');
  updateCityPageTitle();
  updateCityInfo(null);
  stopMariupolRotation();
  startLvivRotation();
}

function getCityName(city, lang){
  if(lang === 'uk'){
    return city.uk || city.name_uk || '';
  }
  if(lang === 'en'){
    return city.en || city.name_en || '';
  }
  return city.ru || city.name_ru || '';
}

function renderCityList(){
  if(!cityList){
    return;
  }
  cityList.innerHTML = '';
  if(!cities.length){
    return;
  }
  cities.forEach((city)=>{
    const item = document.createElement('li');
    item.className = 'city-item';
    item.setAttribute('role', 'button');
    item.tabIndex = 0;
    item.textContent = getCityName(city, currentLang);
    item.addEventListener('click', ()=>{
      openCityCrimePage(city);
      setCityMenuOpen(false);
    });
    item.addEventListener('keydown', (event)=>{
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        openCityCrimePage(city);
        setCityMenuOpen(false);
      }
    });
    cityList.appendChild(item);
  });
}

async function loadCities(){
  try{
    const res = await fetch('data/goroda.json', { cache: 'no-store' });
    if(!res.ok){
      throw new Error('Cities fetch failed');
    }
    const data = await res.json();
    if(Array.isArray(data.reported_war_crimes_locations)){
      cities = data.reported_war_crimes_locations;
    }else if(Array.isArray(data.major_damage_cities)){
      cities = data.major_damage_cities;
    }else if(Array.isArray(data.cities)){
      cities = data.cities;
    }else{
      cities = [];
    }
    renderCityList();
  }catch(e){
    console.error('Cities load failed', e);
  }
}

function setCityMenuOpen(isOpen){
  if(!cityMenu){
    return;
  }
  cityMenu.classList.toggle('open', isOpen);
  cityMenu.setAttribute('aria-hidden', String(!isOpen));
  if(cityButton){
    cityButton.parentElement.classList.toggle('active', isOpen);
  }
  if(isSimplePage){
    document.body.classList.toggle('menu-open', isOpen);
    return;
  }
  if(!isSimplePage){
    if(isOpen){
      if(heroTimeout){
        clearTimeout(heroTimeout);
      }
      document.body.classList.add('hero-hidden');
    }else{
      showHeroNow();
    }
  }
}

if(cityButton){
  cityButton.addEventListener('click', ()=>{
    const isOpen = cityMenu && cityMenu.classList.contains('open');
    setCityMenuOpen(!isOpen);
  });
}

document.addEventListener('click', (event)=>{
  if(!cityMenu || !cityButton){
    return;
  }
  const target = event.target;
  if(cityMenu.contains(target) || cityButton.contains(target)){
    return;
  }
  setCityMenuOpen(false);
});

function getInitialLang(){
  const stored = localStorage.getItem('nowar_lang');
  if(stored && availableLangs.includes(stored)){
    return stored;
  }
  const browserLang = (navigator.language || '').toLowerCase();
  if(browserLang.startsWith('uk')){
    return 'uk';
  }
  if(browserLang.startsWith('en')){
    return 'en';
  }
  if(browserLang.startsWith('ru')){
    return 'ru';
  }
  return 'ru';
}

function showHeroNow(){
  if(isSimplePage){
    return;
  }
  document.body.classList.remove('hero-hidden');
  if(heroTimeout){
    clearTimeout(heroTimeout);
  }
  heroTimeout = setTimeout(()=>{
    document.body.classList.add('hero-hidden');
  }, HERO_VISIBLE_MS);
}

function getTimerLabels(){
  return timerLabels[currentLang] || timerLabels.ru;
}

function getCreditLabel(){
  return creditLabels[currentLang] || creditLabels.ru;
}

function updateLangButtons(lang){
  document.querySelectorAll('.lang-switch button[data-lang]').forEach((button)=>{
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function applyTranslations(lang){
  const bundle = translations[lang] || translations.ru;
  document.querySelectorAll('[data-i18n]').forEach((el)=>{
    const key = el.dataset.i18n;
    if(bundle[key]){
      el.textContent = bundle[key];
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el)=>{
    const key = el.dataset.i18nHtml;
    if(bundle[key]){
      el.innerHTML = bundle[key];
    }
  });
  document.documentElement.lang = lang;
  updateLangButtons(lang);
  renderCityList();
  tick();
  if(currentPhoto){
    updateTicker(currentPhoto);
  }
  updateCityPageTitle();
}

function getActiveCityName(lang){
  if(activeCity){
    return getCityName(activeCity, lang);
  }
  if(isSimplePage){
    if(lang === 'uk'){
      return document.body?.dataset?.cityUk || '';
    }
    if(lang === 'en'){
      return document.body?.dataset?.cityEn || '';
    }
    return document.body?.dataset?.cityRu || '';
  }
  return '';
}

function updateCityPageTitle(){
  const name = getActiveCityName(currentLang);
  if(name){
    document.title = buildCrimeTitle(name);
    return;
  }
  if(!isSimplePage){
    document.title = defaultTitle;
  }
}

function updateCityInfo(city){
  const container = document.querySelector('.city-info');
  const items = document.querySelectorAll('.city-info-item[data-city-field]');
  if(!items.length){
    return;
  }
  let hasActive = false;
  items.forEach((item)=>{
    item.classList.remove('is-active');
    if(!city){
      return;
    }
    const field = item.dataset.cityField;
    if(!field){
      return;
    }
    const value = city[field];
    const isActive = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if(isActive){
      item.classList.add('is-active');
      hasActive = true;
    }
  });
  if(container){
    container.classList.toggle('has-items', hasActive);
  }
}

function setLanguage(lang){
  if(!availableLangs.includes(lang)){
    return;
  }
  currentLang = lang;
  localStorage.setItem('nowar_lang', lang);
  applyTranslations(lang);
  if(!isSimplePage && document.body.classList.contains('hero-hidden')){
    showHeroNow();
  }
}

document.querySelectorAll('.lang-switch button[data-lang]').forEach((button)=>{
  button.addEventListener('click', ()=>{
    setLanguage(button.dataset.lang);
  });
});

const backButton = document.querySelector('.back-button');
if(backButton){
  backButton.addEventListener('click', ()=>{
    clearActiveCity();
  });
}

const sourcesModal = document.getElementById('sources-modal');
const sourcesModalBody = document.getElementById('sources-modal-body');
const sourcesTriggers = document.querySelectorAll('.city-info-item[data-city-field="authoritative_sources"]');

function getSourceLabel(url){
  try{
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    if(hostname === 'ohchr.org'){
      return 'OHCHR';
    }
    if(hostname === 'amnesty.org'){
      return 'Amnesty International';
    }
    if(hostname === 'hrw.org'){
      return 'Human Rights Watch';
    }
    return hostname;
  }catch{
    return url;
  }
}

function openSourcesModal(){
  if(!sourcesModal || !sourcesModalBody || !activeCity){
    return;
  }
  const sources = Array.isArray(activeCity.authoritative_sources)
    ? activeCity.authoritative_sources
    : [];
  if(!sources.length){
    return;
  }
  sourcesModalBody.innerHTML = '';
  sources.forEach((url)=>{
    const card = document.createElement('a');
    card.className = 'source-card';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noreferrer';
    const label = document.createElement('strong');
    label.textContent = getSourceLabel(url);
    const detail = document.createElement('span');
    detail.textContent = url;
    card.appendChild(label);
    card.appendChild(detail);
    sourcesModalBody.appendChild(card);
  });
  sourcesModal.classList.add('is-open');
  sourcesModal.setAttribute('aria-hidden', 'false');
}

function closeSourcesModal(){
  if(!sourcesModal){
    return;
  }
  sourcesModal.classList.remove('is-open');
  sourcesModal.setAttribute('aria-hidden', 'true');
}

sourcesTriggers.forEach((trigger)=>{
  trigger.addEventListener('click', ()=>{
    if(trigger.classList.contains('is-active')){
      openSourcesModal();
    }
  });
});

document.querySelectorAll('[data-modal-close]').forEach((el)=>{
  el.addEventListener('click', closeSourcesModal);
});

document.addEventListener('keydown', (event)=>{
  if(event.key === 'Escape' && sourcesModal?.classList.contains('is-open')){
    closeSourcesModal();
  }
});

setLanguage(getInitialLang());
loadCities();

function tick(){
  const diff = Math.floor((Date.now() - start) / 1000);

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

 
  const labels = getTimerLabels();
  timer.innerHTML = `
    <div class="t"><b>${days}</b><span>${labels.days}</span></div>
    <div class="t"><b>${hours}</b><span>${labels.hours}</span></div>
    <div class="t"><b>${minutes}</b><span>${labels.minutes}</span></div>
    <div class="t"><b>${seconds}</b><span>${labels.seconds}</span></div>
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


const lvivPhotos = [
  {
    src: 'Assets/ap-lviv/lviv-01.jpg',
    caption: {
      ru: 'Христианка молится у мемориала павшим солдатам в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християнка молиться біля меморіалу полеглим солдатам у гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'A Christian woman prays at a memorial to fallen soldiers in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-02.jpg',
    caption: {
      ru: 'Христианка молится во время воскресной службы в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християнка молиться під час недільної служби в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'A Christian woman prays during Sunday service in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-03.jpg',
    caption: {
      ru: 'Использованные военные боеприпасы и христианские иконы украшают мемориал павшим солдатам в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Використані військові боєприпаси та християнські ікони прикрашають меморіал полеглим солдатам у гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Used military ammunition and Christian icons decorate a memorial to fallen soldiers in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-04.jpg',
    caption: {
      ru: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християни присутні на недільній службі в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Christians attend Sunday service in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-05.jpg',
    caption: {
      ru: 'Украинский мужчина в военной форме молится внутри гарнизонного храма Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Український чоловік у військовій формі молиться всередині гарнізонного храму Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'A Ukrainian man in military uniform prays inside the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-06.jpg',
    caption: {
      ru: 'Христиане стоят рядом с мемориалом павшим солдатам во время воскресной службы в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християни стоять поруч із меморіалом полеглим солдатам під час недільної служби в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Christians stand near a memorial to fallen soldiers during Sunday service in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-07.jpg',
    caption: {
      ru: 'Христианка молится перед фотографиями павших солдат в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християнка молиться перед фотографіями полеглих солдатів у гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'A Christian woman prays before photos of fallen soldiers in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-08.jpg',
    caption: {
      ru: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християни присутні на недільній службі в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Christians attend Sunday service in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-09.jpg',
    caption: {
      ru: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християни присутні на недільній службі в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Christians attend Sunday service in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-10.jpg',
    caption: {
      ru: 'Украинские греко-католические священники проводят воскресную мессу в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Українські греко-католицькі священники проводять недільну месу в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Ukrainian Greek Catholic priests lead Sunday Mass in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-11.jpg',
    caption: {
      ru: 'Христиане зажигают свечи и молятся после воскресной мессы внутри гарнизонного храма Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християни запалюють свічки й моляться після недільної меси всередині гарнізонного храму Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Christians light candles and pray after Sunday Mass inside the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-12.jpg',
    caption: {
      ru: 'Пожертвованная одежда и коврики для сна хранятся внутри церкви во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Пожертвуваний одяг і килимки для сну зберігаються всередині церкви у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Donated clothing and sleeping mats are stored inside a church in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-13.jpg',
    caption: {
      ru: 'Украинцы в военной форме разговаривают внутри гарнизонного храма Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Українці у військовій формі розмовляють всередині гарнізонного храму Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Ukrainians in military uniform talk inside the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
  {
    src: 'Assets/ap-lviv/lviv-14.jpg',
    caption: {
      ru: 'Христиане присутствуют на воскресной службе в гарнизонном храме Святых Петра и Павла во Львове, Западная Украина, воскресенье, 6 марта 2022 года.',
      uk: 'Християни присутні на недільній службі в гарнізонному храмі Святих Петра і Павла у Львові, Західна Україна, неділя, 6 березня 2022 року.',
      en: 'Christians attend Sunday service in the Garrison Church of Saints Peter and Paul in Lviv, western Ukraine, Sunday, March 6, 2022.',
    },
    credit: 'AP Photo/Bernat Armangue',
  },
];

const MARIUPOL_PHOTOS_URL = 'data/mariupol-photos.json';
let mariupolPhotos = [];
let mariupolIndex = 0;
let mariupolInterval = null;

let lvivIndex = 0;
function updateTicker(photo){
  const author = document.querySelector('.author');
  if(!author){
    return;
  }
  const caption = (photo.caption && typeof photo.caption === 'object')
    ? (photo.caption[currentLang] || photo.caption.ru || '')
    : (photo.caption || '');
  author.innerHTML = '';
  const captionSpan = document.createElement('span');
  captionSpan.className = 'yellow';
  captionSpan.textContent = caption;
  const creditSpan = document.createElement('span');
  creditSpan.className = 'blue';
  creditSpan.textContent = `${getCreditLabel()}${photo.credit}`;
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
  return origin.replace(/\/$/, '');
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
  currentPhoto = photo;
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

function rotateMariupolBackground(){
  if(!mariupolPhotos.length){
    return;
  }
  const photo = mariupolPhotos[mariupolIndex];
  currentPhoto = photo;
  document.body.style.backgroundImage =
    `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('${photo.src}')`;
  updateTicker(photo);
  updateShareLinks(photo);
  mariupolIndex = (mariupolIndex + 1) % mariupolPhotos.length;
}

function stopMariupolRotation(){
  if(mariupolInterval){
    clearInterval(mariupolInterval);
    mariupolInterval = null;
  }
}

async function loadMariupolPhotos(){
  try{
    const res = await fetch(MARIUPOL_PHOTOS_URL, { cache: 'no-store' });
    if(!res.ok){
      throw new Error('Mariupol photos fetch failed');
    }
    const data = await res.json();
    mariupolPhotos = Array.isArray(data) ? data : [];
    if(!mariupolPhotos.length){
      return;
    }
    rotateMariupolBackground();
    stopMariupolRotation();
    mariupolInterval = setInterval(rotateMariupolBackground, PHOTO_DURATION_MS);
  }catch(e){
    console.error('Mariupol photos load failed', e);
  }
}

function startLvivRotation(){
  if(lvivInterval){
    clearInterval(lvivInterval);
  }
  rotateLvivBackground();
  lvivInterval = setInterval(rotateLvivBackground, PHOTO_DURATION_MS);
}

function stopLvivRotation(){
  if(lvivInterval){
    clearInterval(lvivInterval);
    lvivInterval = null;
  }
}

if(!isSimplePage){
  startLvivRotation();
}else if(simplePageCityKey === 'mariupol'){
  loadMariupolPhotos();
}


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
  const container = document.getElementById('npu-news');
  try{
    if(container){
      container.textContent = 'Загружаем новости...';
    }
    const res = await fetch(NPU_NEWS_DATA_URL, { cache: 'no-store' });
    if(!res.ok){
      if(container){
        container.textContent = 'Новости недоступны.';
      }
      return;
    }
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const translated = await translateNewsItems(items);
    renderNpuNews(translated);
  }catch(e){
    console.warn('NPU news unavailable', e);
    if(container){
      container.textContent = 'Новости недоступны.';
    }
  }
}

loadNpuNews();
