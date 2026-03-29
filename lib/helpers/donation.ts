const DEFAULT_MESSAGES: Record<string, string> = {
  "0": "كن أول مبادر",
  "25": "بداية رائعة!",
  "50": "نصف الطريق",
  "75": "اقتربنا من الهدف",
  "100": "تم تحقيق الهدف! شكراً لكم",
};

export function getDonationProgress(
  currentAmount: number,
  targetAmount: number,
  progressMessages?: Record<string, string> | null,
): { percentage: number; message: string } {
  if (targetAmount <= 0) {
    return { percentage: 0, message: "" };
  }

  const percentage = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100,
  );

  const messages = progressMessages ?? DEFAULT_MESSAGES;

  // Find the highest threshold that percentage has reached
  const thresholds = Object.keys(messages)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a);

  let message = "";
  for (const threshold of thresholds) {
    if (percentage >= threshold) {
      message = messages[String(threshold)];
      break;
    }
  }

  return { percentage, message };
}

export function formatCurrency(amount: number, currency = "ر.س"): string {
  return `${amount.toLocaleString("ar-SA")} ${currency}`;
}
