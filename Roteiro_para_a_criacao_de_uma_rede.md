# 1 - Para todas as instituições 

### Instalação dos pré-requisitos

Inicialmente, todas as instituições precisarão das seguintes aplicações instaladas em suas máquinas:

-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Git](https://git-scm.com/downloads)
-   [Node.js](https://nodejs.org/en/download/)

###### 1.1 Após seguir o requisito acima, iremos gerar 3 itens:

Execute o comando/script <span style="color: yellow">-----</span> para gerar.

itens gerados:
- Par de chave pública/privada (`key.pub / key`)
	- Caminho da chave privada: `./nodes/<nome-do-nó>/`<font color="green">key</font>
	- Caminho da chave pública: *`./nodes/<nome-do-nó>/`*<font color="green">key.pub</font>
- Endereço do nó
	- Localizado em: `./nodes/<nome-do-nó>/node.address`
- Enode (`<chave-pública>@<ip>:<porta>`)


Insira no [arquivo](https://github.com/RBBNet/participantes/blob/main/NoIp.md) compartilhado os `enodes` e os `endereços (Account)`  de cada máquina para que todas as instituições conheçam as informações um dos outros, como no exemplo abaixo:

| Membro    | Papel    |Enode     |Account    |
|-----------|----------|----------|-----------|
|BID        | Boot     |`enode://91ca8......3b@35.188.197.198:60606`||
|BID        | Validator 1|`enode://2b5......0c59@34.68.63.164:60606`|0x5bcd....a4861984b|
|BID        | Validator 2|`enode://1e6......cbc0@34.71.181.215:60606`|0x285....97d9dfc3e7|



### Firewall

##### Configurar o firewall para os endereços IP dos nós com as seguinte regras:

IP do Validador `(origem)` <--> IP de todos os Validadores `(destino)`  
IP do Bootnode `(origem)` <--> IP de todos os Bootnodes `(destino)`  
IP dos Bootnodes `(origem)` <---> IP de todos os Writers dos partícipes parceiros `(destino)`  


# 1.2 - Atividades da instituição inicial

Caso você **não** seja a instituição inicial pule para a [seção 1.3](#13---atividades-para-cada-outra-institui%C3%A7%C3%A3o-da-rede).

A instituição inicial (genesis) desempenhará as primeiras atividades da rede. É ela quem levantará os primeiros nós antes de todos os outros.

Com a execução do script da [seção 1.1](#11-ap%C3%B3s-seguir-o-requisito-acima-iremos-gerar-3-itens), foram gerados arquivos, dentre eles o genesis.json que se encontra no caminho `start-network/.env.configs/genesis.json`. 


1. Compartilhe o arquivo `genesis.json` com as outras instituições de acordo com o tipo de rede que está levantando no seguinte diretório do github:

Caso esteja levantando uma rede para **laboratório**, use [este](https://github.com/RBBNet/participantes/tree/main/lab) diretório.
Caso esteja levantando uma rede **piloto**, use [este](https://github.com/RBBNet/participantes/tree/main/piloto) diretório.

#### Inclusão dos enodes dos boots no genesis.json

3. No arquivo `genesis.json` do nó boot, inclua os enodes de todos os outros boots da rede.

**Modelo:**
```json
"bootnodes" : [ 
"enode://<chave-pública-SEM-0x>@<ip>:<porta>", 
"enode://<chave-pública-SEM-0x>@<ip>:<porta>" 
]
```

No arquivo genesis.json ficará da seguinte maneira: 👇  
![Conteúdo exemplo do arquivo genesis.json](https://i.imgur.com/MPgJljO.png)


#### Criação de static-nodes

Ainda no mesmo diretório haverá um arquivo `./static-nodes.json`.

##### No Validator node

Inclua no arquivo `static-nodes.json` todos os enodes dos outros validadores com o **IP público** e o enode do bootnode com o **IP privado.** 

**Modelo:**
```json
[ 
"enode://<chave-pública-SEM-0x>@<ip-público>:<porta>", 
"enode://<chave-pública-SEM-0x>@<ip-público>:<porta>",
...
"enode://<chave-pública-SEM-0x>@<ip-privado>:<porta>"
]
```


##### No Writer node

Da mesma forma, inclua no arquivo `static-nodes.json`  o enode do boot interno usando o **IP privado**.

(Validador interno --> demais validadores) `usar IP público`
(Validador interno --> bootnode interno) `usar IP privado`
(Writer interno --> bootnode interno) `usar IP privado`

![](https://i.imgur.com/BwHFxsf.png)




#### Levantar nós

Execute o comando abaixo em cada máquina (VM) para ativar os nós caso esteja utilizando no modo docker-compose.

```bash
docker-compose up -d
```

###### Implantar os smart contracts de permissionamento

Implantar com todos os nós já permissionados


### Atividades complementares

-   Executar sub-roteiro "[Levantar DApp de permissionamento](#levantar-dapp-de-permissionamento)".
-   Executar sub-roteiro "[Levantar monitoração](#levantar-monitora%C3%A7%C3%A3o)".
-   Executar sub-roteiro "[Levantar block explorer](#levantar-block-explorer)".

# 1.3 - Atividades para cada outra instituição da rede


### Ajustar genesis e static-nodes


A instituição inicial compartilhará em um diretório arquivo `genesis.json` . Você deve substituir o arquivo `genesis.json` que está em `start-network/.env.configs/genesis.json` pelo da instituição inicial.

O diretório de onde você irá obter o arquivo `genesis.json` irá variar de acordo com o tipo de rede que está levantando:

Caso esteja levantando uma rede para **laboratório**, use [este](https://github.com/RBBNet/participantes/tree/main/lab) diretório.
Caso esteja levantando uma rede **piloto**, use [este](https://github.com/RBBNet/participantes/tree/main/piloto) diretório.


#### Inclusão dos enodes dos boots no genesis.json

No arquivo `genesis.json` do nó boot, inclua os enodes de todos os outros boots da rede.

**Modelo:**
```json
"bootnodes" : [ 
"enode://<chave-pública-SEM-0x>@<ip>:<porta>", 
"enode://<chave-pública-SEM-0x>@<ip>:<porta>" 
]
```

No arquivo genesis.json ficará da seguinte maneira: 👇  
![Conteúdo exemplo do arquivo genesis.json](https://i.imgur.com/MPgJljO.png)

#### Criação de static-nodes

Ainda no mesmo diretório haverá um arquivo `./static-nodes.json`.

##### No Validator node

Inclua no arquivo `static-nodes.json` todos os enodes dos outros validadores com o **IP público** e o enode do bootnode com o **IP privado.** 

**Modelo:**
```json
[ 
"enode://<chave-pública-SEM-0x>@<ip-público>:<porta>", 
"enode://<chave-pública-SEM-0x>@<ip-público>:<porta>",
"enode://<chave-pública-SEM-0x>@<ip-privado>:<porta>"
]
```


##### No Writer node

Da mesma forma, inclua no arquivo `static-nodes.json`  o enode do boot interno usando o **IP privado**.

(Validador interno --> demais validadores) `usar IP público`
(Validador interno --> bootnode interno) `usar IP privado`
(Writer interno --> bootnode interno) `usar IP privado`

![](https://i.imgur.com/BwHFxsf.png)


#### Levantar nós

Execute o comando abaixo em cada máquina (VM) para ativar os nós caso esteja utilizando no modo docker-compose.

```bash
docker-compose up -d
```


### Levantar DApp de permissionamento


### Levantar monitoração


### Levantar block explorer











