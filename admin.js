const DATA_KEY = 'sukumarPortfolioDataV1';
const AUTH_KEY = 'sukumarPortfolioAuthV1';
const SESSION_KEY = 'sukumarPortfolioSessionV1';
const $ = (s) => document.querySelector(s);
function normalizeData(saved={}){
  const base=window.PORTFOLIO_DEFAULTS;
  return {
    ...base,...saved,
    profile:{...base.profile,...(saved.profile||{})}, labels:{...base.labels,...(saved.labels||{})},
    education:{...base.education,...(saved.education||{})}, contact:{...base.contact,...(saved.contact||{})},
    stats:base.stats.map((item,i)=>({...item,...((saved.stats||[])[i]||{})})),
    projects:Array.isArray(saved.projects)?saved.projects:base.projects,
    skills:Array.isArray(saved.skills)?saved.skills:base.skills,
    introduction:base.introduction.map((item,i)=>({...item,...((saved.introduction||[])[i]||{})}))
  };
}
function readData(){ try { return normalizeData(JSON.parse(localStorage.getItem(DATA_KEY))||{}); } catch { return normalizeData(); } }
let data = readData();
function save(){ localStorage.setItem(DATA_KEY, JSON.stringify(data)); $('#save-state').textContent = `Saved locally · ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`; }
function escapeHTML(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function field(label,value,attr){return `<label><small>${label}</small><input ${attr} value="${escapeHTML(value)}"></label>`;}
const contentGroups=[
  {title:'Profile & about',fields:[
    ['profile.name','Name'],['profile.role','Role / headline'],['profile.tagline','Hero tagline'],['profile.availability','Availability status'],
    ['profile.aboutHeading','About heading'],['profile.aboutIntro','About paragraph 1','textarea'],['profile.aboutFocus','About paragraph 2','textarea'],['profile.aboutGoal','About paragraph 3','textarea'],['profile.description','Browser / search description','textarea']
  ]},
  {title:'Section names & buttons',fields:[
    ['labels.navHome','Navigation: Home'],['labels.navAbout','Navigation: About'],['labels.navSkills','Navigation: Skills'],['labels.navEducation','Navigation: Education'],['labels.navProjects','Navigation: Projects'],['labels.navContact','Navigation: Contact'],
    ['labels.about','About section title'],['labels.skills','Skills section title'],['labels.education','Education section title'],['labels.projects','Projects section title'],['labels.contact','Contact section title'],['labels.viewWork','Projects button'],['labels.contactCta','Contact button'],['labels.email','Email label'],['labels.phone','Phone label'],['labels.location','Location label'],['labels.projectKicker','Project card label'],['labels.footer','Footer text']
  ]},
  {title:'Stats & CGPA',fields:[
    ['stats.0.value','CGPA stat'],['stats.0.label','CGPA label'],['stats.1.value','Second stat value'],['stats.1.label','Second stat label'],
    ['stats.2.value','Third stat value'],['stats.2.label','Third stat label'],['stats.3.value','Fourth stat value'],['stats.3.label','Fourth stat label'],['education.cgpa','Education CGPA']
  ]},
  {title:'Education',fields:[['education.degree','Degree'],['education.institution','Institution'],['education.year','Current year / status'],['education.completed','Completed year / milestone']]},
  {title:'Contact & social links',fields:[['contact.email','Email address'],['contact.phone','Phone number'],['contact.location','Location'],['contact.linkedin','LinkedIn URL'],['contact.github','GitHub URL']]},
  {title:'30-second introduction',fields:[
    ['introduction.0.caption','Intro caption 1','textarea'],['introduction.0.voice','Voice script 1','textarea'],
    ['introduction.1.caption','Intro caption 2','textarea'],['introduction.1.voice','Voice script 2','textarea'],
    ['introduction.2.caption','Intro caption 3','textarea'],['introduction.2.voice','Voice script 3','textarea'],
    ['introduction.3.caption','Intro caption 4','textarea'],['introduction.3.voice','Voice script 4','textarea']
  ]}
];
function getPath(obj,path){return path.split('.').reduce((node,key)=>node?.[key],obj)??'';}
function setPath(obj,path,value){const keys=path.split('.');const last=keys.pop();const target=keys.reduce((node,key)=>node[key],obj);target[last]=value;}
function renderContent(){
  $('#content-list').innerHTML=contentGroups.map((group,index)=>`<section class="content-group"><h3>${String(index+1).padStart(2,'0')} / ${escapeHTML(group.title)}</h3><div class="content-fields">${group.fields.map(([path,label,type])=>{const inputType=path==='contact.email'?'email':path.endsWith('linkedin')||path.endsWith('github')?'url':'text';return `<label><small>${escapeHTML(label)}</small>${type==='textarea'?`<textarea data-path="${path}">${escapeHTML(getPath(data,path))}</textarea>`:`<input type="${inputType}" data-path="${path}" value="${escapeHTML(getPath(data,path))}">`}</label>`;}).join('')}</div></section>`).join('');
  $('#content-list').querySelectorAll('[data-path]').forEach(el=>el.addEventListener('input',()=>{
    const path=el.dataset.path;setPath(data,path,el.value);
    if(path==='stats.0.value'){data.education.cgpa=el.value;const mirror=$('[data-path="education.cgpa"]');if(mirror)mirror.value=el.value;}
    if(path==='education.cgpa'){data.stats[0].value=el.value;const mirror=$('[data-path="stats.0.value"]');if(mirror)mirror.value=el.value;}
    save();
  }));
}
function render(){
  renderContent();
  $('#project-count').textContent = `${data.projects.length} entries`;
  $('#skill-count').textContent = `${data.skills.length} entries`;
  $('#projects-list').innerHTML = data.projects.map((p,i)=>`<article class="item"><div class="item-top"><span class="item-title">PROJECT ${String(i+1).padStart(2,'0')}</span><button class="remove" data-kind="projects" data-index="${i}">Remove</button></div><div class="item-fields">${field('Project name',p.title,`data-field="title" data-kind="projects" data-index="${i}"`)}<label><small>Description</small><textarea data-field="description" data-kind="projects" data-index="${i}">${escapeHTML(p.description)}</textarea></label>${field('Technologies · comma separated',p.tech,`data-field="tech" data-kind="projects" data-index="${i}"`)}<div class="item-fields two">${field('Repository URL',p.repo,`data-field="repo" data-kind="projects" data-index="${i}"`)}${field('Live demo URL',p.demo,`data-field="demo" data-kind="projects" data-index="${i}"`)}</div></div></article>`).join('') || '<p class="muted">No projects yet. Add your first one above.</p>';
  $('#projects-list').querySelectorAll('.item').forEach((article,i)=>article.querySelector('.item-fields').insertAdjacentHTML('beforeend',field('Project image URL (optional)',data.projects[i].image||'',`data-field="image" data-kind="projects" data-index="${i}"`)));
  $('#skills-list').innerHTML = data.skills.map((s,i)=>`<article class="item"><div class="item-top"><span class="item-title">SKILL ${String(i+1).padStart(2,'0')}</span><button class="remove" data-kind="skills" data-index="${i}">Remove</button></div><div class="item-fields">${field('Skill name',s.name,`data-field="name" data-kind="skills" data-index="${i}"`)}${field('Proficiency (0–100)',s.level,`type="number" min="0" max="100" data-field="level" data-kind="skills" data-index="${i}"`)}<label><small>Short description</small><textarea data-field="description" data-kind="skills" data-index="${i}">${escapeHTML(s.description)}</textarea></label></div></article>`).join('') || '<p class="muted">No skills yet. Add one above.</p>';
  $('#projects-list,#skills-list').querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',()=>{const item=data[el.dataset.kind][Number(el.dataset.index)];item[el.dataset.field]=el.dataset.field==='level'?Math.min(100,Math.max(0,Number(el.value)||0)):el.value;save();}));
  $('#skills-list').querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',()=>{const item=data.skills[Number(el.dataset.index)];item[el.dataset.field]=el.dataset.field==='level'?Math.min(100,Math.max(0,Number(el.value)||0)):el.value;save();}));
  document.querySelectorAll('.remove').forEach(btn=>btn.onclick=()=>{data[btn.dataset.kind].splice(Number(btn.dataset.index),1);save();render();});
}
function showEditor(){ $('#login').hidden=true;$('#editor').hidden=false;render(); }
if(sessionStorage.getItem(SESSION_KEY)==='yes') showEditor();
if(!localStorage.getItem(AUTH_KEY)){
  $('#login-title').textContent='Set up your editor.';
  $('#login-description').textContent='Create your own login to start editing on this browser.';
  $('#login-submit').innerHTML='Create login <span>↗</span>';
  $('#password').setAttribute('autocomplete','new-password');
  $('#password').setAttribute('minlength','10');
}
$('#login-form').addEventListener('submit',e=>{
  e.preventDefault();
  const stored=localStorage.getItem(AUTH_KEY);
  const auth=stored?JSON.parse(stored):null;
  const username=$('#username').value.trim(), password=$('#password').value;
  if(!auth){
    if(password.length<10){$('#login-error').textContent='Choose a password with at least 10 characters.';return;}
    localStorage.setItem(AUTH_KEY,JSON.stringify({username,password}));
    sessionStorage.setItem(SESSION_KEY,'yes');$('#login-error').textContent='';showEditor();return;
  }
  if(username===auth.username&&password===auth.password){sessionStorage.setItem(SESSION_KEY,'yes');$('#login-error').textContent='';showEditor();}
  else $('#login-error').textContent='That username and password do not match.';
});
$('#logout').onclick=()=>{sessionStorage.removeItem(SESSION_KEY);location.reload();};
$('#credentials-form').addEventListener('submit',e=>{e.preventDefault();localStorage.setItem(AUTH_KEY,JSON.stringify({username:$('#new-username').value.trim(),password:$('#new-password').value}));$('#new-password').value='';$('#save-state').textContent='Login updated in this browser';});
$('#add-project').onclick=()=>{data.projects.push({title:'New project',description:'',tech:'',repo:'',demo:'',image:''});save();render();};
$('#add-skill').onclick=()=>{data.skills.push({name:'New skill',level:50,description:''});save();render();};
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sukumar-portfolio-backup.json';a.click();URL.revokeObjectURL(a.href);};
$('#import').onchange=async e=>{try{const next=JSON.parse(await e.target.files[0].text());if(!Array.isArray(next.projects)||!Array.isArray(next.skills))throw Error();data=normalizeData(next);save();render();}catch{$('#save-state').textContent='Could not import: choose a valid portfolio backup.';}e.target.value='';};
