const handler = async (m, { conn, args }) => {
    try {
        const [index, paramName, paramValue] = args;
        const keys = Object.keys(global.plugins);
        if (!index || !paramName || !paramValue) {
            const usage = "Contoh penggunaan: handler 1 owner true\n\nDaftar plugin yang tersedia:\n" + 
                          keys.map((key, index) => `${index + 1}. ${key}`).join('\n');
            await conn.reply(m.chat, usage, m);
            return;
        }
        const key = keys[parseInt(index) - 1];
        if (!key) {
            await conn.reply(m.chat, `Index tidak valid`, m);
            return;
        }
        const plugin = global.plugins[key];
        if (!plugin) {
            await conn.reply(m.chat, `Plugin tidak ditemukan`, m);
            return;
        }
        if (plugin[paramName] !== undefined) {
            await conn.reply(m.chat, `Mengganti nilai ${paramName} yang sudah ada di ${key}`, m);
        }
        let parsedValue;
        if (/^(true|false|null|undefined)$/i.test(paramValue)) {
            parsedValue = eval(paramValue);
        } else {
            try {
                parsedValue = JSON.parse(paramValue);
            } catch (error) {
                parsedValue = paramValue;
            }
        }
        plugin[paramName] = parsedValue;
        global.plugins[key] = plugin;
        await conn.reply(m.chat, `Menambahkan ${paramName}: ${parsedValue} ke ${key}`, m);
    } catch (error) {
        console.error(error.message);
        await conn.reply(m.chat, 'Terjadi kesalahan saat menambahkan parameter', m);
    }
};

handler.help = ["handler"];
handler.tags = ["developer"];
handler.command = /^(handler)$/i;
handler.rowner = true;
handler.private = false;

export default handler;