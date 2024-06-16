import PDFDocument from 'pdfkit';
import {
    Writable
} from 'stream';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    // Usage example
    let query = `input text\nEx. *.${command}* fuadxy`
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw query
    
    await m.reply(wait)
    try {
        let pdf = await textToPDFBuffer(text)
            .then(buffer => {
                // Use the resulting buffer as needed
                return (buffer);
            })
        await conn.sendMessage(m.chat, {
            document: pdf,
            mimetype: "application/pdf",
            fileName: `For ${m.name}.pdf`
        }, {
            quoted: m
        })
        } catch (e) {
        await m.reply(eror)
        }
}
handler.help = ['topdf']
handler.tags = ['tools']
handler.command = /^(topdf)$/i
export default handler

async function textToPDFBuffer(text) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const streamBuffer = new Writable({
            write(chunk, encoding, next) {
                buffers.push(chunk);
                next();
            },
        });

        const doc = new PDFDocument();

        doc.pipe(streamBuffer);
        doc.text(text);
        doc.end();

        streamBuffer.on('finish', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        streamBuffer.on('error', reject);
    });
}