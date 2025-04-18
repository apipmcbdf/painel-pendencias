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

// Mapeamento entre número de processo e link da pasta no Google Drive
const driveLinksPorProcesso = {
  "0067270-02.2016.4.01.3400": "https://drive.google.com/drive/folders/1OY-83t2ueP4AZvAylFOWlV9dWDxAXFJ8?usp=drive_link",
  "0067273-54.2016.4.01.3400": "https://drive.google.com/drive/folders/1hGOIsKXMMRCAWnQ1SARiKm6QvyXgPkBY?usp=sharing",
  "1010657-37.2019.4.01.3400": "https://drive.google.com/drive/folders/1z3Zoxh6d1-x2lWxkHgDbBTCofoThOAy6?usp=sharing",
  "1013014-87.2019.4.01.3400": "https://drive.google.com/drive/folders/1KRoS7eVNPhk2KtpbB9HtxnaIqAoyaChS?usp=sharing",
  "1013785-31.2020.4.01.3400": "https://drive.google.com/drive/folders/1hHkKmbSrGRwS_JiHpZ0LEcUfsjPq2Teh?usp=sharing",
  "1019563-16.2019.4.01.3400": "https://drive.google.com/drive/folders/1P-JfEI-yvmvllrlMJtPVKkuh4h-OgeVs?usp=sharing",
  "1021826-45.2024.4.01.3400": "https://drive.google.com/drive/folders/1hGh9QLUoVj7x5fZrFcZyxruzozy1r3Ng?usp=sharing",
  "1066615-71.2020.4.01.3400": "https://drive.google.com/drive/folders/1I8-EtZFSdwzGsOKvOg638fRW2qOVMISZ?usp=sharing",
  "1080504-58.2021.4.01.3400": "https://drive.google.com/drive/folders/1LS_ao5pTAnbBuArL0Pnp63DY510pFAI9?usp=sharing",
  "1111756-11.4.01.3400": "https://drive.google.com/drive/folders/1hHVZGiY7Y9VCpmiGOJoFxA5XZYWZGgH1?usp=sharing"
};

const nomesPorEmail = {
  "advogada1@teste.com": "ADVOGADA TESTE",
  "yasmim.ribeiro@apipmcbdf.com.br": "YASMIM",
  "marcelledias.adv@gmail.com": "DRA MARCELLE",
  "grazielasuelimenini2@gmail.com": "DRA GRAZIELA"
};

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const loginError = document.getElementById("login-error");

const pendenciasList = document.getElementById("pendencias-list");
const detalhesSection = document.getElementById("detalhes-section");
const salvarBtn = document.getElementById("salvar-btn");
const salvarMsg = document.getElementById("salvar-msg");

const novoAndamento = document.getElementById("novo-andamento");
const enviarAndamento = document.getElementById("enviar-andamento");
const andamentosList = document.getElementById("andamentos-list");
const detPartesList = document.getElementById("det-partes-list");

// Modal para exibir detalhes da Parte
const modal = document.getElementById("modal");
const modalClose = document.querySelector(".modal .close");
const parteDetailsContainer = document.getElementById("parte-details-container");

// Abas
const tabs = document.querySelectorAll(".tab");
const tabPanels = document.querySelectorAll(".tab-panel");

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
    dashboard.classList.remove("hidden");
    carregarPendencias();
  } catch (err) {
    console.error("❌ Erro ao fazer login:", err.message);
    loginError.textContent = "Usuário ou senha inválidos.";
  }
});

function calcularDiasRestantes(prazo) {
  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  const diff = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24));
  return diff;
}

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

  for (const descricao in grupos) {
    const grupoContainer = document.createElement("div");
    grupoContainer.className = "grupo-descricao";
    
    const header = document.createElement("h4");
    header.textContent = descricao;
    header.addEventListener("click", () => {
      const ul = grupoContainer.querySelector("ul");
      ul.style.display = ul.style.display === "none" ? "block" : "none";
    });
    grupoContainer.appendChild(header);
    
    const ul = document.createElement("ul");
    ul.style.display = "none";
    grupos[descricao].forEach(item => {
      const { data } = item;
      const li = document.createElement("li");
      if (data.status === "resolvido") {
        li.textContent = `${data.processo} (Resolvido)`;
        li.style.color = "green";
      } else {
        const diasRestantes = calcularDiasRestantes(data.prazo);
        let info = `${data.processo} `;
        if (diasRestantes >= 0) info += `(faltam ${diasRestantes} dias)`;
        else info += `(vencido)`;
        li.textContent = info;
        if (diasRestantes < 7) {
          li.style.color = "red";
        }
      }
      li.addEventListener("click", () => carregarDetalhes(item.id));
      ul.appendChild(li);
    });
    grupoContainer.appendChild(ul);
    pendenciasList.appendChild(grupoContainer);
  }
}

async function carregarDetalhes(docId) {
  const doc = await db.collection("pendencias").doc(docId).get();
  if (!doc.exists) return;
  const data = doc.data();
  currentDocId = docId;
  salvarMsg.textContent = "";
  detalhesSection.classList.remove("hidden");

  // Exibe o número do processo e, se houver um link no mapeamento, adiciona o hyperlink
  const processoElement = document.getElementById("det-processo-text");
  const processoNumber = data.processo;
  if (driveLinksPorProcesso[processoNumber]) {
    processoElement.innerHTML = processoNumber +
      ' <a href="' + driveLinksPorProcesso[processoNumber] + '" target="_blank">📁 Ver pasta</a>';
  } else {
    processoElement.textContent = processoNumber;
  }

  document.getElementById("det-descricao-text").textContent = data.descricao;
  document.getElementById("det-data-inicial-text").textContent = new Date(data.data_inicial).toISOString().split("T")[0];
  document.getElementById("det-prazo-text").textContent = new Date(data.prazo).toISOString().split("T")[0];

  document.getElementById("det-status").value = data.status || "pendente";
  originalValues["det-status"] = data.status || "pendente";

  document.getElementById("det-comentarios-text").textContent = data.comentarios || "";
  document.getElementById("det-comentarios").value = data.comentarios || "";
  originalValues["det-comentarios"] = data.comentarios || "";

  carregarAndamentos(data.andamentos || []);
  carregarPartes(data.partes || []);
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

function carregarPartes(partes) {
  detPartesList.innerHTML = "";
  partes.forEach((parte, index) => {
    const li = document.createElement("li");
    let nome;
    let flagsHTML = "";
    
    if (typeof parte === "object") {
      nome = parte.nome;
      
      // Flag para contato
      const contatoFlag = (parte.contato && parte.contato.toLowerCase() === "sim")
                            ? '<span class="flag flag-contato" title="Contato realizado">📞✅</span>'
                            : '<span class="flag flag-contato" title="Sem contato">📞❌</span>';
      
      // Flag para status (vivo ou falecido)
      let statusFlag = '<span class="flag flag-status" title="Status desconhecido">❓</span>';
      if (parte.status) {
        const st = parte.status.toLowerCase();
        statusFlag = (st === "vivo")
                      ? '<span class="flag flag-status" title="Vivo">🟢</span>'
                      : ((st === "falecido" || st === "morto")
                          ? '<span class="flag flag-status" title="Falecido">🕊️</span>'
                          : '<span class="flag flag-status" title="Status desconhecido">❓</span>');
      }
      
      // Flag para acordo assinado
      const acordoFlag = (parte.assinou && parte.assinou.toLowerCase() === "sim")
                           ? '<span class="flag flag-acordo" title="Assinou o acordo">📝</span>'
                           : '<span class="flag flag-acordo" title="Não assinou o acordo">📄❌</span>';
      
      flagsHTML = ` ${contatoFlag} ${statusFlag} ${acordoFlag}`;
    } else {
      nome = parte;
    }
    
    li.innerHTML = nome + flagsHTML;
    li.addEventListener("click", () => abrirModalParte(parte, index));
    detPartesList.appendChild(li);
  });
}

function abrirModalParte(parte, index) {
  parteDetailsContainer.innerHTML = `
    <h3>Detalhes da Parte - ${(typeof parte === "object") ? parte.nome : parte}</h3>
    <label>Telefone: <input type="text" class="parte-telefone" value="${parte.telefone || ''}" data-index="${index}" /></label>
    <label>Email: <input type="text" class="parte-email" value="${parte.email || ''}" data-index="${index}" /></label>
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
    <div class="parte-herdeiros ${(parte.status === "falecido") ? "" : "hidden"}">
      <label>Herdeiros: <input type="text" class="parte-herdeiros-input" value="${parte.herdeiros || ''}" data-index="${index}" /></label>
    </div>
    <label>Assinou Acordo:
      <select class="parte-assinou" data-index="${index}">
        <option value="sim" ${(parte.assinou === "sim") ? "selected" : ""}>Sim</option>
        <option value="não" ${(parte.assinou === "não") ? "selected" : ""}>Não</option>
      </select>
    </label>
    <button class="parte-salvar" data-index="${index}">Salvar Parte</button>
  `;
  modal.classList.remove("hidden");

  // Exibe/oculta campo de herdeiros baseado no status
  const selectStatus = parteDetailsContainer.querySelector(".parte-status");
  selectStatus.addEventListener("change", (e) => {
    const herdeirosDiv = parteDetailsContainer.querySelector(".parte-herdeiros");
    if (e.target.value === "falecido") {
      herdeirosDiv.classList.remove("hidden");
    } else {
      herdeirosDiv.classList.add("hidden");
    }
  });

  const salvarParteBtn = parteDetailsContainer.querySelector(".parte-salvar");
  salvarParteBtn.addEventListener("click", async () => {
    const container = parteDetailsContainer;
    const telefone = container.querySelector(".parte-telefone").value;
    const email = container.querySelector(".parte-email").value;
    const contato = container.querySelector(".parte-contato").value;
    const status = container.querySelector(".parte-status").value;
    const herdeirosElement = container.querySelector(".parte-herdeiros-input");
    const herdeiros = herdeirosElement ? herdeirosElement.value : "";
    const assinou = container.querySelector(".parte-assinou").value;
    
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
    modal.classList.add("hidden");
    carregarDetalhes(currentDocId);
  });
}

// Edição dos comentários
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

// Alternar entre abas (se houver)
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    tabPanels.forEach(panel => {
      if (panel.id === target + "-tab") {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  });
});

// Fechar modal
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Fechar modal ao clicar fora do conteúdo
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
