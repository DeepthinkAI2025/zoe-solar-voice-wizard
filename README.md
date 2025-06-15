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

Dies ist eine anfängerfreundliche Anleitung, um eine virtuelle Maschine (VM) auf Google Cloud für Speech-to-Text (Whisper) und Text-to-Speech (Dia/TTS) einzurichten. Das Ziel ist, eine API-URL zu erhalten, die im Frontend verwendet werden kann.

## Schritt-für-Schritt Anleitung

### 1. Google Cloud Account erstellen
1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/).
2. Erstelle einen neuen Account oder melde dich an.
3. Aktiviere die kostenlose Testversion, um Startguthaben zu erhalten (oft 300$).

### 2. Neues Projekt erstellen
1. Klicke oben links auf das Dropdown-Menü zur Projektauswahl.
2. Klicke auf "Neues Projekt".
3. Gib einen Projektnamen ein (z.B. "ki-audio-api").
4. Klicke auf "Erstellen".

### 3. Compute Engine API aktivieren
1. Navigiere im Menü links zu "Compute Engine" > "VM-Instanzen".
2. Falls die API noch nicht aktiviert ist, klicke auf "Aktivieren". Dies kann einige Minuten dauern.

### 4. VM-Instanz erstellen
1. Klicke auf "Instanz erstellen".
2. **Name:** Wähle einen Namen, z.B. `audio-server-vm`.
3. **Region:** Wähle eine Region in deiner Nähe, z.B. `europe-west3` (Frankfurt). Zone kann `europe-west3-c` sein.
4. **Maschinentyp:** Für den Anfang ist `e2-medium` (2 vCPUs, 4 GB RAM) ausreichend. Wenn die Performance nicht reicht, kann man später auf `e2-standard-4` (4 vCPUs, 16 GB RAM) upgraden.
5. **Boot-Disk:** 
   - Klicke auf "Ändern".
   - Betriebssystem: `Ubuntu`.
   - Version: `Ubuntu 22.04 LTS`.
   - Größe: Erhöhe die Größe auf mindestens `30 GB`, um Platz für die Modelle zu haben.
   - Klicke "Auswählen".
6. **Firewall:** 
   - Setze ein Häkchen bei ✅ **HTTP-Traffic zulassen**.
   - Setze ein Häkchen bei ✅ **HTTPS-Traffic zulassen**.
7. Klicke auf "Erstellen". Die VM wird nun gestartet.

### 5. Verbindung zur VM herstellen
1. Warte, bis bei deiner VM ein grüner Haken erscheint.
2. Klicke in der Zeile deiner VM auf "SSH". Es öffnet sich ein neues Browser-Fenster mit einer Terminal-Verbindung.

### 6. System aktualisieren
Führe im SSH-Terminal folgende Befehle aus:
```bash
sudo apt update
sudo apt upgrade -y
```

### 7. Python und notwendige Tools installieren
```bash
sudo apt install python3.10-venv python3-pip git -y
```

### 8. Projektordner und virtuelle Umgebung einrichten
```bash
# Erstelle einen Ordner für die API
mkdir ~/audio-api
cd ~/audio-api

# Erstelle eine virtuelle Python-Umgebung
python3 -m venv venv

# Aktiviere die Umgebung
source venv/bin/activate
```
Dein Terminal-Prompt sollte sich nun ändern und `(venv)` am Anfang anzeigen.

### 9. Notwendige Python-Bibliotheken installieren
```bash
# Flask für die API
pip install Flask Flask-Cors

# Whisper für Speech-to-Text
pip install git+https://github.com/openai/whisper.git

# Coqui TTS für Text-to-Speech (Alternative zu "Dia")
pip install TTS

# PyTorch (wird von Whisper und TTS benötigt)
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
```
*Hinweis: Die Installation kann einige Zeit dauern.*

### 10. API-Server-Code erstellen
Erstelle eine Datei für den API-Code:
```bash
nano app.py
```
Füge den folgenden Python-Code ein (Rechtsklick > Einfügen im Browser-Terminal):
```python
import os
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import whisper
from TTS.api import TTS
import torch

# Prüfen, ob eine GPU verfügbar ist
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Flask App initialisieren
app = Flask(__name__)
CORS(app)

# Modelle laden (dies kann beim ersten Start dauern)
print("Loading Whisper model...")
whisper_model = whisper.load_model("base", device=device)
print("Whisper model loaded.")

print("Loading TTS model...")
tts_model = TTS("tts_models/de/thorsten/tacotron2-DDC").to(device)
print("TTS model loaded.")

@app.route('/stt', methods=['POST'])
def speech_to_text():
    if 'audio' not in request.files:
        return jsonify({"error": "Keine Audio-Datei im Request gefunden"}), 400
    
    audio_file = request.files['audio']
    
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as temp_audio_file:
        audio_file.save(temp_audio_file.name)
        try:
            print("Transcribing audio...")
            result = whisper_model.transcribe(temp_audio_file.name, language='de', fp16=False if device == 'cpu' else True)
            transcript = result["text"]
            print(f"Transcription result: {transcript}")
            return jsonify({"transcript": transcript})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/tts', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "Kein Text im Request gefunden"}), 400
        
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio_file:
            print(f"Generating speech for: {text}")
            tts_model.tts_to_file(text=text, file_path=temp_audio_file.name)
            # send_file löscht die Datei nach dem Senden
            return send_file(temp_audio_file.name, mimetype='audio/wav', as_attachment=False)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running"})

if __name__ == '__main__':
    # Port 80, weil wir HTTP-Traffic erlaubt haben
    app.run(host='0.0.0.0', port=80, debug=False)

```
Speichere die Datei mit `Ctrl+X`, dann `Y` drücken und `Enter` bestätigen.

### 11. Firewall-Regel für Port 80 (Standard-HTTP)
Da wir HTTP-Traffic bereits in Schritt 4 erlaubt haben, ist der Port 80 standardmäßig offen. Falls du einen anderen Port (z.B. 8080) verwenden möchtest, musst du eine separate Firewall-Regel erstellen.

### 12. API-Server starten
Starte den Server mit folgendem Befehl:
```bash
# Stelle sicher, dass du im richtigen Ordner bist und die venv aktiv ist
python app.py
```
Das Terminal wird nun die Lade-Logs der Modelle anzeigen. Nach kurzer Zeit sollte stehen, dass der Server auf `http://0.0.0.0:80` läuft.

### 13. Externe IP-Adresse finden und URL erhalten
1. Gehe zurück zur Google Cloud Console > "Compute Engine" > "VM-Instanzen".
2. In der Liste deiner VMs siehst du die **Externe IP-Adresse**. Kopiere sie.
3. **Deine API-URL lautet:** `http://DEINE_EXTERNE_IP` (ohne Port, da wir Port 80 verwenden).
   Beispiel: `http://34.123.45.67`

### 14. API testen
Öffne einen neuen Tab in deinem Browser und rufe die Health-Check-URL auf: `http://DEINE_EXTERNE_IP/health`
Wenn alles geklappt hat, siehst du: `{"status":"API is running"}`.

### 15. Server dauerhaft laufen lassen (Optional, aber empfohlen)
Damit der Server auch nach Schließen des SSH-Fensters weiterläuft, richten wir einen `systemd` Service ein.
1. Stoppe den laufenden Server im Terminal mit `Ctrl+C`.
2. Erstelle eine Service-Datei:
   ```bash
   sudo nano /etc/systemd/system/audio-api.service
   ```
3. Füge folgenden Inhalt ein. **Ersetze `DEIN_BENUTZERNAME`** mit deinem Linux-Benutzernamen (findest du mit `whoami` im Terminal heraus).
   ```ini
   [Unit]
   Description=Audio API Service for STT/TTS
   After=network.target

   [Service]
   User=DEIN_BENUTZERNAME
   Group=www-data
   WorkingDirectory=/home/DEIN_BENUTZERNAME/audio-api
   Environment="PATH=/home/DEIN_BENUTZERNAME/audio-api/venv/bin"
   ExecStart=/home/DEIN_BENUTZERNAME/audio-api/venv/bin/python app.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```
4. Speichere mit `Ctrl+X`, `Y`, `Enter`.
5. Aktiviere und starte den Service:
   ```bash
   sudo systemctl enable audio-api.service
   sudo systemctl start audio-api.service
   ```
6. Überprüfe den Status:
   ```bash
   sudo systemctl status audio-api.service
   ```
   Drücke `q`, um die Statusanzeige zu verlassen.

Deine API ist nun unter deiner URL erreichbar und wird auch nach einem Neustart der VM automatisch gestartet.
