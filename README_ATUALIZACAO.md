# Painel de Pendências — versão com Administração de Usuários

Esta versão mantém compatibilidade com a coleção `pendencias` existente e acrescenta gestão administrativa real de contas do Firebase Authentication.

## Arquivos principais do site

- `index.html`
- `style.css`
- `app.js`

## Administração de usuários

Na tela **Administração > Usuários**, um administrador pode:

- criar uma conta nova;
- definir nome e perfil (`administrador`, `editor` ou `leitor`);
- enviar e-mail para definição/redefinição de senha;
- bloquear e reativar uma conta;
- editar nome e perfil;
- excluir definitivamente a conta de login e o perfil;
- visualizar se a conta está ativa ou bloqueada;
- visualizar o último acesso informado pelo Firebase Authentication.

Por segurança, o navegador não recebe credenciais administrativas do Firebase. As ações de criar, alterar, listar e excluir contas são executadas em Cloud Functions com Firebase Admin SDK.

O administrador logado não pode bloquear, excluir ou remover o próprio perfil de administrador pelo painel. A conta administrativa principal `cavictor.franco@gmail.com` também não pode ser excluída pelo painel.

## Arquivos novos para o backend

- `functions/index.js` — funções administrativas seguras;
- `functions/package.json` — dependências das Functions;
- `firebase.json` — configuração do projeto para Functions e regras;
- `firestore.rules` — regras atualizadas para perfis salvos por UID e compatibilidade com perfis antigos por e-mail.

## Primeira implantação

No computador em que você publica o projeto Firebase, abra o terminal na pasta que contém `firebase.json`.

1. Instale/atualize a CLI do Firebase:

   `npm install -g firebase-tools`

2. Entre na conta do Firebase, se necessário:

   `firebase login`

3. Confirme que está no projeto correto:

   `firebase use painel-pendencias`

   Se o projeto ainda não estiver associado à pasta, use:

   `firebase use --add`

4. Instale as dependências das Functions:

   `cd functions`

   `npm install`

   depois:

   `cd ..`

5. Publique as Cloud Functions:

   `firebase deploy --only functions`

6. Depois de comparar as regras deste pacote com as regras atualmente em produção, publique as regras:

   `firebase deploy --only firestore:rules`

7. Publique/substitua os arquivos do site (`index.html`, `style.css`, `app.js`) no mesmo local onde o painel atual está hospedado.

## Observação sobre cobrança

Cloud Functions pode exigir que o projeto Firebase esteja em um plano que permita o uso do serviço e pode haver cobrança conforme o consumo/configuração do projeto. Verifique a situação do projeto antes do deploy.

## Como criar um usuário

1. Entre com uma conta administradora.
2. Abra **Administração**.
3. Clique em **+ Novo usuário**.
4. Informe nome, e-mail e perfil.
5. Salve.
6. Na linha do usuário criado, clique em **Enviar senha**.
7. O Firebase enviará o e-mail de redefinição/definição de senha conforme o template configurado no Authentication.

É necessário que o provedor **E-mail/senha** esteja habilitado no Firebase Authentication.

## Compatibilidade

Os perfis antigos da coleção `usuarios` continuam sendo reconhecidos. As novas contas usam preferencialmente o UID do Firebase Authentication como ID do documento do perfil. As regras também continuam aceitando documentos antigos identificados pelo e-mail.

As pendências, partes, herdeiros, comentários, links do Drive e andamentos existentes não precisam ser migrados para usar a administração de usuários.
