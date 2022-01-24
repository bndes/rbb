


# 1.Pré-requisitos 
Para este guia, assumimos que você tem o ansible instalado na sua máquina.
Documentação de instalação ansible: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html

# 2.Update

Nós vamos sugerir duas formas diferentes de fazer o update do  besu: a primeira forma, é usando os scripts ansible; e a segunda forma é usando diretamente os binários 

# Update através do ansible 

2.0.1) Para fazer o update, é necessário acessar a sua máquina que está rodando o nó.

2.0.2) Parar o besu.

2.0.3.1) Caso você use o HTTP PROXY, verifique se as variáveis HTTP_PROXY e http_proxy estão definidas em /etc/environment (ou no .profile). Caso não esteja, defina tais variáveis. Exemplo:

http_proxy=http://example.proxy.com:8080
HTTP_PROXY=http://example.proxy.com:8080

2.0.3.2) Caso você use o HTTPS PROXY, verifique se as variáveis HTTPS_PROXY e https_proxy estão definidas em /etc/environment(ou no .profile). Caso não esteja, defina tais variáveis. Exemplo: 

https_proxy=https://example.proxy.com:8080
HTTPS_PROXY=https://example.proxy.com:8080

2.0.4) Agora retorne para a máquina que tem o ansible instalado e os scripts ansible (https://github.com/RBBNet/rbb/tree/master/instalacao-rbb-node).

2.0.5) Configure o arquivo inventory definindo com o exemplo:

"your node address"  node_ip=<besu_public_ip>  besu_release_version=<besu_version>
 
no local do tipo do seu nó.
 
2.0.6) Para terminar basta executar o comando:
 
ansible-playbook -i inventory --private-key=~/.ssh/id_ecdsa -u remote_user site-lacchain-update-<TipoDoNó>.yml 

# Update através dos binários 

2.1.1) Parar o serviço Pantheon.

2.1.2) Fazer um backup do usr/local/besu e descompactar o binário criando um  novo usr/local/besu.

2.1.3) Reiniciar o Pantheon.

2.1.4) Seguir os passos que estão na documentação:

https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Install-Binaries/


# Obs: alguns comando que podem ajudar a verificar se a atualização, terminou corretamente 

Retorna a versão do besu:

$ pantheon --version

Ainda no shell com o curl consegue testar se está funcionando:
 
$ curl -X POST --data '{"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":1}' http://localhost:4545
 
Verificar se conectou com os outros nós:
 
$ curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' http://localhost:4545
 
Verificar se já está sincronizado (deve retornar false quando sincronizar):

$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' http://localhost:4545


# Atualizar o protocolo ethereum
Para atualizar o protocolo, basta você adicionar uma linha no arquivo genesis file dizendo para qual protocolo a sua rede vai e
em qual bloco isso vai começar a valer. Exemplo estamos usando o protocolo berlin e ele vai iniciar no bloco 974000:
 
"config": {
     ...
    "constantinopleFixBlock": 0,
    "berlinBlock":974000
    ...
}

E, para finalizar, dê um restart no besu.
