# Revisão técnica — 20/10/2026

## Alterações
- Removidos `BKP.html` e `BKP2.html` (páginas de backup antigas, sem referência na aplicação).
- Regras de leitura agora exigem perfil cadastrado ou usuário legado autorizado, em vez de qualquer sessão autenticada.
- Regras de edição e administração passam a respeitar `ativo: false` e dão preferência ao perfil por UID; perfis antigos por e-mail seguem compatíveis.
- Interface deixa de atribuir perfil `editor` automaticamente a novas contas sem perfil e impede ações de edição quando `ativo: false`.
- Funções administrativas verificam se o usuário administrador foi bloqueado no Authentication ou no perfil.
- Proteção extra contra bloqueio/despromoção da conta administrativa principal.
- Em caso de erro ao salvar perfil de uma conta recém-criada, a conta Authentication recém-criada é removida para evitar conta órfã.

## Testes executados
- `node --check app.js`: passou.
- `node --check functions/index.js`: passou.
- Conferência estática de IDs usados por `$()`: nenhuma referência sem elemento no HTML.
- Inspeção da estrutura de arquivos e referências: passou.

## Limites importantes
Não foram feitos testes ponta a ponta (login, consulta real ao Firestore, criação/exclusão de usuários, atualização de casos), porque precisam de acesso a um ambiente Firebase configurado com contas de teste e autorização de publicação. Portanto, **não há garantia de que todas as funções estejam operacionais em produção**.

## Publicação
1. Faça backup das regras e configurações atualmente em produção.
2. Revise `firestore.rules` e sua compatibilidade com outros aplicativos que usem o mesmo banco.
3. Implante Functions e regras com Firebase CLI conforme `README_ATUALIZACAO.md`.
4. Atualize `index.html`, `style.css`, `app.js` no hosting atual.
5. Teste com contas administrador, editor, leitor, bloqueada e sem cadastro. Não envie dados reais para contas de teste.

**Atenção:** As regras exigem um perfil em `usuarios` ou e-mail legado autorizado. Outras contas previamente autenticadas sem perfil deixarão de ler dados — isso é intencional.
