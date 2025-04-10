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
const resolvidasList = document.getElementById("resolvidas-list");
const detalhesContainer = document.getElementById("detalhes-container");
const salvarBtn = document.getElementById("salvar-btn");
const salvarMsg = document.getElementById("salvar-msg");

loginBtn.addEventListener("click", async () => {
  console.log("🔐 Botão de login clicado");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    console.warn("⚠️ Email ou senha em branco");
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

async function carregarPendencias() {
  pendenciasList.innerHTML = "";
  resolvidasList.innerHTML = "";

  const snapshot = await db.collection("pendencias").get();
  const hoje = new Date();

  snapshot.forEach(doc => {
    const data = doc.data();
    const prazo = new Date(data.prazo);
    const status = data.status;

    const item = document.createElement("li");
    item.textContent = data.processo;
    item.addEventListener("click", () => carregarDetalhes(doc.id));

    if (status === "resolvido" || prazo < hoje) {
      item.classList.add(prazo < hoje ? "atrasada" : "resolvida");
      resolvidasList.appendChild(item);
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

  document.getElementById("det-data-inicial-text").textContent = data.data_inicial;
  document.getElementById("det-prazo-text").textContent = data.prazo;

  document.getElementById("det-status").value = data.status || "pendente";
  document.getElementById("det-comentarios-text").textContent = data.comentarios || "";
  document.getElementById("det-comentarios").value = data.comentarios || "";

  detalhesContainer.classList.remove("hidden");
  salvarMsg.textContent = "";
}

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
