// script.js

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginScreen = document.getElementById("login-screen");
const mainPanel = document.getElementById("main-panel");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const pendenciasList = document.getElementById("pendencias-list");
const resolvidasList = document.getElementById("resolvidas-list");
const detalhesContainer = document.getElementById("detalhes-container");
const salvarBtn = document.getElementById("salvar-btn");
const salvarMsg = document.getElementById("salvar-msg");
const novoAndamento = document.getElementById("novo-andamento");
const enviarAndamento = document.getElementById("enviar-andamento");
const andamentosList = document.getElementById("andamentos-list");

let currentDocId = null;

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
    const status = data.status;
    const diasRestantes = calcularDiasRestantes(data.prazo);
    const item = document.createElement("li");
    item.textContent = `${data.processo} (${diasRestantes >= 0 ? 'faltam ' + diasRestantes + ' dias' : 'vencido'})`;
    item.addEventListener("click", () => carregarDetalhes(doc.id));

    if (status === "resolvido") {
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

  document.getElementById("det-processo").textContent = data.processo;
  document.getElementById("det-descricao").textContent = data.descricao;
  document.getElementById("det-data-inicial").textContent = data.data_inicial;
  document.getElementById("det-prazo").textContent = data.prazo;
  document.getElementById("det-status").value = data.status || "pendente";
  document.getElementById("det-comentarios").value = data.comentarios || "";

  carregarAndamentos(data.andamentos || []);

  detalhesContainer.classList.remove("hidden");
  salvarMsg.textContent = "";
}

function carregarAndamentos(lista) {
  andamentosList.innerHTML = "";
  lista.forEach(andamento => {
    const div = document.createElement("div");
    div.classList.add("andamento-item");
    div.innerHTML = `
      <p>${andamento.texto}</p>
      <small>${andamento.autor} — ${new Date(andamento.data).toLocaleString()}</small>
    `;
    andamentosList.appendChild(div);
  });
}

enviarAndamento.addEventListener("click", async () => {
  if (!currentDocId || !novoAndamento.value.trim()) return;
  const texto = novoAndamento.value.trim();
  const autor = auth.currentUser.email;
  const data = new Date().toISOString();

  const docRef = db.collection("pendencias").doc(currentDocId);
  await docRef.update({
    andamentos: firebase.firestore.FieldValue.arrayUnion({ texto, autor, data })
  });

  novoAndamento.value = "";
  carregarDetalhes(currentDocId);
});

salvarBtn.addEventListener("click", async () => {
  if (!currentDocId) return;
  const status = document.getElementById("det-status").value;
  const comentarios = document.getElementById("det-comentarios").value;

  await db.collection("pendencias").doc(currentDocId).update({
    status,
    comentarios
  });

  salvarMsg.textContent = "Atualizado com sucesso!";
  detalhesContainer.classList.add("hidden");
  carregarPendencias();
});
