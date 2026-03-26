export async function exportWAV(audioBuffer: AudioBuffer): Promise<Blob> {
    const targetSampleRate = 44100;
    const numChannels = audioBuffer.numberOfChannels;
    
    // Resample if needed using OfflineAudioContext
    let renderBuffer = audioBuffer;
    if (audioBuffer.sampleRate !== targetSampleRate) {
        const duration = audioBuffer.duration;
        const offlineCtx = new OfflineAudioContext(numChannels, targetSampleRate * duration, targetSampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineCtx.destination);
        source.start(0);
        renderBuffer = await offlineCtx.startRendering();
    }

    // Convert to PCM 16-bit
    const length = renderBuffer.length;
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push(renderBuffer.getChannelData(i));
    }

    // Calculate sizes
    const bytesPerSample = 2; // 16-bit
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = targetSampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    view.setUint8(8, 'W'.charCodeAt(0));
    view.setUint8(9, 'A'.charCodeAt(0));
    view.setUint8(10, 'V'.charCodeAt(0));
    view.setUint8(11, 'E'.charCodeAt(0));

    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);             // Subchunk1Size
    view.setUint16(20, 1, true);              // AudioFormat (PCM)
    view.setUint16(22, numChannels, true);    // NumChannels
    view.setUint32(24, targetSampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true);       // ByteRate
    view.setUint16(32, blockAlign, true);     // BlockAlign
    view.setUint16(34, bytesPerSample * 8, true); // BitsPerSample

    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);       // Subchunk2Size

    // Write PCM data
    let offset = 44;
    for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            let sample = channels[channel][i];
            // Clamp
            sample = Math.max(-1, Math.min(1, sample));
            // 16-bit PCM scale
            const pcmVal = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, pcmVal, true); // little-endian
            offset += 2;
        }
    }

    return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
