# Atualização da interface — 20/10/2026

## Alterações
- Navegação lateral: Início, Casos ativos, Prazos e Arquivados.
- Busca sempre visível; filtros avançados recolhíveis e botão Limpar filtros.
- Resumo com lista de pendências prioritárias (vencidas ou com até 7 dias para vencer), além das estatísticas e listas existentes.
- Detalhes do caso separados em Resumo, Partes, Andamentos e Histórico.
- Cadastro de partes mostra campos de falecimento, LP e contato apenas quando pertinentes.
- Ajustes de espaçamento, foco de teclado e layout em telas menores.

## Compatibilidade e limitações
- Firebase, coleções, IDs dos campos e lógica de persistência mantidos.
- As mudanças de abas são apenas visuais: não migram ou apagam registros.
- Execute o teste completo de login, perfis, edição, prazo, herdeiros e gravações contra o ambiente Firebase antes de publicar. A validação estática não substitui esse teste.
- Faça backup da versão publicada e das regras do Firestore antes da implantação.
