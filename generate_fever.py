import wave, struct, math

sample_rate = 44100
duration = 6.0 # 5s fever + 1s tail
filename = 'audio/fever_bgm.wav'

with wave.open(filename, 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    
    for i in range(int(sample_rate * duration)):
        t = i / sample_rate
        # 160 BPM fast pulse
        beat = (t * 160 / 60.0) % 1.0
        env = math.exp(-6 * beat)
        
        # Bassline
        bass_freq = 120 + 50 * math.sin(2 * math.pi * 8 * t)
        val = math.sin(2 * math.pi * bass_freq * t) * env
        
        # High arp pattern 
        arp_freq = 800 if (t * 160 / 60.0) % 2.0 < 1.0 else 1200
        val += 0.3 * math.sin(2 * math.pi * arp_freq * t) * env
        
        # Siren/Fever alarm running in background
        siren_freq = 600 + 200 * math.sin(2 * math.pi * 2 * t)
        val += 0.15 * math.sin(2 * math.pi * siren_freq * t)
                
        sample = int(val * 0.5 * 32767.0)
        # Clip
        if sample > 32767: sample = 32767
        if sample < -32768: sample = -32768
            
        wav_file.writeframes(struct.pack('<h', sample))

print("Fever BGM generated.")
