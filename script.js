(function(){
const STORAGE_KEY = "khalid_posts";
let posts = [];
let currentLang = "ar";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  loadPosts();
  renderPosts();
  document.getElementById("langBtn").onclick = toggleLang;
  document.getElementById("themeBtn").onclick = toggleTheme;
  document.getElementById("ctaLatest").onclick = () => scrollTo("postsGrid");
  document.getElementById("closePostBtn").onclick = closePost;
  document.getElementById("adminBtn").onclick = openAdmin;
  document.getElementById("closeAdminBtn").onclick = closeAdmin;
  document.getElementById("newPostBtn").onclick = () => openEditor();
  document.getElementById("savePostBtn").onclick = savePost;
  document.getElementById("exportBtn").onclick = exportJSON;
  document.getElementById("importBtn").onclick = () => document.getElementById("jsonFile").click();
  document.getElementById("jsonFile").onchange = importJSON;
});

function loadPosts(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){ posts = JSON.parse(saved); return; }
  posts = [{
    id:"1",
    title_ar:"مستقبل التصميم الرقمي",
    title_en:"Future of Digital Design",
    excerpt_ar:"استكشاف التوجهات الجديدة.",
    excerpt_en:"Exploring new design trends.",
    category:"Design",
    image:"https://picsum.photos/400/200?1",
    date:"2025-08-20",
    content_ar:"<p>هذا المقال بالعربية...</p>",
    content_en:"<p>This is the English version...</p>"
  }];
}
function renderPosts(){
  const grid=document.getElementById("postsGrid"); grid.innerHTML="";
  posts.forEach(p=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`<div class="thumb" style="background-image:url('${p.image}')"></div>
      <div class="meta"><span>${p.category}</span><span>${p.date}</span></div>
      <div class="title">${currentLang==="ar"?p.title_ar:p.title_en}</div>
      <div class="excerpt">${currentLang==="ar"?p.excerpt_ar:p.excerpt_en}</div>`;
    card.onclick=()=>openPost(p); grid.appendChild(card);
  });
}
function openPost(p){
  document.getElementById("postTitle").innerText=currentLang==="ar"?p.title_ar:p.title_en;
  document.getElementById("postMeta").innerText=`${p.category} • ${p.date}`;
  document.getElementById("postImage").style.backgroundImage=`url(${p.image})`;
  document.getElementById("postContent").innerHTML=currentLang==="ar"?p.content_ar:p.content_en;
  document.getElementById("postView").style.display="flex";
}
function closePost(){document.getElementById("postView").style.display="none";}
function toggleLang(){currentLang=currentLang==="ar"?"en":"ar";renderPosts();}
function toggleTheme(){document.body.dataset.theme=document.body.dataset.theme==="dark"?"light":"dark";}
function scrollTo(id){document.getElementById(id).scrollIntoView({behavior:"smooth"});}
function openAdmin(){document.getElementById("adminDrawer").style.display="block";renderAdmin();}
function closeAdmin(){document.getElementById("adminDrawer").style.display="none";}
function renderAdmin(){
  const list=document.getElementById("adminList"); list.innerHTML="";
  posts.forEach(p=>{
    const item=document.createElement("div");
    item.innerHTML=`<strong>${p.title_ar}</strong> <button onclick="editPost('${p.id}')">✎</button> <button onclick="deletePost('${p.id}')">🗑</button>`;
    list.appendChild(item);
  });
}
function openEditor(post=null){
  document.getElementById("editorArea").classList.remove("hidden");
  if(post){
    document.getElementById("titleAr").value=post.title_ar;
    document.getElementById("titleEn").value=post.title_en;
    document.getElementById("excerptAr").value=post.excerpt_ar;
    document.getElementById("excerptEn").value=post.excerpt_en;
    document.getElementById("category").value=post.category;
    document.getElementById("imageUrl").value=post.image;
    document.getElementById("date").value=post.date;
    document.getElementById("contentAr").value=post.content_ar;
    document.getElementById("contentEn").value=post.content_en;
    document.getElementById("savePostBtn").dataset.id=post.id;
  } else {
    document.querySelectorAll("#editorArea input, #editorArea textarea").forEach(e=>e.value="");
    delete document.getElementById("savePostBtn").dataset.id;
  }
}
function savePost(){
  const id=document.getElementById("savePostBtn").dataset.id||Date.now().toString();
  const p={id,
    title_ar:document.getElementById("titleAr").value,
    title_en:document.getElementById("titleEn").value,
    excerpt_ar:document.getElementById("excerptAr").value,
    excerpt_en:document.getElementById("excerptEn").value,
    category:document.getElementById("category").value,
    image:document.getElementById("imageUrl").value,
    date:document.getElementById("date").value,
    content_ar:document.getElementById("contentAr").value,
    content_en:document.getElementById("contentEn").value};
  const idx=posts.findIndex(x=>x.id===id);
  if(idx>=0)posts[idx]=p;else posts.push(p);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(posts));
  renderPosts();renderAdmin();
}
window.editPost=(id)=>openEditor(posts.find(p=>p.id===id));
window.deletePost=(id)=>{posts=posts.filter(p=>p.id!==id);localStorage.setItem(STORAGE_KEY,JSON.stringify(posts));renderPosts();renderAdmin();}
function exportJSON(){
  const data=JSON.stringify(posts,null,2);
  const blob=new Blob([data],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="posts.json";a.click();
}
function importJSON(e){
  const f=e.target.files[0];if(!f)return;
  const reader=new FileReader();
  reader.onload=()=>{posts=JSON.parse(reader.result);localStorage.setItem(STORAGE_KEY,JSON.stringify(posts));renderPosts();renderAdmin();};
  reader.readAsText(f);
}
})();