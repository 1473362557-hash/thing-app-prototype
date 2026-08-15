const sheet = document.querySelector('#captureSheet');
const backdrop = document.querySelector('#backdrop');
const select = document.querySelector('#thingSelect');
const toast = document.querySelector('#toast');
const addThingButton = document.querySelector('#addThingButton');
const newThingRow = document.querySelector('#newThingRow');
const newThingName = document.querySelector('#newThingName');
const thingTrigger = document.querySelector('#thingTrigger');
const thingOptions = document.querySelector('#thingOptions');
const shareTrigger = document.querySelector('#shareTrigger');
const visibilityOptions = document.querySelector('#visibilityOptions');
const progressPopover = document.querySelector('#progressPopover');
const detailSheet = document.querySelector('#detailSheet');
const friendsView = document.querySelector('#friendsView');
const momentsView = document.querySelector('#momentsView');
const profileView = document.querySelector('#profileView');
const chatView = document.querySelector('#chatView');
const bottomNav = document.querySelector('.bottom-nav');
const homeSections = [document.querySelector('.hero'), document.querySelector('.today-section'), document.querySelector('.things')];
const topbar = document.querySelector('.topbar');

function togglePanel(trigger, panel, force) {
  const open = force ?? trigger.getAttribute('aria-expanded') !== 'true';
  trigger.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
}

function showMainView(view) {
  const friends = view === 'friends';
  const moments = view === 'moments';
  const profile = view === 'profile';
  const chat = view === 'chat';
  const home = view === 'home';
  homeSections.forEach((section) => { section.hidden = !home; });
  topbar.hidden = !home;
  friendsView.hidden = !friends;
  momentsView.hidden = !moments;
  profileView.hidden = !profile;
  chatView.hidden = !chat;
  bottomNav.hidden = chat;
  document.querySelector('#homeNav').classList.toggle('active', home);
  document.querySelector('#friendsNav').classList.toggle('active', friends);
  document.querySelector('#momentsNav').classList.toggle('active', moments);
  document.querySelector('#profileNav').classList.toggle('active', profile);
  window.scrollTo({top:0,behavior:'smooth'});
}

function showFriendPanel(panel) {
  const chats = panel === 'chats';
  document.querySelector('#chatsPanel').hidden = !chats;
  document.querySelector('#contactsPanel').hidden = chats;
  document.querySelector('#chatsTab').classList.toggle('active', chats);
  document.querySelector('#contactsTab').classList.toggle('active', !chats);
  document.querySelector('#chatsTab').setAttribute('aria-selected', String(chats));
  document.querySelector('#contactsTab').setAttribute('aria-selected', String(!chats));
}

function chooseThing(value, button) {
  select.value = value;
  document.querySelectorAll('.thing-option').forEach((option) => option.classList.toggle('active', option === button));
  document.querySelector('#selectedThingLabel').textContent = value;
  document.querySelector('#selectedThingOrb').className = `option-orb ${value === 'Learn Spanish' ? 'clay' : 'sage'}`;
  togglePanel(thingTrigger, thingOptions, false);
}

function openCapture(thing) {
  if (thing) {
    const option = [...document.querySelectorAll('.thing-option')].find((item) => item.dataset.value === thing);
    chooseThing(thing, option);
  }
  sheet.hidden = false;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.querySelector('#momentNote').focus(), 50);
}

function closeCapture() {
  sheet.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

function closeStoryViews() {
  progressPopover.hidden = true;
  detailSheet.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

function openJourney(thing) {
  const running = thing === 'Morning runs';
  document.querySelector('#detailTitle').textContent = thing;
  document.querySelector('#detailSubtitle').textContent = running ? '18 moments · growing for 7 weeks' : '12 moments · growing for 5 weeks';
  detailSheet.hidden = false;
  progressPopover.hidden = true;
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function sortThingsByRecent() {
  const container = document.querySelector('.things');
  const addCard = document.querySelector('#newThingCard');
  [...container.querySelectorAll('.thing-card')]
    .sort((a, b) => new Date(b.dataset.updated) - new Date(a.dataset.updated))
    .forEach((card) => container.insertBefore(card, addCard));
}

function addTodayMoment(thing, note) {
  const card = document.querySelector('#todayCard');
  const row = document.createElement('button');
  row.className = 'today-moment';
  row.dataset.thing = thing;
  row.innerHTML = '<span class="today-time"></span><span class="today-dot sage"></span><span><strong></strong><small></small></span><em>›</em>';
  row.querySelector('.today-time').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  row.querySelector('strong').textContent = thing;
  row.querySelector('small').textContent = note || 'A new Moment added today.';
  row.addEventListener('click', () => openJourney(thing));
  card.prepend(row);
  document.querySelector('#todayCount').textContent = `${card.children.length} moments`;
}

document.querySelector('#openCapture').addEventListener('click', () => openCapture());
document.querySelector('#homeNav').addEventListener('click', () => showMainView('home'));
document.querySelector('#friendsNav').addEventListener('click', () => showMainView('friends'));
document.querySelector('#momentsNav').addEventListener('click', () => showMainView('moments'));
document.querySelector('#profileNav').addEventListener('click', () => showMainView('profile'));
document.querySelector('#openProfile').addEventListener('click', () => showMainView('profile'));
document.querySelector('#profileBack').addEventListener('click', () => showMainView('moments'));
document.querySelectorAll('.chat-row').forEach((row) => row.addEventListener('click', () => {
  document.querySelector('#chatName').textContent = row.querySelector('.chat-copy strong').textContent;
  showMainView('chat');
}));
document.querySelector('#chatBack').addEventListener('click', () => showMainView('friends'));
document.querySelector('#chatComposer').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chatInput');
  const text = input.value.trim();
  if (!text) return;
  const message = document.createElement('div');
  message.className = 'message outgoing';
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = text;
  const avatar = document.createElement('span'); avatar.className = 'people-avatar mira'; avatar.textContent = 'M';
  message.append(bubble,avatar); document.querySelector('.chat-background').append(message);
  input.value=''; message.scrollIntoView({behavior:'smooth',block:'end'});
});
document.querySelector('.shared-moment').addEventListener('click', () => openJourney('Morning runs'));
document.querySelector('#dashboardTab').addEventListener('click', () => {
  document.querySelector('#dashboardPanel').hidden = false;
  document.querySelector('#myMomentsPanel').hidden = true;
  document.querySelector('#dashboardTab').classList.add('active');
  document.querySelector('#myMomentsTab').classList.remove('active');
});
document.querySelector('#myMomentsTab').addEventListener('click', () => {
  document.querySelector('#dashboardPanel').hidden = true;
  document.querySelector('#myMomentsPanel').hidden = false;
  document.querySelector('#dashboardTab').classList.remove('active');
  document.querySelector('#myMomentsTab').classList.add('active');
});
const periodData = {
  day: ['3','2','1','Today','A day with movement','You returned to Morning runs and Learn Spanish.'],
  week: ['11','4','5','This week','A week of returning','You touched four Things across five different days.'],
  month: ['38','6','18','August','A month taking shape','Your most active Things were Morning runs, Spanish and cooking.'],
  year: ['286','9','173','2026','A year woven from returns','Your year shows long threads of movement, learning, cooking and reading.']
};
let currentWeavePeriod = 'day';
document.querySelectorAll('.period-tabs button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.period-tabs button').forEach((item) => item.classList.toggle('active', item === button));
  const data = periodData[button.dataset.period];
  ['periodMoments','periodThings','periodDays','ringValue','periodTitle','periodCopy'].forEach((id,index) => { document.querySelector(`#${id}`).textContent = data[index]; });
  currentWeavePeriod = button.dataset.period;
  drawWeave(currentWeavePeriod);
}));

function drawWeave(period) {
  const canvas = document.querySelector('#weaveCanvas');
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const labels = {day:'Today’s weave',week:'This week’s weave',month:'August’s weave',year:'Your 2026 weave'};
  const columns = {day:12,week:7,month:30,year:52}[period];
  const colors = ['#79afb5','#bd8fbd','#d7ae65','#7e96c6'];
  document.querySelector('#weaveTitle').textContent = labels[period];
  ctx.clearRect(0,0,size,size);
  const bg = ctx.createLinearGradient(0,0,size,size); bg.addColorStop(0,'#f8f6f1'); bg.addColorStop(1,'#efedf5'); ctx.fillStyle=bg; ctx.fillRect(0,0,size,size);
  const pad=54, plot=size-pad*2, step=plot/Math.max(columns-1,1);
  for(let d=0;d<columns;d++){
    const x=pad+d*step;
    colors.forEach((color,i)=>{
      const energy=.25+.75*Math.abs(Math.sin((d+1)*(i+2)*.73));
      ctx.beginPath(); ctx.strokeStyle=color; ctx.globalAlpha=.18+energy*.34; ctx.lineWidth=Math.max(2,step*.16*energy);
      ctx.moveTo(x+i*1.5,pad); ctx.bezierCurveTo(x-8*Math.sin(d),size*.34,x+9*Math.cos(i+d),size*.68,x+i*1.5,size-pad); ctx.stroke();
    });
  }
  colors.forEach((color,i)=>{
    const lanes=period==='day'?4:period==='week'?6:9;
    for(let r=0;r<lanes;r++){
      const y=pad+(plot/(lanes*colors.length-1||1))*(r*colors.length+i);
      ctx.beginPath(); ctx.strokeStyle=color; ctx.globalAlpha=.52; ctx.lineWidth=3+4*Math.abs(Math.sin((r+1)*(i+1)));
      ctx.moveTo(pad,y); for(let x=pad;x<=size-pad;x+=12){ctx.lineTo(x,y+7*Math.sin(x*.025+i*1.7+r));} ctx.stroke();
    }
  });
  ctx.globalAlpha=1; ctx.fillStyle='#182131'; ctx.font='500 24px Georgia'; ctx.fillText(labels[period],pad,34);
  ctx.fillStyle='#7d8496'; ctx.font='16px Inter, sans-serif'; ctx.fillText('Thing · time and energy',pad,size-20);
}

document.querySelector('#shareWeave').addEventListener('click', () => {
  const canvas = document.querySelector('#weaveCanvas');
  canvas.toBlob(async (blob) => {
    const file = new File([blob], `thing-${currentWeavePeriod}-weave.png`, {type:'image/png'});
    if (navigator.share && navigator.canShare?.({files:[file]})) await navigator.share({files:[file],title:'My Thing Weave'});
    else { const link=document.createElement('a'); link.download=file.name; link.href=URL.createObjectURL(blob); link.click(); }
  },'image/png');
});
drawWeave('day');
document.querySelector('#openSettings').addEventListener('click', () => {
  document.querySelector('#settingsSheet').hidden = false;
  backdrop.hidden = false;
});
document.querySelector('#closeSettings').addEventListener('click', () => {
  document.querySelector('#settingsSheet').hidden = true;
  backdrop.hidden = true;
});

let selectedStatus = null;
let selectedStatusPhoto = null;
document.querySelector('#statusButton').addEventListener('click', () => {
  document.querySelector('#statusSheet').hidden = false;
  backdrop.hidden = false;
});
document.querySelectorAll('.status-grid button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.status-grid button').forEach((item) => item.classList.toggle('selected', item === button));
  selectedStatus = {label:button.dataset.status,icon:button.dataset.icon};
}));
document.querySelector('#statusPhotoInput').addEventListener('change', (event) => {
  const file = event.target.files[0]; if (!file) return;
  selectedStatusPhoto = URL.createObjectURL(file);
  const preview = document.querySelector('#statusPhotoPreview'); preview.textContent=''; preview.style.backgroundImage=`url(${selectedStatusPhoto})`;
});
function closeStatus(){document.querySelector('#statusSheet').hidden=true;backdrop.hidden=true;}
document.querySelector('#closeStatus').addEventListener('click',closeStatus);
document.querySelector('#saveStatus').addEventListener('click', () => {
  if (!selectedStatus && !selectedStatusPhoto) return;
  const button = document.querySelector('#statusButton'); button.classList.add('has-status');
  if (selectedStatusPhoto){button.textContent='';button.style.backgroundImage=`url(${selectedStatusPhoto})`;}
  else {button.style.backgroundImage='';button.textContent=selectedStatus.icon;button.setAttribute('aria-label',`当前状态：${selectedStatus.label}`);}
  closeStatus(); toast.textContent=`Status set${selectedStatus ? ` · ${selectedStatus.label}` : ''}`; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1800);
});
document.querySelector('#chatsTab').addEventListener('click', () => showFriendPanel('chats'));
document.querySelector('#contactsTab').addEventListener('click', () => showFriendPanel('contacts'));
document.querySelector('#friendSearch').addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll('.chat-row,.contact-row').forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(query); });
});

document.querySelectorAll('.like-button').forEach((button) => button.addEventListener('click', () => {
  const liked = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!liked));
  button.firstChild.textContent = liked ? '♡ ' : '♥ ';
  const count = button.querySelector('span');
  count.textContent = Number(count.textContent) + (liked ? -1 : 1);
}));
document.querySelectorAll('.comment-button').forEach((button) => button.addEventListener('click', () => {
  const form = button.closest('.feed-card').querySelector('.comment-form');
  form.hidden = !form.hidden;
  if (!form.hidden) form.querySelector('input').focus();
}));
document.querySelectorAll('.comment-form').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  const text = input.value.trim();
  if (!text) return;
  const comment = document.createElement('p');
  comment.innerHTML = '<strong>You</strong> ';
  comment.append(document.createTextNode(text));
  form.closest('.feed-card').querySelector('.feed-comments').append(comment);
  input.value = '';
  form.hidden = true;
}));

function setCover(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  document.querySelector('#coverSky').style.backgroundImage = `url(${url})`;
  document.querySelector('#profileCover').style.backgroundImage = `url(${url})`;
}
document.querySelector('#coverInput').addEventListener('change', (event) => setCover(event.target.files[0]));
document.querySelector('#profileCoverInput').addEventListener('change', (event) => setCover(event.target.files[0]));
document.querySelector('#newThingCard').addEventListener('click', () => {
  openCapture();
  togglePanel(thingTrigger, thingOptions, true);
  newThingRow.hidden = false;
  addThingButton.hidden = true;
  setTimeout(() => newThingName.focus(), 80);
});
thingTrigger.addEventListener('click', () => togglePanel(thingTrigger, thingOptions));
shareTrigger.addEventListener('click', () => togglePanel(shareTrigger, visibilityOptions));
document.querySelector('#closeCapture').addEventListener('click', closeCapture);
backdrop.addEventListener('click', () => {
  closeCapture();
  closeStoryViews();
  document.querySelector('#settingsSheet').hidden = true;
  document.querySelector('#statusSheet').hidden = true;
});
document.querySelectorAll('.quick-add').forEach((button) => {
  button.addEventListener('click', (event) => {
    openCapture(event.target.closest('.thing-card').dataset.thing);
  });
});
document.querySelectorAll('.thing-option').forEach((button) => button.addEventListener('click', () => chooseThing(button.dataset.value, button)));
document.querySelectorAll('.today-moment').forEach((row) => row.addEventListener('click', () => openJourney(row.dataset.thing)));
document.querySelectorAll('.progress-object').forEach((object) => object.addEventListener('click', (event) => {
  event.stopPropagation();
  const thing = object.closest('.thing-card').dataset.thing;
  document.querySelector('#progressTitle').textContent = `${thing} is taking shape.`;
  document.querySelector('#momentCount').textContent = thing === 'Morning runs' ? '18' : '12';
  progressPopover.dataset.thing = thing;
  progressPopover.hidden = false;
  backdrop.hidden = false;
}));
document.querySelectorAll('.thing-card').forEach((card) => card.addEventListener('click', (event) => {
  if (event.target.closest('.quick-add,.progress-object,.card-menu')) return;
  openJourney(card.dataset.thing);
}));
document.querySelectorAll('.card-menu').forEach((button) => button.addEventListener('click', (event) => {
  event.stopPropagation();
  openJourney(button.closest('.thing-card').dataset.thing);
}));
document.querySelector('#closeProgress').addEventListener('click', closeStoryViews);
document.querySelector('#closeDetail').addEventListener('click', closeStoryViews);
document.querySelector('#viewJourney').addEventListener('click', () => openJourney(progressPopover.dataset.thing));
document.querySelector('.detail-add').addEventListener('click', () => {
  const thing = document.querySelector('#detailTitle').textContent;
  closeStoryViews();
  openCapture(thing);
});

document.querySelector('#photoInput').addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const preview = document.querySelector('#photoPreview');
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
});

addThingButton.addEventListener('click', () => {
  newThingRow.hidden = false;
  addThingButton.hidden = true;
  newThingName.focus();
});

document.querySelector('#confirmThing').addEventListener('click', () => {
  const name = newThingName.value.trim();
  if (!name) return newThingName.focus();
  const option = new Option(name, name, true, true);
  select.add(option);
  const button = document.createElement('button');
  button.className = 'thing-option';
  button.type = 'button';
  button.dataset.value = name;
  button.innerHTML = '<span class="option-orb sage"></span><strong></strong><span class="option-check">✓</span>';
  button.querySelector('strong').textContent = name;
  button.addEventListener('click', () => chooseThing(name, button));
  document.querySelector('#thingOptions').insertBefore(button, addThingButton);
  chooseThing(name, button);
  newThingRow.hidden = true;
  addThingButton.hidden = false;
  newThingName.value = '';
});

newThingName.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.querySelector('#confirmThing').click();
});

document.querySelector('#friendButton').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const selected = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!selected));
  document.querySelector('#friendChoice').textContent = selected ? 'Choose' : '@ Sophie';
  updateShareSummary();
});

document.querySelector('#shareButton').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const selected = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!selected));
  document.querySelector('#shareChoice').textContent = selected ? 'Off' : 'On';
  updateShareSummary();
});

function updateShareSummary() {
  const friend = document.querySelector('#friendButton').getAttribute('aria-pressed') === 'true';
  const moments = document.querySelector('#shareButton').getAttribute('aria-pressed') === 'true';
  document.querySelector('#shareSummary').textContent = friend && moments ? '@ Sophie · Moments' : friend ? '@ Sophie' : moments ? 'Moments' : 'Only me';
}

document.querySelector('#saveMoment').addEventListener('click', () => {
  const thing = select.value;
  const card = [...document.querySelectorAll('.thing-card')].find((item) => item.dataset.thing === thing);
  if (card) {
    card.dataset.updated = new Date().toISOString();
    sortThingsByRecent();
  }
  addTodayMoment(thing, document.querySelector('#momentNote').value.trim());
  closeCapture();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

sortThingsByRecent();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!sheet.hidden) closeCapture();
    if (!progressPopover.hidden || !detailSheet.hidden) closeStoryViews();
  }
});
