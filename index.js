const { Client, GatewayIntentBits } = require("discord.js");

// Token vem do Secret do GitHub
const token = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// LISTA DE LOCAIS PARA ROUBO - CHAVES COM ESPAÇO
const roubos = {
    // LOS SANTOS
    "banco ls": { nome: "Banco de Los Santos", tempoRoubo: 10 * 60, status: "livre" },
    "loterica ls": { nome: "Lotérica de Los Santos", tempoRoubo: 8 * 60, status: "livre" },
    "armas ls1": { nome: "Loja de Armas 1", tempoRoubo: 6 * 60, status: "livre" },
    "armas ls2": { nome: "Loja de Armas 2", tempoRoubo: 6 * 60, status: "livre" },
    "puteiro": { nome: "Puteiro", tempoRoubo: 7 * 60, status: "livre" }, // Sem espaço
    "motel": { nome: "Motel", tempoRoubo: 7 * 60, status: "livre" },   // Sem espaço

    // LAS VENTURAS
    "cassino lv": { nome: "Cassino", tempoRoubo: 15 * 60, status: "livre" },

    // SAN FIERRO
    "banco sf": { nome: "Banco Central", tempoRoubo: 10 * 60, status: "livre" },
    "armas sf": { nome: "Loja de Armas 3", tempoRoubo: 6 * 60, status: "livre" },
    "loterica sf": { nome: "Lotérica de San Fierro", tempoRoubo: 8 * 60, status: "livre" },
    "navio": { nome: "Navio", tempoRoubo: 12 * 60, status: "livre" }, // Sem espaço
    "bar sf": { nome: "Bar San Fierro", tempoRoubo: 5 * 60, status: "livre" },

    // OUTROS
    "cofre bps": { nome: "Cofre BPS", tempoRoubo: 20 * 60, status: "livre" },
    "ilha pirata": { nome: "Ilha Pirata", tempoRoubo: 30 * 60, status: "livre" }
};

client.on("ready", () => {
    console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
    // Novo prefixo '/'
    if (!msg.content.startsWith("/")) return;

    // Converte a mensagem para minúsculas
    const content = msg.content.slice(1).toLowerCase();
    const actionKeyword = "iniciou";

    // 1. Verifica se a mensagem termina com a palavra-chave de ação
    if (!content.endsWith(` ${actionKeyword}`)) return;

    // 2. Extrai o nome do local (a chave que pode ter espaços)
    const local = content.substring(0, content.length - actionKeyword.length).trim();
    
    // 3. MUDANÇA CRÍTICA: Acesso ao objeto roubos usando a variável [local]
    if (!roubos[local]) { // Usa colchetes [] para acessar a chave com espaço
        return msg.reply("⚠ Local não encontrado! Tente, por exemplo, /banco ls iniciou");
    }

    const r = roubos[local];

    if (r.status === "roubando") return msg.reply("⛔ Esse local já está sendo roubado!");
    if (r.status === "cooldown") return msg.reply("⛔ Esse local está em cooldown!");

    // INICIA O ROUBO
    r.status = "roubando";
    r.tempoFim = Date.now() + r.tempoRoubo * 1000;
    msg.reply(`🔸 **${r.nome}**: Roubo iniciado!\n⏳ Tempo: **${r.tempoRoubo / 60} min**`);

    setTimeout(() => {
        r.status = "cooldown";
        const cooldownMin = (r.tempoRoubo / 2) / 60;
        
        msg.channel.send(`⛔ **${r.nome}** finalizou o roubo e entrou em cooldown!
        😴 Duração do Cooldown: **${cooldownMin} min**.`);

        // cooldown = metade do tempo do roubo
        setTimeout(() => {
            r.status = "livre";
            msg.channel.send(`🟢 **${r.nome}** está disponível novamente!`);
        }, (r.tempoRoubo / 2) * 1000);

    }, r.tempoRoubo * 1000);
});

client.login(token);
