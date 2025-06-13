const cron = require("node-cron");
const { getAssignments } = require("./moodleScraper");
const { sendMessage } = require("./bot");
require("dotenv").config();

function parseDeadline(dateStr) {
    const clean = dateStr.replace(/(\w+),/, "").trim();
    const date = new Date(clean);
    return isNaN(date) ? null : date;
}

function getDaysRemaining(deadlineDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    return Math.floor((deadlineDate - now) / (1000 * 60 * 60 * 24));
}

function runSchedule() {
    cron.schedule("* * * * *", async () => {
        console.log("🔄 Mengecek tugas Moodle...");
        const tugas = await getAssignments(process.env.MOODLE_USERNAME, process.env.MOODLE_PASSWORD);

        if (tugas.length === 0) {
            await sendMessage("✅ Tidak ada tugas yang ditemukan.");
            return;
        }

        // Kirim daftar tugas lengkap
        let allTasksMsg = "📚 Daftar Tugas Ditemukan:\n";
        for (const t of tugas) {
            allTasksMsg += `\n📝 *${t.title}*\n📅 Deadline: ${t.deadline}\n`;
        }
        await sendMessage(allTasksMsg);

        // Kirim reminder H-7, H-3, dan deadline hari ini
        for (const t of tugas) {
            const deadlineDate = parseDeadline(t.deadline);
            if (!deadlineDate) continue;

            const daysLeft = getDaysRemaining(deadlineDate);

            if (daysLeft === 7) {
                await sendMessage(`📢 H-7 Reminder!\nTugas: *${t.title}*\n🗓️ Deadline: ${t.deadline}`);
            } else if (daysLeft === 3) {
                await sendMessage(`⚠️ H-3 Reminder!\nTugas: *${t.title}*\n📍 Segera diselesaikan!`);
            } else if (daysLeft === 0) {
                await sendMessage(`🚨 Deadline Hari Ini!\nTugas: *${t.title}*\n🕒 Deadline: ${t.deadline}`);
            }
        }
    });
}

module.exports = { runSchedule };
