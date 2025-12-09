
const roubos = {
    // LOS SANTOS
    banco_ls: { nome: "Banco de Los Santos", tempoRoubo: 10 * 60, status: "livre" },
    loterica_ls: { nome: "Lotérica de Los Santos", tempoRoubo: 8 * 60, status: "livre" },
    armas_ls1: { nome: "Loja de Armas 1", tempoRoubo: 6 * 60, status: "livre" },
    armas_ls2: { nome: "Loja de Armas 2", tempoRoubo: 6 * 60, status: "livre" },
    puteiro: { nome: "Puteiro", tempoRoubo: 7 * 60, status: "livre" },
    motel: { nome: "Motel", tempoRoubo: 7 * 60, status: "livre" },

    // LAS VENTURAS
    cassino_lv: { nome: "Cassino", tempoRoubo: 15 * 60, status: "livre" },

    // SAN FIERRO
    banco_sf: { nome: "Banco Central", tempoRoubo: 10 * 60, status: "livre" },
    armas_sf: { nome: "Loja de Armas 3", tempoRoubo: 6 * 60, status: "livre" },
    loterica_sf: { nome: "Lotérica de San Fierro", tempoRoubo: 8 * 60, status: "livre" },
    navio: { nome: "Navio", tempoRoubo: 12 * 60, status: "livre" },
    bar_sf: { nome: "Bar San Fierro", tempoRoubo: 5 * 60, status: "livre" },

    // OUTROS
    cofre_bps: { nome: "Cofre BPS", tempoRoubo: 20 * 60, status: "livre" },
    ilha_pirata: { nome: "Ilha Pirata", tempoRoubo: 30 * 60, status: "livre" }
};

module.exports = {
    name: "roubo",
    execute(msg) {
        if (!msg.content.startsWith("!")) return;

        const args = msg.content.slice(1).split(" ");
        const local = args[0];
        const action = args[1];

        if (action !== "iniciou") return;

        if (!roubos[local]) {
            return msg.reply("⚠ Local não encontrado!");
        }

        const r = roubos[local];

        if (r.status === "roubando") return msg.reply("⛔ Esse local já está sendo roubado!");
        if (r.status === "cooldown") return msg.reply("⛔ Esse local está em cooldown!");

        // INICIA ROUBO
        r.status = "roubando";
        r.tempoFim = Date.now() + r.tempoRoubo * 1000;

        msg.reply(`🔸 **${r.nome}**: Roubo iniciado!  
⏳ Tempo: **${r.tempoRoubo / 60} min**`);

        setTimeout(() => {
            r.status = "cooldown";

            msg.channel.send(`⛔ **${r.nome}** terminou o roubo e entrou em cooldown!`);

            // COOLDOWN AUTOMÁTICO (metade do tempo do roubo)
            setTimeout(() => {
                r.status = "livre";
                msg.channel.send(`🟢 **${r.nome}** está disponível novamente!`);
            }, (r.tempoRoubo / 2) * 1000);

        }, r.tempoRoubo * 1000);
    }
};
