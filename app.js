(()=>{
const N=161, mob=matchMedia('(max-aspect-ratio: 1/1)').matches, dir=mob?'f/m/':'f/d/';
const W=mob?540:1200,H=mob?720:675;
const cv=document.getElementById('seq'),cx=cv.getContext('2d');
const imgs=new Array(N);let cur=0,loaded=0;
const pad=i=>String(i+1).padStart(3,'0');
function size(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;draw(cur,true)}
function nearest(i){if(imgs[i]&&imgs[i].complete&&imgs[i].naturalWidth)return imgs[i];for(let k=1;k<N;k++){for(const j of[i-k,i+k]){const m=imgs[j];if(m&&m.complete&&m.naturalWidth)return m}}return null}
let last=-1;
function draw(i,force){i=Math.round(i);if(i===last&&!force)return;const m=nearest(i);if(!m)return;last=i;
 const cw=cv.width,ch=cv.height,s=Math.max(cw/m.naturalWidth,ch/m.naturalHeight),w=m.naturalWidth*s,h=m.naturalHeight*s;
 cx.drawImage(m,(cw-w)/2,(ch-h)/2,w,h)}
const bar=document.querySelector('.ld-bar i'),pc=document.querySelector('.ld-pc'),loader=document.getElementById('loader');
const FIRST=24;let released=false;
function release(){if(released)return;released=true;loader.classList.add('done');intro()}
function load(i){return new Promise(r=>{const m=new Image();m.decoding='async';m.onload=m.onerror=()=>{loaded++;if(!released){const p=Math.min(100,Math.round(loaded/FIRST*100));bar.style.width=p+'%';pc.textContent=p+'%';if(loaded>=FIRST)release()}if(i===0)draw(0,true);else if(Math.abs(i-cur)<3)draw(cur,true);r()};m.src=dir+pad(i)+'.webp';imgs[i]=m})}
// load sparse first (every 7th) then fill
(async()=>{const order=[];for(let i=0;i<N;i+=7)order.push(i);for(let i=0;i<N;i++)if(!order.includes(i))order.push(i);
 await load(0);const q=order.slice(1);const run=async()=>{while(q.length)await load(q.shift())};await Promise.all([run(),run(),run(),run()])})();
setTimeout(release,6000);
addEventListener('resize',size);size();
gsap.registerPlugin(ScrollTrigger);
const obj={f:0};
gsap.to(obj,{f:N-1,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.6,onUpdate:s=>{document.getElementById('prog').style.transform='scaleX('+s.progress+')'}},onUpdate:()=>{cur=obj.f;draw(cur)}});
// stages: [in,out] in hero progress
const st=[[-1,.12],[.17,.34],[.40,.56],[.62,.76],[.83,2]];
const tl=gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.4}});
st.forEach(([a,b],k)=>{const el=document.querySelector('.s'+k);
 if(a>=0)tl.fromTo(el,{opacity:0,y:40},{opacity:1,y:0,duration:.05,ease:'power2.out'},a);
 if(b<=1)tl.to(el,{opacity:0,y:-30,duration:.05,ease:'power2.in'},b)});
tl.to({},{duration:0},1);
gsap.to('.scrollcue',{opacity:0,scrollTrigger:{trigger:'#hero',start:'top top',end:'+=300',scrub:true}});
function intro(){gsap.from('.s0 > *',{opacity:0,y:30,duration:1.1,stagger:.12,ease:'power3.out'})}
// nav
const nav=document.getElementById('nav'),call=document.querySelector('.callbar');
ScrollTrigger.create({trigger:'#hero',start:'bottom-=80 top',onEnter:()=>nav.classList.add('solid'),onLeaveBack:()=>nav.classList.remove('solid')});
ScrollTrigger.create({trigger:'.intro',start:'top 80%',endTrigger:'#estimate',end:'top 70%',onToggle:s=>call.classList.toggle('on',s.isActive)});
const bg=document.getElementById('burger');
bg.onclick=()=>{const o=document.body.classList.toggle('menu-open');bg.setAttribute('aria-expanded',o)};
document.querySelectorAll('.mnav a').forEach(a=>a.onclick=()=>{document.body.classList.remove('menu-open');bg.setAttribute('aria-expanded',false)});
// reveals
document.querySelectorAll('.head,.lead,.promise li,.svc,.gal figure,.rv blockquote,.area-in > *,.est-in > *').forEach(el=>{el.classList.add('rev');
 gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}})});
// form
document.getElementById('qf').addEventListener('submit',e=>{e.preventDefault();const f=e.target;let ok=true;
 ['name','phone'].forEach(n=>{const v=f[n].value.trim();f[n].classList.toggle('bad',!v);if(!v)ok=false});if(!ok)return;
 const body=`Name: ${f.name.value}\nPhone: ${f.phone.value}\nProject: ${f.type.value}\n\n${f.msg.value}`;
 location.href='mailto:colinaconstructionllc@gmail.com?subject='+encodeURIComponent('Free estimate request: '+f.type.value)+'&body='+encodeURIComponent(body)});
})();
