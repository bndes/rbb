


# 1.Prerequisito 
Para este guia assumimos que você tenha o ainsible instalado na sua máquina.
Documentação de instalação ansible: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html

# 2.update

Nos vamos sugerir duas formas diferentes de fazer o update do  besu, a primeira forma é usando os scripts ansible e a segunda forma é usando diretamente os binarios 

# update atraves do ansible 

2.0.1) Para fazer o update, é necessário acessar a sua maquina que está rodando o nó

2.0.2) parar o besu

2.0.3.1) caso voce use o HTTP PROXY, verificar se as variaveis HTTP_PROXY e http_proxy  estão definidas em /etc/environment (ou no .profile), casa nao esteja as defina.
Exemplo 

http_proxy=http://example.proxy.com:8080
HTTP_PROXY=http://example.proxy.com:8080

2.0.3.2) caso voce use o HTTPS PROXY, verificar se as variáveis HTTPS_PROXY e https_proxy  estão definidas em /etc/environment(ou no .profile), casa não esteja as defina.
Exemplo 

https_proxy=http://example.proxy.com:8080
HTTPS_PROXY=http://example.proxy.com:8080

2.0.4) agora volte para a sua maquina que tem o ansible instalado e os scripts  ansible

2.0.5) configure o arquivo inventory definindo com o:
exemplo
<your node address> node_ip=<besu_public_ip>  node_name=<node name> node_email=<your@email> dns_name=<your dns> 
 
no local do tipo do seu no 
 
2.0.6) para terminar basta executar o comando
ansible-playbook -i inventory --private-key=~/.ssh/id_ecdsa -u remote_user site-lacchain-update-<TipoDoNó>.yml 

# update atraves dos binarios 

2.1.1)Parar o serviço Pantheon.

2.1.2)Fazer um backup do usr/local/besu e descompactar o binário criando um  novo usr/local/besu

2.1.3)Reiniciar o Pantheon.

2.1.4) seguir os passos que estão na documentação

https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Install-Binaries/


# obs alguns comando que podem ajudar a verificar se a atualização, terminou corretamente 

retorna a versão do besu

$ pantheon --version

Ainda no shell com o curl consegue testar se esta funcionando:

$ curl -X POST --data '{"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":1}' http://localhost:4545
Verificar se conectou com os outros nós:
$ curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}' http://localhost:4545
Verificar se já está sincronizado (deve retornar false quando sincronizar)
$ curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' http://localhost:4545


# atualizar o protocolo ethereum
para atualizar o protocolo basta você adicionar uma linha no arquivo genesis file dizendo para qual protocolo a sua rede vai e
em qual bloco isso vai começar a valer. exemplo estamos usando o protocolo berlin e ele vai iniciar no bloco 974000
 
"config": {
     ...
    "constantinopleFixBlock": 0,
    "berlinBlock":
    "974000"
    ...
}

e para finalizar, de uma restart no besu 
