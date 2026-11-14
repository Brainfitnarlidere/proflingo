import wave
import struct
import math

def generate_pluck(filename, freqs, duration, volume=0.5):
    sample_rate = 44100
    num_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = i / sample_rate
            val = 0
            
            # Combine multiple frequencies (harmonics) for a richer, natural wood/string sound
            for f in freqs:
                # Exponential decay envelope for that "pluck" organic feel
                decay = math.exp(-5.0 * t) 
                # Add fundamental and an overtone
                val += math.sin(2 * math.pi * f * t) * decay
                val += 0.3 * math.sin(2 * math.pi * (f * 2.1) * t) * math.exp(-10.0 * t)
                
            val = val / len(freqs) # Normalize
            
            # Master volume
            sample = int(val * volume * 32767.0)
            
            # Clip protection
            if sample > 32767: sample = 32767
            if sample < -32768: sample = -32768
                
            wav_file.writeframes(struct.pack('<h', sample))

def generate_sequence(filename, sequence, base_duration, volume=0.5):
    sample_rate = 44100
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for note in sequence:
            freq, duration = note
            num_samples = int(sample_rate * duration)
            for i in range(num_samples):
                t = i / sample_rate
                
                if freq == 0:
                    val = 0
                else:
                    decay = math.exp(-7.0 * t) 
                    val = math.sin(2 * math.pi * freq * t) * decay
                    val += 0.2 * math.sin(2 * math.pi * (freq * 2.1) * t) * math.exp(-15.0 * t)
                    
                sample = int(val * volume * 32767.0)
                wav_file.writeframes(struct.pack('<h', sample))

# 1. Correct: Natural Marimba Double Pluck (C6 -> E6)
# Two quick ascending wooden knocks
sequence_correct = [(1046.50, 0.1), (1318.51, 0.4)]
generate_sequence('audio/correct.wav', sequence_correct, 0.5, volume=0.7)

# 2. Wrong: Dull low wooden block tap (E3)
generate_pluck('audio/wrong.wav', [164.81], 0.4, volume=0.8)

# 3. Pop: Very short tiny wooden tick (C7)
generate_pluck('audio/pop.wav', [2093.00], 0.1, volume=0.3)

# 4. Complete: Happy Marimba Arpeggio (C5 -> E5 -> G5 -> C6)
sequence_complete = [(523.25, 0.15), (659.25, 0.15), (783.99, 0.15), (1046.50, 0.6)]
generate_sequence('audio/complete.wav', sequence_complete, 1.0, volume=0.7)

print("Natural sounds generated successfully.")
