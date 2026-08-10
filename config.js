// ================================================================
// ✦✦✦ PERSONALIZE AQUI ✦✦✦
// Tudo que você normalmente vai querer mudar está nesta parte.
// Não precisa mexer no restante do código.
// ================================================================

module.exports = {
  // ==============================================================
  // CANAIS
  // ==============================================================
  canais: {
    // Canal onde o bot manda os avisos de cooldown finalizado.
    canalAvisosCooldown: "INSIRA ID DO CANAL DE AVISOS AQ",

    // Canais de venda.
    // Você pode colocar quantos quiser.
    vendas: {
      artes: {
        canalId: "INSIRA ID DO CANAL DE ARTES AQ",

        // Cooldown em dias.
        cooldown: {
          membro: 7,
          vip: 5,
          booster: 3
        },

        // Cargo VIP. Se não usar, deixe como "".
        cargoVip: "INSIRA ID DO CARGO VIP AQ",

        // Cargo de booster. Se não usar, deixe como "".
        cargoBooster: "INSIRA ID DO CARGO BOOSTER AQ",

        // ==========================================================
        // ✦ MENSAGEM DE REGRAS DESTE CANAL — EDITE AQUI ✦
        // ==========================================================
        painel: {
          titulo: "🎨・REGRAS — ARTES",
          descricao:
            "Este canal é exclusivamente para **venda de artes**.\n\n" +
            "⏳ **Cooldown**\n" +
            "• Membros: **7 dias**\n" +
            "• VIP: **5 dias**\n" +
            "• Boosters: **3 dias**\n\n" +
            "📌 Respeite as regras do servidor e aguarde seu cooldown antes de divulgar novamente.",
          cor: 0xD8A7FF,
          rodape: "Leia as regras antes de divulgar ♡"
        }
      }

      // Para criar outro canal, copie o bloco "artes" acima e
      // troque o nome, ID, cooldown e textos.
    }
  },

  // ==============================================================
  // ✦ MENSAGEM DO AVISO DE COOLDOWN — EDITE AQUI ✦
  // ==============================================================
  avisoCooldown: {
    titulo: "🔔・COOLDOWN FINALIZADO",
    descricao:
      "{usuario}, seu cooldown para **{categoria}** terminou!\n\n" +
      "Você já pode divulgar novamente. ♡\n" +
      "Canal: {canal}",
    cor: 0xBFA2FF,
    rodape: "Obrigada por esperar ♡"
  },

  // ==============================================================
  // COMPORTAMENTO
  // ==============================================================
  comportamento: {
    // Quando alguém mandar uma mensagem em canal de venda,
    // o bot apaga APENAS o painel anterior dele e manda o painel de novo.
    repostarPainelDepoisDeMensagem: true,

    // Se true, a mensagem da pessoa inicia o cooldown.
    // Isso segue exatamente a lógica que você descreveu:
    // "a pessoa manda uma mensagem -> começa o cooldown".
    iniciarCooldownAoMandarMensagem: true,

    // Ignora mensagens de outros bots.
    ignorarBots: true
  }
};
