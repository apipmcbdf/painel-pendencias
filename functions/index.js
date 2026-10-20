const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

const LEGACY_ADMIN_EMAILS = new Set(['cavictor.franco@gmail.com']);
const VALID_ROLES = new Set(['administrador', 'editor', 'leitor']);

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function cleanRole(value) {
  const role = String(value || 'editor').toLowerCase();
  return VALID_ROLES.has(role) ? role : 'editor';
}

async function getProfileForAuthUser(uid, email) {
  const uidDoc = await db.collection('usuarios').doc(uid).get();
  if (uidDoc.exists) return { id: uidDoc.id, ...uidDoc.data() };

  const normalized = normalizeEmail(email);
  if (normalized) {
    const emailDoc = await db.collection('usuarios').doc(normalized).get();
    if (emailDoc.exists) return { id: emailDoc.id, ...emailDoc.data() };

    const byEmail = await db.collection('usuarios').where('email', '==', normalized).limit(1).get();
    if (!byEmail.empty) return { id: byEmail.docs[0].id, ...byEmail.docs[0].data() };
  }
  return null;
}

async function assertAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Faça login para continuar.');
  }
  const caller = await auth.getUser(context.auth.uid);
  if (caller.disabled) {
    throw new functions.https.HttpsError('permission-denied', 'Conta bloqueada.');
  }
  const email = normalizeEmail(caller.email);
  if (LEGACY_ADMIN_EMAILS.has(email)) return;

  const profile = await getProfileForAuthUser(context.auth.uid, email);
  if (!profile || profile.ativo === false || profile.perfil !== 'administrador') {
    throw new functions.https.HttpsError('permission-denied', 'Apenas administradores podem gerenciar usuários.');
  }
}

async function profilesMaps() {
  const snap = await db.collection('usuarios').get();
  const byUid = new Map();
  const byEmail = new Map();
  snap.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    byUid.set(doc.id, data);
    if (data.email) byEmail.set(normalizeEmail(data.email), data);
  });
  return { byUid, byEmail };
}

exports.adminListUsers = functions.https.onCall(async (_data, context) => {
  await assertAdmin(context);
  const { byUid, byEmail } = await profilesMaps();
  const users = [];
  let pageToken;

  do {
    const page = await auth.listUsers(1000, pageToken);
    page.users.forEach(user => {
      const profile = byUid.get(user.uid) || byEmail.get(normalizeEmail(user.email)) || {};
      users.push({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        nome: profile.nome || user.displayName || user.email || '',
        perfil: cleanRole(profile.perfil),
        disabled: !!user.disabled,
        emailVerified: !!user.emailVerified,
        creationTime: user.metadata.creationTime || null,
        lastSignInTime: user.metadata.lastSignInTime || null
      });
    });
    pageToken = page.pageToken;
  } while (pageToken);

  users.sort((a, b) => (a.nome || a.email).localeCompare(b.nome || b.email, 'pt-BR'));
  return { users };
});

exports.adminCreateUser = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const email = normalizeEmail(data && data.email);
  const nome = String((data && data.nome) || '').trim();
  const perfil = cleanRole(data && data.perfil);
  const disabled = !!(data && data.disabled);

  if (!email || !email.includes('@')) {
    throw new functions.https.HttpsError('invalid-argument', 'Informe um e-mail válido.');
  }
  if (!nome) {
    throw new functions.https.HttpsError('invalid-argument', 'Informe o nome do usuário.');
  }

  try {
    await auth.getUserByEmail(email);
    throw new functions.https.HttpsError('already-exists', 'Já existe uma conta com este e-mail.');
  } catch (err) {
    if (err instanceof functions.https.HttpsError) throw err;
    if (err.code !== 'auth/user-not-found') throw err;
  }

  const user = await auth.createUser({
    email,
    displayName: nome,
    disabled,
    emailVerified: false
  });

  try {
  await db.collection('usuarios').doc(user.uid).set({
    nome,
    email,
    perfil,
    ativo: !disabled,
    auth_uid: user.uid,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    created_by_uid: context.auth.uid,
    created_by_email: normalizeEmail(context.auth.token.email),
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  } catch (error) {
    await auth.deleteUser(user.uid).catch(() => {});
    throw error;
  }
  return { uid: user.uid, email, nome, perfil, disabled };
});

exports.adminUpdateUser = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const uid = String((data && data.uid) || '').trim();
  const nome = String((data && data.nome) || '').trim();
  const perfil = cleanRole(data && data.perfil);
  const disabled = !!(data && data.disabled);

  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'UID do usuário não informado.');
  if (!nome) throw new functions.https.HttpsError('invalid-argument', 'Informe o nome do usuário.');
  if (uid === context.auth.uid && disabled) {
    throw new functions.https.HttpsError('failed-precondition', 'Você não pode bloquear a própria conta.');
  }
  if (uid === context.auth.uid && perfil !== 'administrador') {
    throw new functions.https.HttpsError('failed-precondition', 'Você não pode remover seu próprio perfil de administrador.');
  }

  const current = await auth.getUser(uid);
  const email = normalizeEmail(current.email);
  if (LEGACY_ADMIN_EMAILS.has(email) && (disabled || perfil !== 'administrador')) {
    throw new functions.https.HttpsError('failed-precondition', 'A conta administrativa principal deve permanecer ativa e administradora.');
  }
  const updated = await auth.updateUser(uid, { displayName: nome, disabled });

  await db.collection('usuarios').doc(uid).set({
    nome,
    email,
    perfil,
    ativo: !disabled,
    auth_uid: uid,
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_by_uid: context.auth.uid,
    updated_by_email: normalizeEmail(context.auth.token.email)
  }, { merge: true });

  return { uid: updated.uid, email, nome, perfil, disabled: updated.disabled };
});

exports.adminDeleteUser = functions.https.onCall(async (data, context) => {
  await assertAdmin(context);
  const uid = String((data && data.uid) || '').trim();
  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'UID do usuário não informado.');
  if (uid === context.auth.uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Você não pode excluir a própria conta.');
  }

  const user = await auth.getUser(uid);
  const email = normalizeEmail(user.email);
  if (LEGACY_ADMIN_EMAILS.has(email)) {
    throw new functions.https.HttpsError('failed-precondition', 'A conta administrativa principal não pode ser excluída pelo painel.');
  }

  await auth.deleteUser(uid);

  const batch = db.batch();
  const uidRef = db.collection('usuarios').doc(uid);
  batch.delete(uidRef);

  if (email) {
    const emailRef = db.collection('usuarios').doc(email);
    batch.delete(emailRef);
    const oldProfiles = await db.collection('usuarios').where('email', '==', email).get();
    oldProfiles.forEach(doc => batch.delete(doc.ref));
  }
  await batch.commit();

  return { deleted: true, uid, email };
});
