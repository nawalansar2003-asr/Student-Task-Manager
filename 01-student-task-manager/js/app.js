const $=id=>document.getElementById(id);
let tasks=JSON.parse(localStorage.getItem("studentTasks")||"[]");
const save=()=>localStorage.setItem("studentTasks",JSON.stringify(tasks));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
function render(){
 const q=$("searchInput").value.toLowerCase(), s=$("statusFilter").value, p=$("priorityFilter").value;
 const filtered=tasks.filter(t=>(!q||(t.title+" "+t.category+" "+t.description).toLowerCase().includes(q))&&(s==="all"||t.status===s)&&(p==="all"||t.priority===p));
 $("taskList").innerHTML=filtered.map(t=>`<article class="task-card">
 <span class="badge ${t.priority}">${t.priority}</span>
 <h3 class="${t.status==="completed"?"done":""}">${escapeHtml(t.title)}</h3>
 <div class="meta">${escapeHtml(t.category)} • Due ${t.dueDate}</div>
 <p>${escapeHtml(t.description||"No description")}</p>
 <div class="actions">
 <button onclick="toggleTask('${t.id}')">${t.status==="completed"?"Reopen":"Complete"}</button>
 <button onclick="editTask('${t.id}')">Edit</button>
 <button onclick="deleteTask('${t.id}')">Delete</button>
 </div></article>`).join("");
 $("emptyState").style.display=filtered.length?"none":"block";
 $("totalCount").textContent=tasks.length;
 $("pendingCount").textContent=tasks.filter(t=>t.status==="pending").length;
 $("completedCount").textContent=tasks.filter(t=>t.status==="completed").length;
 $("highCount").textContent=tasks.filter(t=>t.priority==="high"&&t.status!=="completed").length;
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function openModal(t=null){
 $("modal").classList.remove("hidden"); $("modalTitle").textContent=t?"Edit Task":"Add Task";
 $("taskId").value=t?.id||"";$("title").value=t?.title||"";$("category").value=t?.category||"";
 $("dueDate").value=t?.dueDate||new Date().toISOString().slice(0,10);$("priority").value=t?.priority||"medium";$("description").value=t?.description||"";
}
function closeModal(){$("modal").classList.add("hidden")}
$("addTaskBtn").onclick=()=>openModal();$("closeModal").onclick=closeModal;
$("taskForm").onsubmit=e=>{e.preventDefault();const id=$("taskId").value;const data={id:id||uid(),title:$("title").value.trim(),category:$("category").value.trim(),dueDate:$("dueDate").value,priority:$("priority").value,description:$("description").value.trim(),status:"pending"};
 if(id){const old=tasks.find(t=>t.id===id);data.status=old.status;tasks=tasks.map(t=>t.id===id?data:t)}else tasks.push(data);save();closeModal();render()};
function editTask(id){openModal(tasks.find(t=>t.id===id))}
function deleteTask(id){if(confirm("Delete this task?")){tasks=tasks.filter(t=>t.id!==id);save();render()}}
function toggleTask(id){tasks=tasks.map(t=>t.id===id?{...t,status:t.status==="completed"?"pending":"completed"}:t);save();render()}
["searchInput","statusFilter","priorityFilter"].forEach(id=>$(id).addEventListener("input",render));
render();