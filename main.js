(function(){
    const state = {
        clients: JSON.parse(localStorage.getItem('clients') || '[]'),
        leads: JSON.parse(localStorage.getItem('leads') || '[]')
    };

    const pages = document.querySelectorAll('.page');
    document.querySelectorAll('.nav a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const page = a.getAttribute('data-page');
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(page).classList.add('active');
            updateStats();
        });
    });

    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? '' : 'dark';
        modeToggle.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
    });

    function showModal(content){
        const modal = document.getElementById('modal');
        document.getElementById('modalBody').innerHTML = '';
        document.getElementById('modalBody').appendChild(content);
        modal.classList.remove('hidden');
    }
    document.getElementById('closeModal').addEventListener('click', ()=>{
        document.getElementById('modal').classList.add('hidden');
    });

    function snackbar(msg){
        const sb = document.getElementById('snackbar');
        sb.textContent = msg;
        sb.className = 'show';
        setTimeout(()=>sb.className='',3000);
    }

    function save(){
        localStorage.setItem('clients', JSON.stringify(state.clients));
        localStorage.setItem('leads', JSON.stringify(state.leads));
        updateStats();
    }

    function updateStats(){
        document.getElementById('clientsCount').textContent = 'Clients: '+state.clients.length;
        document.getElementById('leadsCount').textContent = 'Leads: '+state.leads.length;
        document.getElementById('invoicesCount').textContent = 'Invoices Pending: '+state.clients.length;
        renderLists();
    }

    function renderLists(){
        const clientList = document.getElementById('clientList');
        clientList.innerHTML = '';
        const search = document.getElementById('clientSearch').value.toLowerCase();
        state.clients.filter(c=>c.name.toLowerCase().includes(search)).forEach((client,idx)=>{
            const div = document.createElement('div');
            div.className='card';
            div.innerHTML=`<strong>${client.name}</strong><br>${client.email}<br>${client.service}<br><button data-edit="${idx}">Edit</button> <button data-del="${idx}">Delete</button>`;
            clientList.appendChild(div);
        });
        const leadList = document.getElementById('leadList');
        leadList.innerHTML='';
        const lsearch=document.getElementById('leadSearch').value.toLowerCase();
        state.leads.filter(l=>l.name.toLowerCase().includes(lsearch)).forEach((lead,idx)=>{
            const div=document.createElement('div');
            div.className='card';
            div.innerHTML=`<strong>${lead.name}</strong><br>${lead.status}<br>${lead.notes}<br><button data-ledit="${idx}">Edit</button> <button data-ldel="${idx}">Delete</button>`;
            leadList.appendChild(div);
        });
    }

    document.getElementById('clientList').addEventListener('click', e=>{
        if(e.target.dataset.del){
            state.clients.splice(e.target.dataset.del,1);
            save();
            snackbar('Client deleted');
        }else if(e.target.dataset.edit){
            const idx=e.target.dataset.edit;
            openClientForm(state.clients[idx], idx);
        }
    });

    document.getElementById('leadList').addEventListener('click', e=>{
        if(e.target.dataset.ldel){
            state.leads.splice(e.target.dataset.ldel,1);
            save();
            snackbar('Lead deleted');
        }else if(e.target.dataset.ledit){
            const idx=e.target.dataset.ledit;
            openLeadForm(state.leads[idx], idx);
        }
    });

    document.getElementById('clientSearch').addEventListener('input', renderLists);
    document.getElementById('leadSearch').addEventListener('input', renderLists);

    document.getElementById('addClientBtn').addEventListener('click', ()=>openClientForm());
    document.getElementById('addLeadBtn').addEventListener('click', ()=>openLeadForm());

    function openClientForm(data={}, idx){
        const form=document.createElement('form');
        form.innerHTML=`<h3>${idx!=null?'Edit':'Add'} Client</h3>
            <label>Name<input required name="name" value="${data.name||''}"></label>
            <label>Email<input type="email" required name="email" value="${data.email||''}"></label>
            <label>Service<input name="service" value="${data.service||''}"></label>
            <button class="btn" type="submit">Save</button>`;
        form.addEventListener('submit', e=>{
            e.preventDefault();
            const formData=new FormData(form);
            const obj=Object.fromEntries(formData.entries());
            if(idx!=null){state.clients[idx]=obj;}else{state.clients.push(obj);} 
            save();
            document.getElementById('modal').classList.add('hidden');
            snackbar('Client saved');
        });
        showModal(form);
    }

    function openLeadForm(data={}, idx){
        const form=document.createElement('form');
        form.innerHTML=`<h3>${idx!=null?'Edit':'Add'} Lead</h3>
            <label>Name<input required name="name" value="${data.name||''}"></label>
            <label>Status<input name="status" value="${data.status||''}"></label>
            <label>Notes<textarea name="notes">${data.notes||''}</textarea></label>
            <button class="btn" type="submit">Save</button>`;
        form.addEventListener('submit', e=>{
            e.preventDefault();
            const formData=new FormData(form);
            const obj=Object.fromEntries(formData.entries());
            if(idx!=null){state.leads[idx]=obj;}else{state.leads.push(obj);} 
            save();
            document.getElementById('modal').classList.add('hidden');
            snackbar('Lead saved');
        });
        showModal(form);
    }

    document.getElementById('createInvoice').addEventListener('click', ()=>{
        const doc = new jspdf.jsPDF();
        doc.text('Invoice Example',10,10);
        doc.save('invoice.pdf');
    });

    document.getElementById('createContract').addEventListener('click', ()=>{
        const doc = new jspdf.jsPDF();
        doc.text('Contract Example',10,10);
        doc.save('contract.pdf');
    });

    // init
    state.clients = state.clients.length?state.clients:[{name:'Acme Co',email:'client@example.com',service:'Logo Design'}];
    state.leads = state.leads.length?state.leads:[{name:'New Lead',status:'Follow up',notes:'Found on social media'}];
    save();
})();
