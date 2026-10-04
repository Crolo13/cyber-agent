export async function analyzeLogin(data) {
  const failedAttempts = Number(data.failedAttempts || 0);

  let riskLevel = "low";
  let finding = "No major suspicious login activity detected.";

  if (failedAttempts >= 5) {
    riskLevel = "medium";
    finding =
      "Several failed login attempts were detected. This activity should be reviewed.";
  }

  if (failedAttempts >= 10) {
    riskLevel = "high";
    finding =
      "A large number of failed login attempts were detected. This could indicate brute-force activity.";
  }

  return {
    username: data.username || "unknown",
    ipAddress: data.ipAddress || "unknown",
    failedAttempts,
    riskLevel,
    finding,
  };
}
