
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d26cd3f5-1479-495f-9877-47ea582767f2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d26cd3f5-1479-495f-9877-47ea582767f2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d26cd3f5-1479-495f-9877-47ea582767f2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

# Google Cloud VM Setup für Whisper (STT) und Dia (TTS)

## Schritt-für-Schritt Anleitung

### 1. Google Cloud Account erstellen
1. Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle einen Account oder melde dich an
3. Aktiviere die kostenlose Testversion (300€ Guthaben)

### 2. Neues Projekt erstellen
1. Klicke oben links auf "Projekt auswählen"
2. Klicke auf "Neues Projekt"
3. Gib einen Namen ein (z.B. "whisper-dia-api")
4. Klicke "Erstellen"

### 3. Compute Engine aktivieren
1. Gehe zu "Compute Engine" > "VM-Instanzen"
2. Warte bis die API aktiviert ist (dauert 2-3 Minuten)

### 4. VM-Instanz erstellen
1. Klicke "Instanz erstellen"
2. **Name:** `whisper-dia-server`
3. **Region:** `europe-west3-c` (Frankfurt - näher zu Deutschland)
4. **Maschinentyp:** `e2-standard-4` (4 vCPUs, 16 GB RAM)
5. **Boot-Disk:** 
   - Ubuntu 22.04 LTS
   - Typ: Standard persistent disk
   - Größe: 50 GB
6. **Firewall:** 
   - ✅ HTTP-Traffic zulassen
   - ✅ HTTPS-Traffic zulassen
7. Klicke "Erstellen"

### 5. SSH-Verbindung zur VM
1. Warte bis die VM läuft (grüner Haken)
2. Klicke auf "SSH" neben deiner VM
3. Ein Terminal-Fenster öffnet sich

### 6. System aktualisieren
```bash
sudo apt update
sudo apt upgrade -y
```

### 7. Python und pip installieren
```bash
sudo apt install python3 python3-pip python3-venv -y
```

### 8. Projekt-Ordner erstellen
```bash
mkdir ~/whisper-dia-api
cd ~/whisper-dia-api
```

### 9. Python Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 10. Dependencies installieren
```bash
# Whisper für STT
pip install openai-whisper

# Flask für Web-API
pip install flask flask-cors

# Weitere Dependencies
pip install torch torchaudio

# Für TTS (Dia-Modell alternative)
pip install TTS
```

### 11. API-Server Code erstellen
```bash
nano app.py
```

Füge folgenden Code ein:

```python
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import whisper
import tempfile
import os
from TTS.api import TTS
import io

app = Flask(__name__)
CORS(app)

# Whisper Model laden
whisper_model = whisper.load_model("base")

# TTS Model laden
tts = TTS("tts_models/de/thorsten/tacotron2-DDC")

@app.route('/stt', methods=['POST'])
def speech_to_text():
    try:
        # Audio-Datei aus Request
        audio_file = request.files.get('audio') or request.data
        
        if not audio_file:
            return jsonify({"error": "Keine Audio-Datei gefunden"}), 400
        
        # Temporäre Datei erstellen
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            if hasattr(audio_file, 'save'):
                audio_file.save(tmp_file.name)
            else:
                tmp_file.write(audio_file)
            
            # Whisper Transkription
            result = whisper_model.transcribe(tmp_file.name, language='de')
            transcript = result["text"]
            
            # Temp-Datei löschen
            os.unlink(tmp_file.name)
            
            return jsonify({"transcript": transcript})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/tts', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "Kein Text gefunden"}), 400
        
        # TTS generieren
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            tts.tts_to_file(text=text, file_path=tmp_file.name)
            
            # Audio-Datei zurückgeben
            return send_file(tmp_file.name, mimetype='audio/wav')
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API läuft", "whisper": "aktiv", "tts": "aktiv"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
```

Speichere mit `Ctrl+X`, dann `Y`, dann `Enter`.

### 12. Firewall-Regel erstellen
```bash
# In der Google Cloud Console (nicht SSH):
```
1. Gehe zu "VPC-Netzwerk" > "Firewall"
2. Klicke "Firewall-Regel erstellen"
3. **Name:** `allow-port-8080`
4. **Richtung:** Eingehend
5. **Aktion:** Zulassen
6. **Ziele:** Alle Instanzen im Netzwerk
7. **Quell-IP-Bereiche:** `0.0.0.0/0`
8. **Protokolle und Ports:** TCP, Port 8080
9. Klicke "Erstellen"

### 13. Server starten
```bash
cd ~/whisper-dia-api
source venv/bin/activate
python app.py
```

### 14. Externe IP-Adresse finden
1. Gehe zurück zu "Compute Engine" > "VM-Instanzen"
2. Kopiere die **Externe IP** deiner VM (z.B. `34.159.123.45`)

### 15. URL für Frontend
Deine API-URL ist: `http://DEINE_EXTERNE_IP:8080`

Beispiel: `http://34.159.123.45:8080`

### 16. API testen
Öffne im Browser: `http://DEINE_EXTERNE_IP:8080/health`

Du solltest sehen: `{"status": "API läuft", "whisper": "aktiv", "tts": "aktiv"}`

### 17. Im Frontend aktivieren
1. Öffne `src/hooks/useRemoteStt.ts`
2. Ändere `const VM_URL = "https://<YOUR_VM_URL>";` zu `const VM_URL = "http://DEINE_EXTERNE_IP:8080";`
3. Entferne die Kommentare `/*` und `*/` um den Code zu aktivieren
4. Wiederhole für `src/hooks/useRemoteTts.ts`

### Wichtige Hinweise:
- **Kosten:** Die VM kostet ca. 40-60€/Monat bei Dauerbetrieb
- **Sicherheit:** Für Produktion solltest du HTTPS und Authentifizierung hinzufügen
- **Server neustarten:** Falls die VM neu startet, musst du den Server wieder manuell starten

### Server automatisch starten (Optional):
```bash
# Systemd Service erstellen
sudo nano /etc/systemd/system/whisper-dia.service
```

Service-Datei:
```ini
[Unit]
Description=Whisper Dia API
After=network.target

[Service]
Type=simple
User=DEIN_USERNAME
WorkingDirectory=/home/DEIN_USERNAME/whisper-dia-api
Environment=PATH=/home/DEIN_USERNAME/whisper-dia-api/venv/bin
ExecStart=/home/DEIN_USERNAME/whisper-dia-api/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Service aktivieren:
```bash
sudo systemctl enable whisper-dia.service
sudo systemctl start whisper-dia.service
```
