# ✦ Bot de Regras + Cooldown para Discord

Este bot foi feito para o sistema que você descreveu:

- Cada canal de venda possui um painel de regras.
- Quando alguém manda uma mensagem no canal, o bot apaga o painel anterior dele e publica o painel novamente.
- O bot não responde "venda registrada".
- A mensagem da pessoa inicia o cooldown configurado.
- O cooldown varia por cargo: membro, VIP ou booster.
- Quando o cooldown termina, o bot manda um aviso em um canal específico e menciona a pessoa.
- Os cooldowns ficam salvos em `data/data.json`, então reiniciar o bot não apaga os horários.

## 1. Instalar

Você precisa ter Node.js instalado.

Abra a pasta do projeto e rode:

```bash
npm install
```

## 2. Criar o .env

Copie `.env.example` para `.env` e coloque:

```env
DISCORD_TOKEN=SEU_TOKEN
GUILD_ID=ID_DO_SERVIDOR
```

## 3. Configurar os IDs

Abra:

`src/config.js`

No começo do arquivo estão TODOS os textos e configurações editáveis.

Você só precisa colocar os IDs dos canais/cargos onde aparece `COLE_AQUI`.

### Como pegar IDs no Discord

Ative o Modo Desenvolvedor em:

Configurações > Avançado > Modo Desenvolvedor

Depois toque/clique com o botão direito no canal/cargo e escolha "Copiar ID".

## 4. Permissões do bot

O bot precisa, no mínimo, conseguir:

- Ver canais
- Enviar mensagens
- Gerenciar mensagens
- Incorporar links

Também é necessário ativar no Developer Portal a intent:

**Message Content Intent**

E, para a leitura dos cargos, **Server Members Intent**.

## 5. Rodar

```bash
npm start
```

## IMPORTANTE SOBRE O COOLDOWN

Por padrão, este projeto considera que QUALQUER mensagem enviada em um canal de venda inicia o cooldown daquela categoria.

Isso foi feito porque você descreveu o fluxo como:

pessoa manda a divulgação/mensagem -> cooldown começa.

Se depois você quiser que o bot reconheça somente uma mensagem de venda específica (por exemplo, só mensagens com determinado formato), essa parte pode ser alterada.

## Personalização

O lugar principal para editar é:

`src/config.js`

Lá você pode mudar:

- título
- descrição
- emojis
- cores
- rodapé
- cooldown de membro
- cooldown VIP
- cooldown booster
- mensagem de aviso
- canais
- cargos
- categorias
