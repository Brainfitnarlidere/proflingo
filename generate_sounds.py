import wave
import struct
import math

def generate_tone(filename, frequency, duration, volume=0.5, type='sine', slide=False):
    sample_rate = 44100
    num_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 2 bytes
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            # Calculate current frequency if sliding
            current_freq = frequency
            if slide:
                # Slide frequency up or down based on type
                if type == 'slide_up':
                    current_freq = frequency + (i / num_samples) * 400
                elif type == 'slide_down':
                    current_freq = frequency - (i / num_samples) * 150
            
            # Triangle wave for harsher sounds, sine for smooth
            if type == 'triangle' or type == 'slide_down':
                # Harsher sound for 'wrong'
                val = 2.0 * math.fabs(2.0 * ((i * current_freq / sample_rate) % 1.0) - 1.0) - 1.0
            else:
                # Smooth sine for 'correct', 'pop'
                val = math.sin(2 * math.pi * current_freq * (i / sample_rate))
                
            # Envelope (fade out)
            envelope = 1.0 - (i / num_samples)
            if i < int(sample_rate * 0.02): # Quick attack
                 envelope = i / int(sample_rate * 0.02)
                 
            sample = int(val * envelope * volume * 32767.0)
            wav_file.writeframes(struct.pack('<h', sample))

# 1. Correct (Bright Ding - High freq sine slide up)
generate_tone('audio/correct.wav', frequency=800, duration=0.3, volume=0.6, type='slide_up', slide=True)

# 2. Wrong (Low dull thud - Triangle wave slide down)
generate_tone('audio/wrong.wav', frequency=300, duration=0.35, volume=0.5, type='slide_down', slide=True)

# 3. Pop (Short bright tick)
generate_tone('audio/pop.wav', frequency=950, duration=0.1, volume=0.4, type='sine')

# 4. Complete (Longer triumphant sequence - approximation via single sweep)
generate_tone('audio/complete.wav', frequency=600, duration=0.6, volume=0.6, type='slide_up', slide=True)

print("Audio files generated successfully.")
