console.log("✅ Script carregado");

const firebaseConfig = {
  apiKey: "AIzaSyAMT1wEM5zgWgazsKv8XnO0zzHp7UB4ov4",
  authDomain: "painel-pendencias.firebaseapp.com",
  projectId: "painel-pendencias",
  storageBucket: "painel-pendencias.firebasestorage.app",
  messagingSenderId: "969369108934",
  appId: "1:969369108934:web:88c5ac5a8acd987509f2c7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentDocId = null;
const originalValues = {};

const nomesPorEmail = {
  "advogada1@teste.com": "Mario Encanador"
};

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginScreen = document.getElementById("login-screen");
const mainPanel = document.getElementById("main-panel");
const loginError = document.getElementById("login-error");

const pendenciasList = document.getElementById("pendencias-list");
const detalhesContainer = document.getElementById("detalhes-container");
const salvarBtn = document.getElementById("salvar-btn");
const salvarMsg = document.getElementById("salvar-msg");

const novoAndamento = document.getElementById("novo-andamento");
const enviarAndamento = document.getElementById("enviar-andamento");
const andamentosList = document.getElementById("andamentos-list");

loginBtn.addEventListener("click", async () => {
  console.log("🔐 Botão de login clicado");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    loginError.textContent = "Preencha todos os campos.";
    return;
  }

  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    console.log("✅ Login bem-sucedido:", result.user.email);
    loginScreen.classList.add("hidden");
    mainPanel.classList.remove("hidden");
    carregarPendencias();
  } catch (err) {
    console.error("❌ Erro ao fazer login:", err.message);
    loginError.textContent = "Usuário ou senha inválidos.";
  }
});

// Função para calcular os dias restantes a partir de um prazo
function calcularDiasRestantes(prazo) {
  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  const diff = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24));
  return diff;
}

// CARREGAR AS PENDÊNCIAS AGRUPADAS POR DESCRIÇÃO (accordion)
// Agora todos os itens (incluindo resolvidos) são exibidos na coluna da esquerda com formatação diferenciada
async function carregarPendencias() {
  pendenciasList.innerHTML = "";
  
  const snapshot = await db.collection("pendencias").get();
  const grupos = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const descricao = data.descricao;
    if (!grupos[descricao]) {
      grupos[descricao] = [];
    }
    grupos[descricao].push({ id: doc.id, data });
  });

  // Construir cada grupo (accordion) – os itens iniciam recolhidos
  for (const descricao in grupos) {
    const grupoContainer = document.createElement("div");
    grupoContainer.className = "grupo-descricao";
    
    const header = document.createElement("h4");
    header.textContent = descricao;
    header.addEventListener("click", () => {
      // Toggle da lista: inicia recolhida
      const ul = grupoContainer.querySelector("ul");
      ul.style.display = (ul.style.display === "none" ? "block" : "none");
    });
    grupoContainer.appendChild(header);
    
    const ul = document.createElement("ul");
    ul.style.display = "none"; // inicia recolhido
    grupos[descricao].forEach(item => {
      const { data } = item;
      const li = document.createElement("li");
      
      // Se o status for "resolvido", mostra o processo em verde e com a tag (Resolvido)
      if (data.status === "resolvido") {
        li.textContent = `${data.processo} (Resolvido)`;
        li.style.color = "green";
      } else {
        const diasRestantes = calcularDiasRestantes(data.prazo);
        let info = `${data.processo} `;
        if (diasRestantes >= 0) info += `(${'faltam ' + diasRestantes + ' dias'})`;
        else info += `(vencido)`;
        li.textContent = info;
      }
      li.addEventListener("click", () => carregarDetalhes(item.id));
      ul.appendChild(li);
    });
    grupoContainer.appendChild(ul);
    pendenciasList.appendChild(grupoContainer);
  }
}

// CARREGAR DETALHES DA PENDÊNCIA
async function carregarDetalhes(docId) {
  const doc = await db.collection("pendencias").doc(docId).get();
  if (!doc.exists) return;
  const data = doc.data();
  currentDocId = docId;
  salvarMsg.textContent = "";
  detalhesContainer.classList.remove("hidden");

  document.getElementById("det-processo-text").textContent = data.processo;
  document.getElementById("det-descricao-text").textContent = data.descricao;
  document.getElementById("det-data-inicial-text").textContent = new Date(data.data_inicial).toISOString().split("T")[0];
  document.getElementById("det-prazo-text").textContent = new Date(data.prazo).toISOString().split("T")[0];

  // Atualiza o status e comentários
  document.getElementById("det-status").value = data.status || "pendente";
  originalValues["det-status"] = data.status || "pendente";

  document.getElementById("det-comentarios-text").textContent = data.comentarios || "";
  document.getElementById("det-comentarios").value = data.comentarios || "";
  originalValues["det-comentarios"] = data.comentarios || "";

  // Carrega os andamentos
  carregarAndamentos(data.andamentos || []);

  // Carrega as informações das partes
  const partesList = document.getElementById("det-partes-list");
  partesList.innerHTML = "";
  if (Array.isArray(data.partes)) {
    data.partes.forEach((parte, index) => {
      const li = document.createElement("li");
      // Exibe o nome da parte
      const nome = (typeof parte === "object") ? parte.nome : parte;
      li.innerHTML = `<span class="parte-name">${nome}</span>`;
      
      // Cria um container com os detalhes da parte
      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("parte-details");
      // Inicialmente o container ficará oculto, mas agora ele será exibido na coluna da direita
      detailsDiv.classList.add("hidden");
      detailsDiv.innerHTML = `
        <label>Telefone: <input type="text" class="parte-telefone" value="${(parte.telefone) || ''}" data-index="${index}" /></label>
        <label>Email: <input type="text" class="parte-email" value="${(parte.email) || ''}" data-index="${index}" /></label>
        <label>Contato: 
          <select class="parte-contato" data-index="${index}">
            <option value="sim" ${(parte.contato === "sim") ? "selected" : ""}>Sim</option>
            <option value="não" ${(parte.contato === "não") ? "selected" : ""}>Não</option>
          </select>
        </label>
        <label>Status: 
          <select class="parte-status" data-index="${index}">
            <option value="vivo" ${(parte.status === "vivo") ? "selected" : ""}>Vivo</option>
            <option value="falecido" ${(parte.status === "falecido") ? "selected" : ""}>Falecido</option>
          </select>
        </label>
        <div class="parte-herdeiros ${parte.status === "falecido" ? "" : "hidden"}">
          <label>Herdeiros: <input type="text" class="parte-herdeiros-input" value="${(parte.herdeiros) || ''}" data-index="${index}" /></label>
        </div>
        <label>Assinou Acordo:
          <select class="parte-assinou" data-index="${index}">
            <option value="sim" ${(parte.assinou === "sim") ? "selected" : ""}>Sim</option>
            <option value="não" ${(parte.assinou === "não") ? "selected" : ""}>Não</option>
          </select>
        </label>
        <button class="parte-salvar" data-index="${index}">Salvar Parte</button>
      `;
      // Ao clicar no nome da parte, exibe os detalhes na coluna da direita
      li.querySelector(".parte-name").addEventListener("click", () => {
        const parteDetailsDisplay = document.getElementById("parte-details-display");
        // Exibe os detalhes da parte selecionada
        parteDetailsDisplay.innerHTML = "";
        detailsDiv.classList.remove("hidden");
        parteDetailsDisplay.appendChild(detailsDiv);
      });
      li.appendChild(detailsDiv);
      partesList.appendChild(li);
    });

    // Adiciona os event listeners para tratamento dos selects e botões das partes
    document.querySelectorAll(".parte-status").forEach(select => {
      select.addEventListener("change", (e) => {
        const li = e.target.closest("li");
        const herdeirosDiv = li.querySelector(".parte-herdeiros");
        if (e.target.value === "falecido") {
          herdeirosDiv.classList.remove("hidden");
        } else {
          herdeirosDiv.classList.add("hidden");
        }
      });
    });

    document.querySelectorAll(".parte-salvar").forEach(button => {
      button.addEventListener("click", async (e) => {
        const index = e.target.dataset.index;
        const li = e.target.closest("li");
        const telefone = li.querySelector(".parte-telefone").value;
        const email = li.querySelector(".parte-email").value;
        const contato = li.querySelector(".parte-contato").value;
        const status = li.querySelector(".parte-status").value;
        const herdeiros = li.querySelector(".parte-herdeiros-input").value;
        const assinou = li.querySelector(".parte-assinou").value;

        // Atualiza a parte no documento do Firebase
        const docRef = db.collection("pendencias").doc(currentDocId);
        const docSnap = await docRef.get();
        let partes = docSnap.data().partes;
        if (!Array.isArray(partes)) partes = [];
        partes[index] = {
          nome: (typeof partes[index] === "object" && partes[index].nome) ? partes[index].nome : partes[index],
          telefone,
          email,
          contato,
          status,
          herdeiros: status === "falecido" ? herdeiros : "",
          assinou
        };
        await docRef.update({ partes });
        alert("Informações da parte atualizadas!");
      });
    });
  }
}

function carregarAndamentos(lista) {
  andamentosList.innerHTML = "";
  lista.forEach(and => {
    const div = document.createElement("div");
    div.className = "andamento-item";
    div.innerHTML = `
      <p>${and.texto}</p>
      <small>${and.autor} — ${new Date(and.data).toLocaleString()}</small>
    `;
    andamentosList.appendChild(div);
  });
}

// Apenas mantém o edit para os comentários (não para a descrição)
document.querySelectorAll(".editar").forEach(botao => {
  if (botao.dataset.alvo === "det-descricao") return;
  botao.addEventListener("click", () => {
    const id = botao.dataset.alvo;
    const span = document.getElementById(id + "-text");
    const input = document.getElementById(id);

    if (!input || !span) return;

    if (input.classList.contains("hidden")) {
      input.classList.remove("hidden");
      span.classList.add("hidden");
    } else {
      input.classList.add("hidden");
      span.classList.remove("hidden");
      input.value = originalValues[id];
    }
  });
});

salvarBtn.addEventListener("click", async () => {
  if (!currentDocId) return;
  const dados = {
    // "descricao" não é mais editável
    status: document.getElementById("det-status").value,
    comentarios: document.getElementById("det-comentarios").value.trim()
  };
  await db.collection("pendencias").doc(currentDocId).update(dados);
  salvarMsg.textContent = "Atualizado com sucesso!";
  carregarPendencias();
  carregarDetalhes(currentDocId);
});

enviarAndamento.addEventListener("click", async () => {
  if (!currentDocId || !novoAndamento.value.trim()) return;
  const texto = novoAndamento.value.trim();
  const email = auth.currentUser.email;
  const autor = nomesPorEmail[email] || email;
  const dataAndamento = new Date().toISOString();

  const docRef = db.collection("pendencias").doc(currentDocId);
  const docSnap = await docRef.get();
  const dados = docSnap.data();
  const novoArray = dados.andamentos || [];
  novoArray.push({ texto, autor, data: dataAndamento });

  await docRef.update({ andamentos: novoArray });
  novoAndamento.value = "";
  carregarDetalhes(currentDocId);
});
