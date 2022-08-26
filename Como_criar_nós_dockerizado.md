Este roteiro guia na criação de nós para o laboratório da RBB usando docker. Algumas premissas simplificadoras são assumidas: 
- São exatamente três nós: 1 nó writer, 1 nó boot e 1 nó validator. 
- Todos os nós serão executados em uma única VM, exclusiva para esse serviço.

# Passo 1 - Ambiente Físico

## Requisitos mínimos do sistema

Recursos de hardware recomendados para os nós na rede de teste:

* **CPU**: 4 cores

* **Memória RAM**: 8 GB

* **Disco Rígido**: 180 GB SSD


# Passo 2 - Scripts Docker

Verifique se o relógio do seu servidor está com a hora correta. É recomendável que ele esteja sincronizado com um servidor NTP conhecido (pela porta *123/udp*), por exemplo, o pool.ntp.br. Caso contrário, erros na sincronização podem ocorrer com a mensagem "invalid checkpoint headers".

Sugere-se fortemente alocar aos nós internos máquinas com IPs públicos que não será modificado no futuro. Uma mudança de IP implica em reconfigurações de regras de firewall e reconexão dos nós com novos e-nodes.

## Pré-requisitos necessários
* Docker, versão mínima 18.09.9
* jq

### Instalação do jq ###

```
curl -#SLo/usr/local/bin/jq https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64
chmod a+x /usr/local/bin/jq
```

## Instalação dos nós ##
Criar um diretório: 
```
mkdir <nome-do-diretorio>
cd <nome-do-diretorio>
```

Baixar o arquivo tgz [clicando aqui](https://github.com/RBBNet/rbb/raw/master/rbb-setup.tgz).

Descompactar o arquivo tgz no diretório criado: ``tar xzf rbb-setup.tgz``

Caso uma das portas entre as utilizadas (10000, 10001, 10010, 10011 e 10012) não estejam disponíveis no host, ajustar o mapeamento no arquivo ``<nome-do-diretorio>/infra.json``.

Preencher, no mesmo arquivo, o campo "organization" para indicar o nome/apelido da organização que será apresentado na monitoração atual, que é realizada pelo BID.

Executar os comandos:
 ```
  VALIDATOR_COUNT=1 BOOT_COUNT=1 WRITER_COUNT=1 commands/blockchain-setup
 ```
 E, em seguida:
 ```
  docker-compose up -d
 ```
 
 Utilize ``` docker-compose logs -f ``` para visualizar os logs dos nós.
  
  
# Passo 3 - Filtros de rede
Serão utilizadas 3 portas para comunicação dos nós com os outros nós da rede, os da empresa e os de fora da empresa. 

A figura abaixo reflete a topologia da rede quando só havia BNDES e BID como nós. As conexões peer-to-peer são na porta 60606 TCP/UDP. A [topologia da rede será análoga a da Lacchain](instalacao-rbb-node/TOPOLOGY_AND_ARCHITECTURE.md).

![GitHub Logo](./network_diagram_rbb.png)

As seguintes regras de abertura de firewall devem ser consideradas para uma instituição que terá nós da RBB.

Para a porta 60606 (TCP e UDP):
- R1 - Conexão entre nós internos de sua rede da instituição: validadores e boot | boot e writers
- R2 - Todos os nós da instituição precisam se conectar aos boots de outras instituições
- R3 - Todos os boots de outras instituições precisam se conectar a todos os nós da instituição
- R4 - Todos os validadores da instituição precisam se conectar a todos os validadores de outras instituições
- R5 - Todos os validadores de outras instituições precisam se conectar a todos os validadores da instituição

Para a porta 4545:
- O writer node deve também ter aberta a porta aberta 4545 (ou 443, em evolução) para um conjunto restrito de IPs. Essa porta é equivalente a porta 8545 utilizada no Geth. Ou seja, é a porta que os dApps se comunicam com o nó Writer para enviar transações e fazer consultas. Fica a critério e responsabilidade da instituição instaladora ampliar o conjunto de IPs, por exemplo, para toda sua rede interna ou até mesmo para Internet, de acordo com sua necessidade.

  
# Passo 4 - Verificar Conexão na Rede

Execute da seguinte forma:
```bash
# commands/node-rpc <NODE> <MÉTODO> <PARÂMETROS>
# Exemplos:

# consulta informações do node
commands/node-rpc boot1 admin_nodeInfo

# consulta peers conectados
commands/node-rpc writer2 admin_peers
```

  
# Passo 5 - Gestão de chaves

O processo de instalação de cada nó gera a chave privada em ``${CONFIG_ROOT}/nodes/${NODE_NAME}/key``. Essa chave privada está associada a chave pública do nó, que compõe o seu enode. Perceba que a chave privada é salva sem criptografia. É possível conferir a chave pública do seu nó em ``${CONFIG_ROOT}/nodes/${NODE_NAME}/key.pub`` ou executando o comando ``commands/node-rpc ${NODE_NAME} admin_nodeInfo``.

A conta blockchain associada ao nó está salva em ``${CONFIG_ROOT}/nodes/${NODE_NAME}/node.address``. Ela será necessária no momento do permissionamento (passo seguinte).

É necessário ter um mecanismo interno para gerir essas chaves privadas: onde armazenar a chave, quem tem acesso, mecanismo de recuperação etc.

# Passo 6 - Permissionamento dos novos nós

É necessário permissionar o(s) novo(s) nó(s) para participar na rede. Essa ação é realizada por uma instituição participante da RBB com conta blockchain de permissionamento. Entre em contato informando os e-nodes e as contas blockchain dos nós instalados.


# Passo 7 - Inclusão de nós Validadores no Algoritmo de Consenso  (apenas para novo nós do tipo validador)

Se novos validadores forem adicionados é necessário disparar uma votação de forma a incluí-los no algoritmo de consenso. Para isso, deve-se seguir o procedimento https://besu.hyperledger.org/en/stable/HowTo/Configure/Consensus-Protocols/Add-Validators/ (ver seção de IBFT2.0 com votação).
Algumas observações importantes:
* É uma boa prática utilizar ``ibft_getSignerMetrics`` para verificar se existem validadores não-ativos antes de iniciar a votação (https://besu.hyperledger.org/en/stable/Reference/API-Methods/#ibft_getsignermetrics).
* Os comandos devem ser disparados usando os consoles dos validadores que atualmente participam do algoritmo de consenso da rede.
* Será necessário informar as contas blockchain (nodeAddress) dos novos validadores, que podem ser encontradas em: ``${CONFIG_ROOT}/nodes/${NODE_NAME}/node.address``.
* A votação precisa ocorrer dentro de um período de uma mesma "época" e o tamanho da época é definida no arquivo genesis. Considerando as configurações atuais da rede, cada época dura cerca de 16h.
* A forma como essa atividade é realizada usualmente é enviando um email a todos os participantes da RBB combinando um horário para votação de todas as instituições que possuam nós validadores.
* Se a votação for bem sucedida, será possível ver no block explorer que o(s) novo(s) validador(es) está(ão) gerando e assinando nós na rede.

# Contato

Em caso de dúvidas ou comentários, por favor, enviem e-mail para blockchaingov@bndes.gov.br.


