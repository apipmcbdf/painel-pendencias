# Atualização da gestão de usuários

## Arquivos alterados
- `app.js` e `index.html`: listagem administrativa baseada no Authentication e edição segura.
- `functions/index.js`: listagem completa de usuários, perfis com padrão Leitor e limpeza de perfis antigos quando uma conta é excluída no Firebase Console.

## Publicação: duas etapas indispensáveis
1. GitHub: substitua `app.js` e `index.html` na raiz do repositório, faça commit e aguarde a publicação.
2. Firebase: substitua `functions/index.js` no projeto local (na pasta `functions` já existente). Na raiz do projeto, com Node.js 20 e Firebase CLI instalados, execute:
   ```
   firebase login
   firebase use painel-pendencias
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```
   Pode ser necessário ativar faturamento Blaze para utilizar Cloud Functions. Confirme o projeto selecionado antes do deploy. Nunca publique credenciais privadas no GitHub.

**Importante:** atualizar apenas o GitHub não publica Cloud Functions. Não altere regras do Firestore para contornar erros de implantação.

## Teste após implantar
1. Faça login com um administrador e vá em Administração > Usuários.
2. Confira se uma conta removida do Authentication não aparece mais. Contas criadas no Authentication devem aparecer como Leitor, sem perfil configurado, até que sejam atribuídas permissões.
3. Promova uma conta de teste de Leitor para Editor e confirme com login dessa conta. Rebaixe-a novamente.
4. Teste criar, bloquear, desbloquear e excluir uma conta de teste.
5. Confira que os processos e relatórios continuam acessíveis com suas permissões corretas.

## Limites e cuidados
- A listagem de usuários depende das Cloud Functions estarem implantadas e autorizadas. Sem elas o painel mostra uma mensagem, em vez de apresentar perfis do Firestore como contas ativas.
- A limpeza após exclusão pelo console depende da implantação do gatilho `cleanupDeletedAuthUser`. Perfis órfãos que já existiam antes desse deploy não são apagados automaticamente; ficam fora da lista e podem ser auditados antes de remoção.
- A atualização não altera as contas atuais automaticamente e não concede perfil Editor a novos usuários.
- Não foram executados testes reais no Firebase de produção.
