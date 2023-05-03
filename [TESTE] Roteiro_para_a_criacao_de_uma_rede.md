
# Roteiro para levantar uma rede de testes

Este roteiro tem como objetivo levantar uma rede para testes compatível com a RBB. Além disso, este roteiro assume que os nós serão iniciados em uma mesma máquina virtual (Virtual Machine - VM).

## 1 - Preparação

### 1.1 - Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop/)
- Git

### 1.2 - Baixar o repositório `start-network`

- Execute os seguintes comandos:

  ```bash
  git clone https://github.com/RBBNet/start-network.git
  cd start-network
  
  ```

Daqui para frente, considere que todos os comandos são executados dentro do diretório start-network.

### 1.3 - Preparar arquivos

Execute o comando/script abaixo para gerar as chaves públicas e privadas e os endereços dos nós validator, boot e writer. Exemplo:

```bash
./rbb-cli node create validator, boot, writer

```

- Execute os comandos abaixo para definir a porta da VM pela qual serão feitas chamadas RPC para os nós. Na primeira linha do exemplo abaixo é mapeado a porta 10001 da VM (host) para a porta 8545 do nó validator (container), a porta 8545 do nó é a porta padrão para chamadas RPC via HTTP:

    ```bash
    ./rbb-cli config set nodes.validator.ports+=[\"10001:8545\"]
    ./rbb-cli config set nodes.boot.ports+=[\"10002:8545\"]
    ./rbb-cli config set nodes.writer.ports+=[\"10003:8545\"]
    
    ```

Após a execução dos comandos acima os seguintes itens serão gerados:

- Par de chaves pública/privada:
  - Caminho da chave privada: `.env.configs/nodes/<nome-do-nó>/key`
  - Caminho da chave pública: `.env.configs/nodes/<nome-do-nó>/key.pub`
- Endereço do nó (account):
  - Localizado em: `.env.configs/nodes/<nome-do-nó>/node.id`

A chave pública, endereço e outras informações sobre os nós podem ser obtidas através do seguinte comando:

```bash
./rbb-cli config dump

```

### 1.4 - Informações úteis

- Enode

  O enode é uma string que serve de identificador para o nó e que será utilizado neste roteiro.

  Sua formação é o que segue: `enode://<chave-pública-SEM-0x>@<ip>:<porta>`.

- Variáveis de ambiente do Besu
  
  As variáveis de ambiente do Besu para **todos os nós** podem ser alteradas no arquivo `docker-compose.yml.hbs`.
  Para alterar a variável de ambiente do Besu **especificamente de um nó**, execute o comando abaixo:

  ```bash
  ./rbb-cli config set nodes.<nome_do_nó>.environment.<VARIÁVEL_DE_AMBIENTE_DO_BESU>=<VALOR_DA_VARIÁVEL>

  ```

- Topologia

  A topologia da RBB está de acordo com o diagrama abaixo e pode ser útil na compreensão dos próximos passos.

  ![Topologia da rede](https://i.imgur.com/BwHFxsf.png)

## 2 - Ajustes do arquivo genesis e static-nodes

### 2.1 - Criar genesis.json

- Execute o seguinte comando para criar um arquivo `genesis.json` com o validator definido no extradata:

  ```bash
  ./rbb-cli genesis create --validators validator
  
  ```

### 2.2 - Ajustar static-nodes

As seguintes atividades serão executadas nesse sub-roteiro:

- Criação de um arquivo static-nodes.json no validator apenas com o boot.
- Criação de um arquivo static-nodes.json no writer apenas com o boot.

Os passos acima serão detalhados a seguir.

Ajuste o arquivo `static-nodes.json` do writer e validator da seguinte forma:

#### **Nó validator**

- Desabilite a descoberta de nós com o seguinte comando:

  ```bash
  ./rbb-cli config set nodes.validator.environment.BESU_DISCOVERY_ENABLED=false
  
  ```

- No **validator**, inclua no arquivo `volumes/validator/static-nodes.json` o enode do boot.

  Modelo:

  ```json
  [
  "enode://<chave-pública-SEM-0x>@boot:30303"
  ]
  ```

#### **Nó writer**

- Desabilite a descoberta de nós com o seguinte comando:

  ```bash
  ./rbb-cli config set nodes.writer.environment.BESU_DISCOVERY_ENABLED=false
  
  ```

- No **writer**, inclua no arquivo `volumes/writer/static-nodes.json` o enode do boot.

  Modelo:

  ```json
  [ 
  "enode://<chave-pública-SEM-0x>@boot:30303"
  ]
  ```

## 3 - Iniciar os nós

```bash
./rbb-cli config render-templates
docker-compose up -d

```

- Outros comandos úteis:

  - Utilize o seguinte comando para visualizar o log do nó:

    ```bash
    docker-compose logs -f
    
    ```

  - Utilize o seguinte comando para interromper o nó:

    ```bash
    docker-compose down
    
    ```

## 4 - [OPCIONAL] Implantar os smart contracts de permissionamento

### 4.1 - Pré-requisito

- [Node.js](https://nodejs.org/en/download/)

### 4.2 - Preparar o Deploy

- Execute os seguintes comandos:

  ```bash
  curl -LO https://github.com/RBBNet/Permissionamento/releases/download/0.1/permissioningDeploy.tar.gz
  tar xzf permissioningDeploy.tar.gz
  rm permissioningDeploy.tar.gz
  cd permissioningDeploy
  
  ```

- Execute o seguinte comando para instalar as dependências:

  ```bash
  yarn install
  
  ```

- Crie um arquivo `.env` e defina as variáveis de ambiente neste arquivo conforme template abaixo:

  ```.env
  NODE_INGRESS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000009999
  ACCOUNT_INGRESS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000008888
  BESU_NODE_PERM_ACCOUNT=627306090abaB3A6e1400e9345bC60c78a8BEf57
  BESU_NODE_PERM_KEY=c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
  BESU_NODE_PERM_ENDPOINT=http://127.0.0.1:8545
  CHAIN_ID=648629
  INITIAL_ALLOWLISTED_NODES=enode://c35c3...d615f@1.2.3.4:30303,enode://f42c13...fc456@1.2.3.5:30303,enode://5c738...6fee2@1.2.3.6:30303
  ```

  Em `BESU_NODE_PERM_ACCOUNT`, conforme o template, insira o endereço da conta a fazer o deploy e a ser a primeira conta admin do permissionamento. Por ser este um roteiro somente para testes, o endereço contido no template poderá ser utilizado.

  Em `BESU_NODE_PERM_KEY`, insira a chave privada da conta mencionada acima conforme o template. Por ser este um roteiro somente para testes, a chave privada contida no template poderá ser utilizada.
  > ⚠️ **Atenção!** Não utilize a chave privada do template em ambiente de **produção**.

  Em `BESU_NODE_PERM_ENDPOINT`, insira o endereço `IP:Porta` (utilize o IP do container) do seu validator conforme o template. Os nós não estarão conectados por conta do permissionamento, por isso, e apenas nesse momento, será utilizada a porta RPC do validator e não do writer para enviar transações.

  Em `CHAIN_ID`, insira a chain ID da rede conforme o template. A chain ID pode ser encontrada no arquivo `genesis.json`.

  Em `INITIAL_ALLOWLISTED_NODES`, conforme o template, insira os enodes dos nós validator, boot e writer.

### 4.3 - Executar o Deploy

```bash
yarn truffle migrate --reset --network besu

```

## 5 - [EM CONSTRUÇÃO] Levantar dApp de permissionamento

- Execute os seguintes comandos em um diretório que estará acessível pelo servidor web:

  ```bash
  curl -LO https://github.com/RBBNet/Permissionamento/releases/download/0.1/permissioningDapp.tar.gz
  tar xzf permissioningDapp.tar.gz
  rm permissioningDapp.tar.gz
  cd permissioningDapp
  
  ```

- Adicione um arquivo "config.json" no diretório `permissioningDapp` contendo as seguintes informações:

  ```json
  {
          "accountIngressAddress":  "<Endereço do contrato account ingress>",
          "nodeIngressAddress": "<Endereço do contrato node ingress>",
          "networkId": "<ChainID da rede>"
  }
  ```

## 6 - [EM CONSTRUÇÃO] Levantar monitoração

## 7 - [EM CONSTRUÇÃO] Levantar block explorer

---
