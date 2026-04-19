export const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

export const periodStart = (p) => {
  const n = new Date();
  if (p === "today") return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  if (p === "week") {
    const d = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    d.setDate(d.getDate() - d.getDay());
    return d.getTime();
  }
  if (p === "month") return new Date(n.getFullYear(), n.getMonth(), 1).getTime();
  return 0;
};

export const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 480;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const setupNotification = (scheduleReminder) => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") scheduleReminder();
  else if (Notification.permission === "default")
    Notification.requestPermission().then((p) => {
      if (p === "granted") scheduleReminder();
    });
};

export const getExportMessage = (txns, categories) => {
  const now = new Date();
  const mn = now.toLocaleString("en-IN", { month: "long", year: "numeric" });
  const mT = txns.filter((t) => {
    const d = new Date(t.timestamp);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const tot = mT.reduce((s, t) => s + t.amount, 0);
  
  const lines = categories
    .map((c) => {
      const a = mT
        .filter((t) => t.category === c.id)
        .reduce((s, t) => s + t.amount, 0);
      return a > 0 ? `  ${c.emoji} ${c.label}: ₹${a.toLocaleString("en-IN")}` : null;
    })
    .filter(Boolean)
    .join("\n");

  const owed = txns
    .filter((t) => t.category === "lending" && !t.settled)
    .reduce((s, t) => s + t.amount, 0);

  return [
    `📊 *${mn} — Spending Summary*`,
    `${"━".repeat(25)}`,
    `💰 *Total: ₹${tot.toLocaleString("en-IN")}*`,
    `📦 Transactions: ${mT.length}`,
    ``,
    `*By Category:*`,
    lines || "  (none)",
    owed > 0 ? `\n🤝 *Lent pending: ₹${owed.toLocaleString("en-IN")}*` : "",
    ``,
    `_Sent from My Spending App 🏠_`,
  ].join("\n");
};
