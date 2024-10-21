export const generateInputForAI = (
    context: string,
    userMessage: string,
    history: {
        role: "assistant" | "user";
        message: string;
    }[]
) => {
    const systemMessage = `${process.env.OPENAI_BASE_SYSTEM_PROMPT}
                ${history.map((msg) => `${msg.role}: ${msg.message}`).join("\n")}
                ${process.env.OPENAI_BASE_SYSTEM_INSTRUCTIONS}`;

    const humanMessage = `Current Context: ${context}\n\nQuestion: ${userMessage}`;

    return { humanMessage, systemMessage };
};
