## YAML (development-only instructions)

When using these instructions you only want to use OpenFaaS for development.

For production usage use helm, or template YAML files through the use of helm.

One size doesn't fit all and for that reason it's strongly encouraged that you use helm and set the appropriate parameters such as whether you're using a LoadBalancer and what your timeouts are going to be.

These files are generated by running `./contrib/create-static-manifest.sh` from the `faas-netes` project root.

### 1.0 Create namespaces

```sh
kubectl apply -f namespaces.yml
```

### 2.0 Create password

Generate secrets so that we can enable basic authentication for the gateway:

```sh
# generate a random password
PASSWORD=$(head -c 12 /dev/urandom | shasum| cut -d' ' -f1)

kubectl -n openfaas create secret generic basic-auth \
--from-literal=basic-auth-user=admin \
--from-literal=basic-auth-password="$PASSWORD"
```

### 3.0 Apply YAML files

```sh
kubectl apply -f ./yaml/
```

### 4.0 Log in

Set `OPENFAAS_URL`:

```sh
export OPENFAAS_URL=http://127.0.0.1:31112
```

If not using a NodePort, or if using KinD:

```sh
kubectl port-forward svc/gateway -n openfaas 31112:8080 &
```

Now log-in:
```sh
echo -n $PASSWORD | faas-cli login --password-stdin

faas-cli list

Function                        Invocations     Replicas
```

