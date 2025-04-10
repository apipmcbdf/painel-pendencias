import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🔐 Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMT1wEM5zgWgazsKv8XnO0zzHp7UB4ov4",
  authDomain: "painel-pendencias.firebaseapp.com",
  projectId: "painel-pendencias",
  storageBucket: "painel-pendencias.firebasestorage.app",
  messagingSenderId: "969369108934",
  appId: "1:969369108934:web:88c5ac5a8acd987509f2c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elementos da interface
const loginContainer = document.getElementById("login-container");
const painel = document.getElementById("main-panel");
const pendenciasContainer = document.getElementById("pendencias");
const listaPartes = document.getElementById("lista-partes");
const descricaoEl = document.getElementById("descricao");
const processoEl = document.getElementById("processo");
const dataInicialEl = document.getElementById("data-inicial");
const prazoFinalEl = document.getElementById("prazo-final");
const comentariosEl = document.getElementById("comentarios");

// Carrega os detalhes da pendência ao centro
function carregarPendencia(pendencia) {
  processoEl.textContent = pendencia.processo;
  descricaoEl.textContent = pendencia.descricao;
  dataInicialEl.textContent = pendencia.dataInicial.split(" ")[0];
  prazoFinalEl.textContent = pendencia.prazoFinal.split(" ")[0];
  comentariosEl.value = pendencia.comentarios || "";

  listaPartes.innerHTML = "";
  pendencia.partes.forEach(parte => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="parte-nome">${parte.nome}</button>
      <div class="detalhes-parte hidden">
        <label>Telefone: <input type="text" value="${parte.telefone || ''}" /></label><br />
        <label>Email: <input type="email" value="${parte.email || ''}" /></label><br />
        <label>Contato:
          <select>
            <option ${parte.contato === 'Sim' ? 'selected' : ''}>Sim</option>
            <option ${parte.contato === 'Não' ? 'selected' : ''}>Não</option>
          </select>
        </label><br />
        <label>Status:
          <select class="status-parte">
            <option ${parte.status === 'Vivo' ? 'selected' : ''}>Vivo</option>
            <option ${parte.status === 'Falecido' ? 'selected' : ''}>Falecido</option>
          </select>
        </label><br />
        <div class="herdeiros hidden">
          <label>Herdeiros: <textarea>${parte.herdeiros || ''}</textarea></label>
        </div>
        <label>Assinou o Acordo?
          <select>
            <option ${parte.assinou === 'Sim' ? 'selected' : ''}>Sim</option>
            <option ${parte.assinou === 'Não' ? 'selected' : ''}>Não</option>
          </select>
        </label>
      </div>
    `;
    listaPartes.appendChild(li);
  });
}

// Mostra/esconde detalhes ao clicar no nome da parte
listaPartes.addEventListener("click", e => {
  if (e.target.classList.contains("parte-nome")) {
    const detalhes = e.target.nextElementSibling;
    detalhes.classList.toggle("hidden");
  }
});

// Mostra campo de herdeiros se status for Falecido
listaPartes.addEventListener("change", e => {
  if (e.target.classList.contains("status-parte")) {
    const status = e.target.value;
    const herdeirosDiv = e.target.closest(".detalhes-parte").querySelector(".herdeiros");
    herdeirosDiv.classList.toggle("hidden", status !== "Falecido");
  }
});

// Agrupa pendências por descrição
function agruparPorDescricao(lista) {
  const grupos = {};
  lista.forEach(pendencia => {
    const desc = pendencia.descricao.toUpperCase();
    if (!grupos[desc]) grupos[desc] = [];
    grupos[desc].push(pendencia);
  });
  return grupos;
}

// Renderiza painel da esquerda agrupado
function renderizarPendenciasAgrupadas(pendencias) {
  const grupos = agruparPorDescricao(pendencias);
  pendenciasContainer.innerHTML = "";

  Object.entries(grupos).forEach(([descricao, processos]) => {
    const grupoDiv = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = descricao;
    titulo.classList.add("grupo-descricao");

    const lista = document.createElement("ul");
    lista.classList.add("lista-processos");

    processos.forEach(p => {
      const item = document.createElement("li");
      item.classList.add("item-processo");
      item.textContent = `${p.processo} (${p.prazoFinal.split(" ")[0]})`;
      item.addEventListener("click", () => carregarPendencia(p));
      lista.appendChild(item);
    });

    grupoDiv.appendChild(titulo);
    grupoDiv.appendChild(lista);
    pendenciasContainer.appendChild(grupoDiv);
  });
}

// Carrega dados do Firebase
async function carregarPendenciasDoFirebase() {
  const snapshot = await getDocs(collection(db, "pendencias"));
  const pendencias = snapshot.docs.map(doc => doc.data());
  renderizarPendenciasAgrupadas(pendencias);
  if (pendencias.length > 0) carregarPendencia(pendencias[0]);
}

// Autenticação com Firebase
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginContainer.classList.add("hidden");
    painel.classList.remove("hidden");
    carregarPendenciasDoFirebase();
  } else {
    loginContainer.classList.remove("hidden");
    painel.classList.add("hidden");
  }
});

// Login
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("Login realizado com sucesso!");
    })
    .catch((error) => {
      alert("Erro no login: " + error.message);
    });
});

// Botão salvar
document.getElementById("salvar-alteracoes").addEventListener("click", () => {
  alert("Alterações salvas (mock). Salvar no Firestore ainda será implementado.");
});
