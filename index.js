require("dotenv").config();

const fs = require("fs");
const path = require("path");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// ================================================================
// BANCO DE DADOS SIMPLES
// Fica salvo em data.json para sobreviver a reinícios do bot.
// ================================================================

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "data.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function loadData() {
  try {
    if (!fs.existsSync(dataFile)) return { cooldowns: {}, panels: {} };
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return { cooldowns: {}, panels: {} };
  }
}

let db = loadData();

function saveData() {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

function getCategoryByChannel(channelId) {
  for (const [categoria, dados] of Object.entries(config.canais.vendas)) {
    if (dados.canalId === channelId) return { categoria, dados };
  }
  return null;
}

function getCooldownDays(member, dados) {
  if (dados.cargoVip && member.roles.cache.has(dados.cargoVip)) {
    return dados.cooldown.vip;
  }

  if (dados.cargoBooster && member.roles.cache.has(dados.cargoBooster)) {
    return dados.cooldown.booster;
  }

  return dados.cooldown.membro;
}

function formatarTexto(texto, vars = {}) {
  return texto.replace(/\{(\w+)\}/g, (_, chave) => {
    return vars[chave] ?? `{${chave}}`;
  });
}

function criarPainel(categoria, dados) {
  const painel = dados.painel;

  return new EmbedBuilder()
    .setTitle(painel.titulo)
    .setDescription(painel.descricao)
    .setColor(painel.cor)
    .setFooter({ text: painel.rodape })
    .setTimestamp();
}

async function enviarPainel(channel, categoria, dados) {
  if (!config.comportamento.repostarPainelDepoisDeMensagem) return;

  // Apaga o painel anterior que o bot criou neste canal.
  const painelAnteriorId = db.panels[channel.id];

  if (painelAnteriorId) {
    try {
      const anterior = await channel.messages.fetch(painelAnteriorId);
      if (anterior.author.id === client.user.id) {
        await anterior.delete().catch(() => {});
      }
    } catch {}
  }

  const novaMensagem = await channel.send({
    embeds: [criarPainel(categoria, dados)]
  });

  db.panels[channel.id] = novaMensagem.id;
  saveData();
}

async function iniciarCooldown(message, categoria, dados) {
  if (!config.comportamento.iniciarCooldownAoMandarMensagem) return;

  const member = message.member;
  if (!member) return;

  const dias = getCooldownDays(member, dados);
  const agora = Date.now();
  const terminaEm = agora + dias * 24 * 60 * 60 * 1000;

  const chave = `${message.guild.id}:${message.author.id}:${categoria}`;

  db.cooldowns[chave] = {
    guildId: message.guild.id,
    userId: message.author.id,
    categoria,
    channelId: message.channel.id,
    iniciadoEm: agora,
    terminaEm,
    avisado: false
  };

  saveData();
}

async function verificarCooldowns() {
  const agora = Date.now();
  let alterou = false;

  for (const [chave, item] of Object.entries(db.cooldowns)) {
    if (item.avisado) continue;
    if (agora < item.terminaEm) continue;

    try {
      const guild = await client.guilds.fetch(item.guildId).catch(() => null);
      if (!guild) continue;

      const membro = await guild.members.fetch(item.userId).catch(() => null);
      if (!membro) {
        item.avisado = true;
        alterou = true;
        continue;
      }

      const canalAvisos = await guild.channels.fetch(
        config.canais.canalAvisosCooldown
      ).catch(() => null);

      if (!canalAvisos || !canalAvisos.isTextBased()) continue;

      const dadosCategoria = config.canais.vendas[item.categoria];
      const nomeCategoria = item.categoria;

      const descricao = formatarTexto(
        config.avisoCooldown.descricao,
        {
          usuario: `<@${item.userId}>`,
          categoria: nomeCategoria,
          canal: dadosCategoria
            ? `<#${dadosCategoria.canalId}>`
            : "canal de vendas"
        }
      );

      const embed = new EmbedBuilder()
        .setTitle(config.avisoCooldown.titulo)
        .setDescription(descricao)
        .setColor(config.avisoCooldown.cor)
        .setFooter({ text: config.avisoCooldown.rodape })
        .setTimestamp();

      await canalAvisos.send({
        content: `<@${item.userId}>`,
        embeds: [embed],
        allowedMentions: { users: [item.userId] }
      });

      item.avisado = true;
      alterou = true;
    } catch (erro) {
      console.error("Erro ao avisar cooldown:", erro);
    }
  }

  if (alterou) saveData();
}

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} está online!`);
  console.log("📌 Sistema de painéis e cooldowns iniciado.");

  await verificarCooldowns();

  // Verifica a cada minuto para que o aviso não dependa
  // de alguém mandar uma mensagem no servidor.
  setInterval(verificarCooldowns, 60 * 1000);
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (config.comportamento.ignorarBots && message.author.bot) return;

  const venda = getCategoryByChannel(message.channel.id);
  if (!venda) return;

  const { categoria, dados } = venda;

  try {
    // A mensagem da pessoa NÃO recebe resposta de "venda registrada".
    // O bot apenas registra o cooldown internamente.
    await iniciarCooldown(message, categoria, dados);

    // E depois republica o painel de regras.
    await enviarPainel(message.channel, categoria, dados);
  } catch (erro) {
    console.error("Erro ao processar mensagem:", erro);
  }
});

client.on("error", console.error);

if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN não foi configurado no arquivo .env");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
