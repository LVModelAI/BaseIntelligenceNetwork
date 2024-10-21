export function generateChunks(
    text: string,
    chunkSize = 1000,
    overlapSize = 200
) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        const chunk = text.slice(start, end);
        console.log("Chunk---------------->", chunk);
        chunks.push(chunk);
        start += chunkSize - overlapSize; // Move forward by chunkSize minus overlap
    }

    return chunks;
}
