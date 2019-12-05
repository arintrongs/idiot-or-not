# SDS Project - Idiot or Not

## Architecture
This project is automatically built and uploaded to the **docker hub** using **github actions**.

## Preparation
To setup the cluster we need **one load balancer node**, **two master node** and **four Raspberry Pi worker node** which have the following hostname, OS and and IP Address.

| Node (Hostname) | OS                    | IP Address    |
| --------------- | --------------------- | ------------- |
| load_balancer   | Ubuntu Linux 16.04    | 192.168.0.113 |
| master01        | Ubuntu Linux 16.04    | 192.168.0.107 |
| master02        | Ubuntu Linux 16.04    | 192.168.0.113 |
| worker01        | Raspbian Stretch Lite | 192.168.0.3   |
| worker02        | Raspbian Stretch Lite | 192.168.0.4   |
| worker03        | Raspbian Stretch Lite | 192.168.0.5   |
| worker04        | Raspbian Stretch Lite | 192.168.0.6   |


## Basic Installation

1. Install **cfssl** on **master01**
```
wget https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
wget https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
chmod +x cfssl*
sudo mv cfssl_linux-amd64 /usr/local/bin/cfssl
sudo mv cfssljson_linux-amd64 /usr/local/bin/cfssljson
```

2. Setup the environment on all nodes except the load balancer.
```
# Disable swap
sudo dphys-swapfile swapoff && \
sudo dphys-swapfile uninstall && \
sudo update-rc.d dphys-swapfile remove
sudo swapoff -a
sudo vim /etc/dphys-swapfile // set CONF_SWAPSIZE=0

# add cgroup
sudo vim /boot/cmdline.txt 

// Add the following line to the file
"cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory" to the file
```

3. Install **docker** on all nodes except the load balancer.

```
curl -sSL get.docker.com | sh && \
sudo usermod pi -aG docker && \
newgrp docker
```

4. Reboot 

```
sudo reboot
```

5. Update and Install **kubeadm** and **kubectl** on all nodes except the load balancer.

```
sudo vim /etc/apt/sources.list.d/kubernetes.list 

// Add the following line to the file.
deb http://apt.kubernetes.io/ kubernetes-xenial main
//////

// Add the key
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

sudo apt-get update
sudo apt-get install -qy kubeadm
```

6. Pre-pull images on the master nodes.

```
sudo kubeadm config images pull -v3
```

7. Install haprox on the load balancer.
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install haproxy
```

## Generating the TLS Certificates
1. Generate the certificate authority certificate and private key using `ca-config.json` and `ca-csr.json` in the reposiroty. 

```
cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```

2. Creating the certificate for the Etcd cluster using `kubernetes-csr.json` file in the repository.

```
cfssl gencert \
-ca=ca.pem \
-ca-key=ca-key.pem \
-config=ca-config.json \
-hostname=192.168.0.107,192.168.0.108,192.168.0.113,127.0.0.1,kubernetes.default \
-profile=kubernetes kubernetes-csr.json | \
cfssljson -bare kubernetes
```

3. Copy the certificate to master nodes.

```
scp ca.pem kubernetes.pem kubernetes-key.pem master01@192.168.0.107:~
scp ca.pem kubernetes.pem kubernetes-key.pem master02@192.168.0.108:~
```
## Configure the HAProxy
1. Add The following code to `etc/haproxy/haproxy.cfg`

```
global
 log /dev/log local0
 log /dev/log local1 notice
 chroot /var/lib/haproxy
 stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
 stats timeout 30s
 user haproxy
 group haproxy
 daemon

 # Default SSL material locations
 ca-base /etc/ssl/certs
 crt-base /etc/ssl/private

 # Default ciphers to use on SSL-enabled listening sockets.
 # For more information, see ciphers(1SSL). This list is from:
 #  https://hynek.me/articles/hardening-your-web-servers-ssl-ciphers/
 # An alternative list with additional directives can be obtained from
 #  https://mozilla.github.io/server-side-tls/ssl-config-generator/?server=haproxy
 ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS
 ssl-default-bind-options no-sslv3

defaults
 log global
 mode http
 option httplog
 option dontlognull
        timeout connect 5000
        timeout client  50000
        timeout server  50000
 errorfile 400 /etc/haproxy/errors/400.http
 errorfile 403 /etc/haproxy/errors/403.http
 errorfile 408 /etc/haproxy/errors/408.http
 errorfile 500 /etc/haproxy/errors/500.http
 errorfile 502 /etc/haproxy/errors/502.http
 errorfile 503 /etc/haproxy/errors/503.http

frontend kubernetes
 bind 192.168.0.113:6443
 bind :80
 bind :5000
 option tcplog
 mode tcp
 acl d1 dst_port 80
 acl d2 dst_port 5000
 use_backend web-backend if d1 
 use_backend api-backend if d2
 default_backend kubernetes-master-nodes

backend kubernetes-master-nodes
 mode tcp
 balance roundrobin
 option tcp-check
 server master01 192.168.0.107:6443 check fall 3 rise 2
 server master02 192.168.0.108:6443 check fall 3 rise 2

backend web-backend
 mode tcp
 balance roundrobin
 option tcp-check
 server worker01 192.168.0.3:31112 check fall 3 rise 2
 server worker02 192.168.0.4:31112 check fall 3 rise 2
 server worker03 192.168.0.5:31112 check fall 3 rise 2
 server worker04 192.168.0.5:31112 check fall 3 rise 2

backend api-backend
 mode tcp
 balance roundrobin
 option tcp-check
 server worker01 192.168.0.3:31115 check fall 3 rise 2
 server worker02 192.168.0.4:31115 check fall 3 rise 2
 server worker03 192.168.0.5:31115 check fall 3 rise 2
 server worker04 192.168.0.5:31115 check fall 3 rise 2
```
## Installing and configuring Etcd on master nodes
1. Move generated cert to etcd folder.
```
sudo mkdir /etc/etcd /var/lib/etcd
sudo mv ~/ca.pem ~/kubernetes.pem ~/kubernetes-key.pem /etc/etcd
```
2. Install etcd binaries.
```
wget https://github.com/coreos/etcd/releases/download/v3.3.9/etcd-v3.3.9-linux-amd64.tar.gz
tar xvzf etcd-v3.3.9-linux-amd64.tar.gz
sudo mv etcd-v3.3.9-linux-amd64/etcd* /usr/local/bin/
```

3. Create an etcd systemd unit file.
```
sudo vim /etc/systemd/system/etcd.service
```
```
[Unit]
Description=etcd
Documentation=https://github.com/coreos


[Service]
ExecStart=/usr/local/bin/etcd \
  --name 192.168.0.108 \
  --cert-file=/etc/etcd/kubernetes.pem \
  --key-file=/etc/etcd/kubernetes-key.pem \
  --peer-cert-file=/etc/etcd/kubernetes.pem \
  --peer-key-file=/etc/etcd/kubernetes-key.pem \
  --trusted-ca-file=/etc/etcd/ca.pem \
  --peer-trusted-ca-file=/etc/etcd/ca.pem \
  --peer-client-cert-auth \
  --client-cert-auth \
  --initial-advertise-peer-urls https://192.168.0.108:2380 \
  --listen-peer-urls https://192.168.0.108:2380 \
  --listen-client-urls https://192.168.0.108:2379,http://127.0.0.1:2379 \
  --advertise-client-urls https://192.168.0.108:2379 \
  --initial-cluster-token etcd-cluster-0 \
  --initial-cluster 192.168.0.108=https://192.168.0.108:2380,192.168.0.107=https://192.168.0.107:2380 \
  --initial-cluster-state new \
  --data-dir=/var/lib/etcd
Restart=on-failure
RestartSec=5



[Install]
WantedBy=multi-user.target
```

4. Reload daemon configuration and start etcd.

```
sudo systemctl daemon-reload
sudo systemctl enable etcd
sudo systemctl start etcd
```

Verify that the cluster is up.
```
ETCDCTL_API=3 etcdctl member list
```

## Initialize the master nodes.
1. In `master01` create `config.yaml` with the following code.

```
apiVersion: kubeadm.k8s.io/v1alpha3
kind: ClusterConfiguration
kubernetesVersion: stable
apiServerCertSANs:
- 192.168.0.113
controlPlaneEndpoint: "192.168.0.113:6443"
etcd:
  external:
    endpoints:
    - https://192.168.0.107:2379
    - https://192.168.0.108:2379
    caFile: /etc/etcd/ca.pem
    certFile: /etc/etcd/kubernetes.pem
    keyFile: /etc/etcd/kubernetes-key.pem
networking:
  podSubnet: 192.168.0.0/24
apiServerExtraArgs:
  apiserver-count: "3"
```
2. Initailize the master node.

```
sudo kubeadm init --config=config.yaml
```
3. Copy the certificates to `master02`.

```
sudo scp -r /etc/kubernetes/pki master02@192.168.0.108:~
```
4. Setup `kubeconfig`
```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
5. In `master02`, remove the `apiserver.crt` and `apiserver.key` and also move the copied certificates to the `/etc/kubernetes` directory.

```
sudo rm -rf ~/pki/apiserver.*
sudo mv ~/pki /etc/kubernetes/
```
6. Copy the control plane joining command and run on the `master02`.
```
// Example
kubeadm join --token 9e700f.7dc97f5e3a45c9e5 \
192.168.0.113:6443 --discovery-token-ca-cert-hash \
sha256:95cbb9ee5536aa61ec0239d6edd8598af68758308d0a0425848ae1af28859bea \ 
--control-plane
```
## Initializing the worker nodes.
1. Copy the worker joining command and run on the all worker nodes.
```
// Example
kubeadm join --token 9e700f.7dc97f5e3a45c9e5 \
192.168.0.113:6443 --discovery-token-ca-cert-hash \
sha256:95cbb9ee5536aa61ec0239d6edd8598af68758308d0a0425848ae1af28859bea 
```

## Install the Weave Net network driver.
1. Run the following command to install the Weave Net network drive in `master01`.
```
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

## Fix CoreDNS keep `CrashLoopBackOff`
1. kubectl edit cm coredns -n kube-system
2. delete ‘loop’ ,save and exit
3. restart coredns pods by：kubectl delete pod coredns.... -n kube-system

## Deploy the application
Clone the repository and run
```
./start.sh
```
or
```
wget --no-check-certificate https://raw.githubusercontent.com/arintrongs/idiot-or-not/master/start.sh | sh
```


