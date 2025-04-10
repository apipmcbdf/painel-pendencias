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
