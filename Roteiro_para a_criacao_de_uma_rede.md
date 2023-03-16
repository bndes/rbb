# Roteiro EM DESENVOLVIMENTO

# Roteiro para a criação de uma rede

Esse roteiro tem como objetivo levantar uma cópia compatível com a RBB do zero. 

Após a existência de uma versão inicial da rede, a adição de novas instituições **deverá seguir outro roteiro**. 

É fácil confundir, pois o roteiro tem como premissas que as instituições entrarão na rede uma a uma. Porém, não é possível usar o roteiro para adesão de uma instituição após a existência da rede porque, a seção 1 é para ser executada por todas as instituições em paralelo. Uma nova instituição após a rede já existir não terá executado aqueles passos.  

## 1 - Atividades iniciais a serem executadas em paralelo para todas as instituições

As atividades desta seção devem ser executadas no início da implantação da rede por todas as instituições que irão aderir a esta.

### 1.1 - Pré-requisitos

Antes de executar os procedimentos abaixo, é necessário a instalação das seguintes aplicações:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)

### 1.2 - Clonar esse repositório

Execute os comandos:
```bash
git clone https://github.com/RBBNet/start-network
cd start-network
```

### 1.3 - Gerar enodes e endereços
- Para cada participante, gerar concomitantemente aos outros participantes, os endereços e as chaves públicas e privadas dos próprios nós.

Execute o comando/script <span style="color: yellow">-----</span> para gerar.

Itens gerados:
- Par de chave pública/privada (`key.pub / key`)
	- Caminho da chave privada: `./nodes/<nome-do-nó>/`<font color="green">key</font>
	- Caminho da chave pública: *`./nodes/<nome-do-nó>/`*<font color="green">key.pub</font>
- Endereço do nó
	- Localizado em: `./nodes/<nome-do-nó>/node.address`
- Enode (`<chave-pública>@<ip>:<porta>`)
   
### 1.4 - Compartilhar enodes e endereços

Insira no [arquivo](https://github.com/RBBNet/participantes/blob/main/NoIp.md) compartilhado os `enodes` e os `endereços (Account)`  de cada máquina para que todas as instituições conheçam as informações um dos outros, como no exemplo abaixo:

| Membro    | Papel    |Enode     |Account    |
|-----------|----------|----------|-----------|
|BID        | Boot     |`enode://91ca8......3b@35.188.197.198:60606`||
|BID        | Validator 1|`enode://2b5......0c59@34.68.63.164:60606`|0x5bcd....a4861984b|
|BID        | Validator 2|`enode://1e6......cbc0@34.71.181.215:60606`|0x285....97d9dfc3e7|


### 1.5 - Ajustar regras de firewall

IP externo do validator `(origem)` <--> IP de todos os validators das outras instituições `(destino)`  
IP do boot node `(origem)` <--> IP de todos os boot nodes das outras instituições `(destino)`  
IP do boot node `(origem)` <---> IP de todos os writers **apenas dos partícipes parceiros** `(destino)`  


## 2 - Atividades a serem executadas no início da rede, pela instituição inicial
Os passos 
Caso você **não** seja a instituição inicial pule para a [seção 3](#3---atividades-para-cada-outra-institui%C3%A7%C3%A3o-da-rede).

A instituição inicial desempenhará as primeiras atividades da rede. É ela quem levantará os primeiros nós antes de todos os outros.

Com a execução do script da seção anterior, foram gerados arquivos. Dentre eles, o genesis.json que se encontra no caminho `.env.configs/genesis.json`. 

### 2.1 - Compartilhar genesis.json
Compartilhe o arquivo `genesis.json` com as outras instituições de acordo com o tipo de rede que está levantando no seguinte diretório do github:
Caso esteja levantando uma rede para **laboratório**, use [este](https://github.com/RBBNet/participantes/tree/main/lab) diretório.
Caso esteja levantando uma rede **piloto**, use [este](https://github.com/RBBNet/participantes/tree/main/piloto) diretório.

### 2.2 - Executar sub-roteiro "[Ajustar genesis e static-nodes](#ajustar-genesis-e-static-nodes)".

### 2.3 - Levantar nós

```bash
docker-compose up -d
```

### 2.4 - Implantar os smart contracts de permissionamento 
Implantar com todos os nós já permissionados.

### 2.5 - Atividades complementares
- Executar sub-roteiro "[Levantar DApp de permissionamento](#levantar-dapp-de-permissionamento)".
- Executar sub-roteiro "[Levantar monitoração](#levantar-monitora%C3%A7%C3%A3o)".
- Executar sub-roteiro "[Levantar block explorer](#levantar-block-explorer)".


## 3 - Atividades a serem executadas durante a entrada de cada instituição na rede (com exceção da primeira)

Após o início da rede pela instituição inicial, as outras instituições vão entrar uma a uma. Os passos dessa seção serão executados a cada instituição que adere. 

Observe, porém, que, durante a adesão de uma instituição, há atividades que serão executadas por **todas as instituições**. Logo, esta não é uma seção apenas da institução que está aderindo e, sim, a seção a ser seguida durante a adesão de cada instituição. O corte é temporal, portanto.


### 3.1 - Instituição aderente 

Executar sub-roteiro "[Ajustar genesis e static-nodes](#ajustar-genesis-e-static-nodes)".

### 3.2 - Atividades de cada membro que já estava na rede
- Para cada um dos membros que já esteja na rede.
   - Adicionar regras de firewall.

### Atividades após os ajustes de firewall
- Executar sub-roteiro "[Levantar os nós](#levantar-os-n%C3%B3s)".
- Executar sub-roteiro "[Levantar DApp de permissionamento](#levantar-dapp-de-permissionamento)".
- Executar sub-roteiro "[Levantar monitoração](#levantar-monitora%C3%A7%C3%A3o)".
- Executar sub-roteiro "[Levantar block explorer](#levantar-block-explorer)".

## 4 - Sub-roteiros

### 4.1 - Ajustar genesis e static-nodes
- Incluir no genesis do próprio boot a lista de todos os boots. 
- Criar um static-nodes para o próprio validador com os validadores das outras instituições e o próprio boot (usando IP interno).
- Criar um static-nodes para o próprio writer com o próprio boot (usando IP interno).

#### 4.1.1 - Ajustes no genesis.json do boot 

Inclua no genesis.json os enodes de todos os outros boots da rede.

**Modelo:**
```json
"bootnodes" : [ 
"enode://<chave-pública-SEM-0x>@<ip>:<porta>", 
"enode://<chave-pública-SEM-0x>@<ip>:<porta>" 
]
```

No arquivo genesis.json ficará da seguinte maneira: 👇  
![Conteúdo exemplo do arquivo genesis.json](https://i.imgur.com/MPgJljO.png)

##### 4.1.2 - Ajuestes nos static-nodes

Ajustar o arquivo `.env.configs/statis-nodes.json` dos writers e validators.

#### Nós validators

Nos **validators**, inclua no arquivo `static-nodes.json` todos os enodes dos outros validators com o **IP externo** e o enode do bootnode com o **IP interno**.

**Modelo:**
```json
[ 
"enode://<chave-pública-SEM-0x>@<ip-público>:<porta>", 
"enode://<chave-pública-SEM-0x>@<ip-público>:<porta>",
...
"enode://<chave-pública-SEM-0x>@<ip-privado>:<porta>"
]
```

#### Nós writers

Da mesma forma, nos **writers** inclua no arquivo `static-nodes.json` o enode do boot interno usando o **IP interno**.

(Validador interno --> demais validadores) `usar IP público`
(Validador interno --> bootnode interno) `usar IP privado`
(Writer interno --> bootnode interno) `usar IP privado`

![](https://i.imgur.com/BwHFxsf.png)


### Levantar DApp de permissionamento

### Levantar monitoração

### Levantar block explorer






==================================================================================================
==================================================================================================
==================================================================================================
- 
- Dado um template de genesis.json, o endereço desse validador e uma lista de enodes dos validadores e boots (as listas são obtidas pelo arquivo compartilhado, mencionado na 2ª etapa), respectivamente, deve-se gerar no genesis.json o extradata e gerar o arquivo static-nodes.json correspondente ao validador e correspondente ao boot; [Utilizar um comando para gerar o genesis.json e os arquivos static-nodes.json conforme descrito nesta etapa]


4. Após todos terem informado os enodes, endereços, IPs e portas dos nós no arquivo compartilhado, adicionar nas regras de Firewall, os IPs e portas de todos os outros nós;
5. 6. Para todos os outros participantes, inserir uma cópia do genesis.json e do static-nodes.json correspondente ao nó a ser iniciado na VM.
7. Levantar os nós; [Utilizar um comando para essa etapa]

## Sugestão de roteiro para a adição de um nó em uma rede conjunta

### Tarefas dos nós a serem inseridos na rede

1. Gerar os endereços e as chaves públicas e privadas dos próprios nós; [Utilizar um comando para essa etapa]
2. Adicionar em um arquivo compartilhado com os outros participantes da rede, os endereços e enodes de todos os próprios nós gerados na etapa anterior;
3. Adicionar nas regras de Firewall os IPs e portas de todos os outros nós;
4. Obter genesis.json já pronto no repositório compartilhado;
5. Levantar os nós; [Utilizar um comando para essa etapa]

### Tarefas dos nós já existentes na rede

1. Adicionar nas regras de Firewall os IPs e portas dos novos nós;
2. Um participante com acesso administrador no dApp de permissionamento deve inserir o novo nó no permissionamento;
3. Inserir no arquivo static-nodes.json os enodes dos novos nós e executar o comando add_peer para os novos nós; [Utilizar um comando para essa etapa];

Dessa forma, ao criar os comandos sugeridos acima, acredita-se ser possível generalizar o script tanto para criar uma rede local, tanto para criar uma rede conjunta e, ainda, adicionar nós em uma rede já existente.

Uma problemática para o modelo de script em que todos os nós são iniciados juntos é o permissionamento. Não é possível iniciar todos os nós com o permissionamento habilitado e já conectá-los produzindo blocos.

Motivo:

```solidity
    if(getContractAddress(RULES_CONTRACT) == address(0)) {
        //reject connection
        return 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    }
```

Há 2 alternativas para tratar essa problemática:

1. Levantar os nós com permissionamento desabilitado para produzir blocos, instalar as regras de permissionamento com os nós permitidos e, em seguida, reiniciar os nós com o permissionamento habilitado.
2. Gerar um extradata com apenas um validador, iniciar os nós com o permissionamento já habilitado e instalar as regras de permissionamento com os nós permitidos no único validador.
