# Atualização de perfis no plano Spark

## Atenção: ordem de implantação

**NÃO publique `firestore.rules` antes de cadastrar os perfis UID dos usuários ativos.** As regras novas deixam de autorizar automaticamente a lista antiga de e-mails. Se não fizer a migração, essas pessoas perderão acesso aos processos. O administrador inicial (`cavictor.franco@gmail.com`) permanece autorizado como exceção de transição enquanto não houver perfil correspondente.

1. No Firebase Console > Authentication > Usuários, anote o **UID exato** e e-mail de cada conta que deve continuar ativa.
2. No Firebase Console > Firestore Database > Dados > coleção `usuarios`, crie um documento **com ID igual ao UID do Authentication** para cada conta. Campos: `nome` (string), `email` (string, minúsculas), `perfil` (string: `administrador`, `editor` ou `leitor`), `ativo` (boolean: `true`). Confira atentamente cada UID. Não crie um segundo perfil para o mesmo usuário sem revisar os registros antigos por e-mail.
3. Faça backup das regras atuais do Firestore (copie o texto para arquivo local).
4. No GitHub, substitua `index.html` e `app.js` pelos arquivos deste ZIP. Faça commit e espere publicar.
5. Entre no painel com sua conta administrativa. Confira em Administração > Usuários os documentos de perfil; a lista **não consulta Authentication**. Para vincular outro usuário use o UID copiado da tela Authentication.
6. Depois de confirmar os documentos de perfil de todas as pessoas, no Firebase Console > Firestore Database > Regras, cole o conteúdo de `firestore.rules` e publique. Teste login com uma conta Editor e outra Leitor. Se algo falhar, restaure as regras salvas.

## O que funciona

- Editar nome, e-mail informativo, papel e `ativo` de um perfil do Firestore com controle administrativo pelas regras.
- Remover perfil do Firestore sem excluir conta do Authentication (use apenas se a conta foi excluída no Authentication ou realmente se deseja revogar o acesso).
- Criar ou excluir login somente em Authentication > Usuários.

## Limitações importantes

- No plano Spark, a página não pode listar todas as contas Authentication nem confirmar se o UID informado realmente existe. Perfis antigos do Firestore podem continuar aparecendo até serem removidos manualmente.
- Ao criar perfil por UID, confira que o e-mail informado é o mesmo da conta Authentication. O sistema não valida a correspondência automaticamente.
- Não edite seu próprio papel no painel. Antes de modificar outros administradores, garanta que o administrador inicial continua acessível.
- As regras antigas autorizavam e-mails históricos; a nova versão remove a autorização automática para não manter contas indevidamente autorizadas.
- `firestore.rules` é aplicado no **Firebase Console**, não no GitHub; não publique `firebase deploy --only functions`. Não é necessário migrar para Blaze.
- As alterações foram validadas estaticamente, não testadas contra o banco do projeto em produção.
