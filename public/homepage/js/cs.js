/*
Hello and welcome
*/
let liveStreamers = []

class getStreamers {
  constructor(name, checker, channelId, vidid, json, viewerCount) {
    this.name = name;
    this.checker = checker;
    this.vidid = vidid;
    this.json = json;
    this.viewerCount = viewerCount;
    this.channelId = channelId;
    this.counter = 0;
  }
  async getData() {
     const fetcher = await fetch(`fetches/${this.name}.json`)
     const fetched = await fetcher.json();
     this.json = fetched;
     await this.dataThink();
     if (this.checker && !this.viewerCount.includes('Offline')) {
       liveStreamers.push(this);
     }
    }
 async dataThink() {
      if (this.json.pageInfo.totalResults > 1) {
        this.json.items.splice(0, 1);
      }
      if (!this.checker && !this.json.pageInfo.totalResults == 0) {
        this.checker = true;
        this.vidid = this.json.items[0].id.videoId;
        updater(this.name);
      await this.getStats();
      } else if (this.checker && this.json.pageInfo.totalResults == 0){
        this.checker = false;
        const viddiv = document.querySelector(`.${this.name} `);
        this.viewerCount = 0;
        viddiv.dataset.viewer = this.viewerCount;
        remover(this.name);
     //   organizeCards();
      }  else if (this.checker && !this.json.pageInfo.totalResults == 0) {
        await this.getStats();
      }
    }
  async getStats() {
        const secondFetch = await fetch(`../fetches/${this.name}stats.json`);
        const fetchResult = await secondFetch.json();
        this.viewerCount = fetchResult.items[0].liveStreamingDetails.concurrentViewers;
        this.addVideo();
        const viddiv = document.querySelector(`.${this.name} `);
        viddiv.dataset.viewer = this.viewerCount;
        if (!this.viewerCount) {
          document.querySelector(`.${this.name}`).dataset.viewer = '1';
          remover(this.name);
          this.viewerCount = 'Offline';
        } else {
        viddiv.querySelector('.number').textContent = `${this.viewerCount} viewers`;
        console.log('hey')
      }
  }
  addLinks() {
    const appenddiv = document.querySelector(`.${this.name}`);
    const alink = document.createElement('a');
    const vidurl = `https://www.youtube.com/channel/${this.channelId}`;
    alink.href = vidurl;
    alink.target = "_blank";
    alink.innerHTML = '<i class="fa fa-youtube-play"></i>';
    appenddiv.append(alink);
  }

 addVideo() {
  const video = document.querySelector('.stream');
  const chatter = document.querySelector('.chatter');
  const chat = document.querySelector('.chat');
  const namediv = document.querySelector(`.${this.name} img`);
  const button = chatter.querySelector('button');
  const url = window.location.hostname;
  
  if (window.innerWidth > 850) {
    namediv.addEventListener('click', () => {
      document.body.style.backgroundColor = 'black';
      video.src = `https://www.youtube.com/embed/${this.vidid}`;
      chat.src = `https://www.youtube.com/live_chat?v=${this.vidid}&embed_domain=${url}`;
      if (chatter.classList.value.includes('toggled')) chatter.classList.remove('toggled');  button.classList.remove('chatterbtn');
      
    })
  } else {
    const href = `https://www.youtube.com/watch?v=${this.vidid}`;
    const target = "_blank";
   $(namediv).wrap(`<a class='linkme' href=${href} target=${target}></a>`);
  }
  }
}


let ice = new getStreamers('ice', checker = false, 'UCv9Edl_WbtbPeURPtFDo-uA');
let tsa = new getStreamers('tsa', checker = false, 'UCB0H_1M78_jwTyfaJuP241g');
let destiny = new getStreamers('destiny', checker = false, 'UC554eY5jNUfDq3yDOJYirOQ');
let hyphonix = new getStreamers('hyphonix', checker = false, 'UC4abN4ZiybnsAXTkTBX7');
let mix = new getStreamers('mix', checker = false, 'UC_jxnWLGJ2eQK4en3UblKEw');
let marie = new getStreamers('marie', checker = false, 'UC16fss-5fnGp2Drqp1iT9pA');
let burger = new getStreamers('burger', checker = false, 'UC3MAdjjG3LMCG8CV-d7nEQA');
let cxnews = new getStreamers('cxnews', checker = false, 'UCStEQ9BjMLjHTHLNA6cY9vg');
let chilledcow = new getStreamers('chilledcow', checker = false, 'UCSJ4gkVC6NrvII8umztf0Ow');
let lol = new getStreamers('lol', checker = false, 'UCvqRdlKsE5Q8mf8YXbdIJLw');
let pepper = new getStreamers('pepper', checker = false, 'UCdSr4xliU8yDyS1aGnCUMTA');
let evan = new getStreamers('evan', checker = false, 'UCHYUiFsAJ-EDerAccSHIslw');
let gary = new getStreamers('gary', checker = false, 'UCvxSwu13u1wWyROPlCH-MZg');

init();
setInterval(init, 80000);

let allDone = false;

async function init() {
 await mix.getData();
 await ice.getData();
 await tsa.getData();
 await hyphonix.getData();
 await destiny.getData();
 await marie.getData();
 await burger.getData();
 await cxnews.getData();
 await chilledcow.getData();
 await lol.getData();
 await pepper.getData();
 await evan.getData();
 await gary.getData();
(() => {
  organizeCards();
  if (!allDone && !liveStreamers.length == 0) {
  const video = document.querySelector('.stream');
  const chat = document.querySelector('.chat');
  const url = window.location.hostname;
  const activeStreams = liveStreamers.sort((a, b) => {
    return +a.viewerCount < +b.viewerCount ? 1:-1;
  })
  video.src = `https://www.youtube.com/embed/${activeStreams[0].vidid}`;
  chat.src = `https://www.youtube.com/live_chat?v=${activeStreams[0].vidid}&embed_domain=${url}`;
  liveStreamers = [];
  allDone = true;
}
})();

}

function updater(astring) {
const item = document.querySelector(`.${astring}`);
const img = item.querySelector('img');
item.classList.add('live');
img.classList.add('active');
}

function remover(stringer) {
  const item = document.querySelector(`.${stringer} `);
  const removeme = item.querySelector('.linkme') !== null;
  if (removeme) {
    item.querySelector('.linkme').children[0].classList.remove('active');
    item.classList.remove('live');
    item.querySelector('.fa').style.color = '#eee';
    item.querySelector('.number').textContent = 'Offline';
    }
    item.classList.remove('live');
    const active = item.querySelector('.active') ? item.querySelector('.active') : null;
    if (active) active.classList.remove('active');
  item.querySelector('.number').textContent = 'Offline';
}



function organizeCards() {
const getCards = [...document.querySelectorAll('[data-viewer]')];
const thediv = document.querySelector('.orgme');
const newray = getCards.sort((a, b) => {
  return +a.dataset.viewer < +b.dataset.viewer ? 1 : -1;
});
thediv.innerHTML = '';
thediv.append(...newray);
}


const toggleNav = document.querySelector('.video i');
const cards = document.querySelector('.cards');
toggleNav.addEventListener('click', toggleNaver);

function toggleNaver() {
    if (this.classList.value.includes('left')) {
      cards.style.flex = '0 0 0';
      this.classList.remove('fa-arrow-left')
      this.classList.add('fa-arrow-right');
    } else {
      cards.style.flex = '0 0 275px';
      this.classList.remove('fa-arrow-right')
      this.classList.add('fa-arrow-left');
    }
}

const boot = document.querySelector('.toggler');
boot.addEventListener('click', toggleChat);

function toggleChat() {
  const chatter = document.querySelector('.chatter');
   chatter.classList.toggle('toggled');
   boot.classList.toggle('chatterbtn');
  }

  document.querySelector('.fa-toggle-on').addEventListener('click', toggleColor);
  document.addEventListener("DOMContentLoaded", toggleColor);

let isWhite = JSON.parse(localStorage.getItem('isWhite')) || false;

  function toggleColor(e) {
    if (e && e.type === 'click') {
      isWhite = !isWhite;
      localStorage.setItem('isWhite', isWhite)
      }
    const darkcards = '#212121';
    const darkfont = 'white';
    const darkborder = 'black';
    const darkscroll = '#373737';
    const whitecards = '#D6D6D6';
    const whitefont = 'black';
    const whiteborder = '#ABABAB';
    const whitescroll = '#C0C0C0';

    if (isWhite) {
      document.documentElement.style.setProperty('--whitecards', darkcards)
      document.documentElement.style.setProperty('--whitefont', darkfont)
      document.documentElement.style.setProperty('--whiteborder', darkborder)
      document.documentElement.style.setProperty('--whitescroll', darkscroll)

    } if (!isWhite) {
      document.documentElement.style.setProperty('--whitecards', whitecards)
      document.documentElement.style.setProperty('--whitefont', whitefont)
      document.documentElement.style.setProperty('--whiteborder', whiteborder)
      document.documentElement.style.setProperty('--whitescroll', whitescroll)
    }
  }