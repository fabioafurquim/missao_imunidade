# Missão Imunidade

Jogo educativo, em português do Brasil, sobre investigação e controle de surtos infecciosos. A campanha atual propõe decisões de raciocínio clínico, microbiologia, epidemiologia e saúde pública — não substitui protocolos ou orientação médica individual.

## O que já funciona

- Tela inicial com nome, semestre e eixo de estudo do aluno; os dados ficam apenas no navegador;
- Tutorial automático no primeiro acesso e botão **Como jogar** para abri-lo novamente;
- Mapa de dossiês com agentes ocultos, desbloqueio progressivo e modo de teste para explorar todas as fases;
- Mapa-múndi interativo: hover, foco por teclado ou toque em um dossiê atualiza o marcador e a localização exibida;
- Painel de situação, globo 3D, número de casos, limite de tempo e ações por dia;
- Equipe de quatro médicos (emergência, infectologia, epidemiologia médica e patologia clínica), cada um com duas ações graduais de investigação;
- Dossiê inicial, oito evidências por caso, diferenciais coerentes, justificativa obrigatória da hipótese e consequência para defesas insuficientes;
- Medidas de resposta específicas, debriefing, pontuação, aprendizados e links para fontes oficiais.

| Dossiê | Cenário | Foco didático |
| --- | --- | --- |
| 01 · Porto de Mahan | Síndrome diarreica aguda em agrupamento | Água segura, atendimento e vigilância |
| 02 · Distrito Alvorada | Síndrome febril aguda urbana | Vetores, criadouros e triagem |
| 03 · Campus Norte | Exantema febril em rede de contatos | Vacinação, contatos e comunicação |
| 04 · Pavilhão 7 | Síndrome respiratória subaguda | Testagem, ventilação e contatos |
| 05 · UTI Aurora | Culturas incomuns em unidade crítica | Triagem, precauções e desinfecção |

O conteúdo é uma síntese educacional baseada em fichas da [OMS sobre cólera](https://www.who.int/en/news-room/fact-sheets/detail/cholera), [dengue](https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue), [sarampo](https://www.who.int/news-room/fact-sheets/detail/measles) e [tuberculose](https://www.who.int/news-room/fact-sheets/detail/tuberculosis), e no material do [CDC sobre *Candida auris*](https://www.cdc.gov/candida-auris/about/index.html). Cada debriefing aponta novamente para sua fonte.

## Rodar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`). Para gerar a versão de produção:

```bash
npm run build
```

## Onde editar as missões

As fases e o conteúdo revisável estão concentrados em `src/data/missions.ts`. Cada caso define briefing, coordenadas do marcador no mapa, dados iniciais, duas evidências por médico, diferenciais, pergunta de justificativa, intervenções, critérios mínimos de vitória, aprendizados e fonte oficial. O diagnóstico verdadeiro não deve aparecer em títulos, cards de campanha, briefings ou enunciados da justificativa; a interface só o revela após uma defesa correta ou no debriefing.

A interface e a lógica da campanha ficam em `src/main.tsx`. O perfil inicial usa `localStorage` somente para manter nome, semestre e foco de estudo no navegador do aluno; não há backend nem coleta de dados.

A interface é mobile-first: no celular, toque em um card para pré-visualizar a localização no mapa e use os botões com área de toque ampliada. Modais viram painéis com rolagem segura no rodapé da tela.

O progresso desta versão é mantido apenas na memória do navegador e reinicia ao recarregar a página. Não há login nem PostgreSQL ainda.

## Publicar no Coolify

O projeto possui um `Dockerfile` multiestágio. No Coolify:

1. Crie uma nova aplicação a partir do repositório Git.
2. Selecione **Dockerfile** como método de build.
3. Use a porta exposta `80`.
4. Vincule o domínio e faça o deploy.

Não há variáveis de ambiente nesta fase e não é necessário conectar o PostgreSQL ainda.

### Domínio personalizado no Coolify

O domínio de produção é `https://missaoimunidade.furquim.cloud`. Se, depois de um deploy, o Coolify substituir esse domínio pelo endereço automático `sslip.io`, conecte-se à VPS como root e execute:

```bash
/root/fix-domain-missaoimunidade.sh
```

O script atualiza o `docker-compose.yaml` gerado pelo Coolify, recria somente o container desta aplicação e garante as rotas HTTPS. A cópia versionada em `scripts/fix-coolify-domain.sh` serve como referência e recuperação do script operacional.

## Decisão técnica

Foi escolhido **React + Vite + TypeScript**, servido por Nginx em produção. É uma estrutura pequena, amplamente conhecida e fácil de continuar pelos estudantes. Quando houver necessidade de progresso entre sessões, a evolução natural é uma API TypeScript e PostgreSQL, sem precisar reescrever a interface.

## Próxima etapa sugerida

1. Persistir usuários, partidas, decisões e progresso com uma API TypeScript e PostgreSQL;
2. Criar eventos variáveis por missão e feedback mais detalhado para decisões não essenciais;
3. Incluir revisão docente do conteúdo médico e fontes por versão;
4. Adicionar autenticação, placar e retomada de partidas.
