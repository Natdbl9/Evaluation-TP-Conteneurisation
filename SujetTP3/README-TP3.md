* \# TP3 \- Vérifications  
*   
* \#\# Construire et lancer la stack  
* docker compose up \--build  
*   
* \#\# Vérifier les services  
* docker compose ps  
* \# Services attendus : frontend, backend, cache  
*   
* \#\# Tester l'application  
* \* Frontend : http://localhost:8080  
* \* Backend : http://localhost:3001/health (Attendu : {"status":"ok"})  
*   
* \#\# Vérifier la sécurité (Cache interne)  
* docker compose ps  
* \# Le service cache ne doit pas avoir de ports publiés (ex: 0.0.0.0:6379-\>6379)  
*   
* \#\# Vérifier la persistance  
* docker compose down  
* docker compose up \-d  
* \# Les données du cache doivent persister  
*   
* \#\# Commandes utiles  
* \* Afficher les logs : \`docker compose logs \-f\`  
* \* Accéder au backend : \`docker compose exec backend sh\`  
* \* Arrêter tout : \`docker compose down\`  
* \* Arrêter et supprimer les volumes : \`docker compose down \-v\`

