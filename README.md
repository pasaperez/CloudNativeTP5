# CloudNativeTP5
Repositorio completo para build y subir codigo del trabajo practico 5 de Computación en la Nube.

## Consignas
https://github.com/andresceccoli/cloud-faas-tp5

## Resolución
### Almacenamiento de archivos con MiniO
Mi MiniO esta alojado en un cluster publico de openshift Red-Hat. 
El endpoint:

```
http://minio-service-minio.apps.us-west-1.starter.openshift-online.com/minio/
```
La password y password secreta son:
"minio" "minio123"

### Logica
El tp esta realizado con openfaas con funciones en NodeJS 10.
La funciones todos, jpg, png, pdf y txt. Son las funciones disparadas por eventos webhook MiniO.

El endpoint de la UI es:
```
http://34.95.153.180:8080/ui/
```
Con usuario y contraseña:
"admin" "39767731"

### Base de Datos
El almacenamiento de los procesamientos se alojo en una base de datos MongoDB en el cluster de Atlas.
Un usuario con permisos para acceder a la DB desde codigo js es:

```
mongodb+srv://usertest:VuheioW9z1pMazuC@pasaperez-vzf9m.gcp.mongodb.net/"+dbd+"?w=majority
```
### API Rest
La API de consultas esta desarrollada para ser utilizada con openfaas.
Se realizaron funciones: file, images, text, para realizar consultas.

### Almacenamiento y busqueda de texto
Se utilizo algolia con un indice:
"production"
Con ID de aplicacion:
"PKGIEV1P11"
Y key de busqueda:
"1be49959c827c3be5c08a30c12656477"

## Deploys

### Openfaas
Openfaas se hizo deployment con los .yml de namespace y los de la carpeta yaml.

### MiniO
MiniO se hizo deployment con los siguientes comandos:
```
kubectl create -f https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-pvc.yaml?raw=true
kubectl create -f https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-deployment.yaml\?raw\=true
kubectl create -f https://github.com/minio/minio/blob/master/docs/orchestration/kubernetes/minio-standalone-service.yaml?raw=true
```
## Autor

* **Angel Santiago Perez** - *Legajo 40023* - 
