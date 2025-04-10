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

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginScreen = document.getElementById("login-screen");
const mainPanel = document.getElementById("main-panel");
const loginError = document.getElementById("login-error");

const pendenciasList = document.getElementById("pendencias-list");
const resolvidasList = document.getElementById("resolvidas-list");
const detalhesContainer = document.getElementById("detalhes-container");
const salvarBtn = document.getElementById("salvar-btn");
const salvarMsg = document.getElementById("salvar-msg");

const novoAndamento = document.getElementById("novo-andamento");
const enviarAndamento = document.getElementById("enviar-andamento");
const andamentosList = document.getElementById("andamentos-list");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    loginScreen.classList.add("hidden");
    mainPanel.classList.remove("hidden");
    carregarPendencias();
  } catch (err) {
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
  resolvidasList.innerHTML = "";
  const snapshot = await db.collection("pendencias").get();
  const hoje = new Date();

  snapshot.forEach(doc => {
    const data = doc.data();
    const prazo = new Date(data.prazo);
    const diasRestantes = calcularDiasRestantes(data.prazo);
    const item = document.createElement("li");
    item.textContent = `${data.processo} (${diasRestantes >= 0 ? 'faltam ' + diasRestantes + ' dias' : 'vencido'})`;
    item.addEventListener("click", () => carregarDetalhes(doc.id));

    if (data.status === "resolvido") {
      item.classList.add("resolvida");
      resolvidasList.appendChild(item);
    } else if (prazo < hoje) {
      item.classList.add("atrasada");
      resolvidasList.appendChild(item);
    } else if (diasRestantes === 0) {
      item.classList.add("vencendo-hoje");
      pendenciasList.appendChild(item);
    } else {
      pendenciasList.appendChild(item);
    }
  });
}

async function carregarDetalhes(docId) {
  const doc = await db.collection("pendencias").doc(docId).get();
  if (!doc.exists) return;
  const data = doc.data();
  currentDocId = docId;
  salvarMsg.textContent = "";
  detalhesContainer.classList.remove("hidden");

  document.getElementById("det-processo-text").textContent = data.processo;

  const partesList = document.getElementById("det-partes-list");
  partesList.innerHTML = "";
  if (Array.isArray(data.partes)) {
    data.partes.forEach(parte => {
      const li = document.createElement("li");
      li.textContent = parte;
      partesList.appendChild(li);
    });
  }

  document.getElementById("det-descricao-text").textContent = data.descricao;
  document.getElementById("det-descricao").value = data.descricao;
  originalValues["det-descricao"] = data.descricao;

  document.getElementById("det-data-inicial-text").textContent = data.data_inicial;
  document.getElementById("det-prazo-text").textContent = data.prazo;

  document.getElementById("det-status").value = data.status || "pendente";
  originalValues["det-status"] = data.status || "pendente";

  document.getElementById("det-comentarios-text").textContent = data.comentarios;
  document.getElementById("det-comentarios").value = data.comentarios || "";
  originalValues["det-comentarios"] = data.comentarios || "";

  carregarAndamentos(data.andamentos || []);
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

document.querySelectorAll(".editar").forEach(botao => {
  botao.addEventListener("click", () => {
    const id = botao.dataset.alvo;
    const span = document.getElementById(`${id}-text`);
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
    descricao: document.getElementById("det-descricao").value.trim(),
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
  const autor = auth.currentUser.email;
  const data = new Date().toISOString();

  const docRef = db.collection("pendencias").doc(currentDocId);
  const doc = await docRef.get();
  const dados = doc.data();

  const novoArray = dados.andamentos || [];
  novoArray.push({ texto, autor, data });

  await docRef.update({ andamentos: novoArray });

  novoAndamento.value = "";
  carregarDetalhes(currentDocId);
});
