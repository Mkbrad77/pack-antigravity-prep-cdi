# Fiche Mémo 6.1 : Dockerfile robuste et optimisation de build

## 1. Bonnes pratiques d'ingénieur senior
1. **Multi-stage builds :** Séparer la phase de compilation (compilateurs C++, dépendances de build) de l'image finale de production qui ne contient que le runtime minimal, réduisant la surface d'attaque et la taille de l'image (ex. de 1.2 Go à 90 Mo).
2. **Ordre des couches pour maximiser le cache Docker :**
   Copier les fichiers de dépendances (`requirements.txt` ou `package.json`) et les installer *avant* de copier le code source applicatif (`COPY . .`). Ainsi, modifier une ligne de code ne relance pas l'installation des paquets.
3. **Exécuter en tant qu'utilisateur non-root :**
   Créer un utilisateur dédié (`USER appuser`) pour limiter les risques en cas de vulnérabilité applicative.

```dockerfile
# Stage 1 : Build
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2 : Final Runtime
FROM python:3.11-slim
WORKDIR /app
RUN useradd -m -u 1000 appuser
COPY --from=builder /root/.local /home/appuser/.local
COPY src/ /app/src/
USER appuser
ENV PATH=/home/appuser/.local/bin:$PATH
ENTRYPOINT ["python", "src/main.py"]
```
