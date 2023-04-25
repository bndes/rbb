
# Roteiro para reset do permissionamento após um ataque

Este roteiro tem como objetivo listar os procedimentos necessários para implantar novos *smart contracts* de permissionamento na rede após um ataque que tenha comprometido os *smart contracts* de permissionamento em vigor.

Se um usuário malicioso tiver posse de uma conta admin dos *smart contracts* de permissionamento, ele poderá:

- Adicionar e remover contas.
- Adicionar e remover nós.
- Adicionar e remover admins (exceto a si próprio). De acordo com os *smart contracts* atuais, um admin não pode se remover. Dessa forma, sempre haverá pelo menos um admin no permissionamento, a menos que ele altere as regras de permissionamento.
- Alterar as regras de permissionamento, ao fazer o Account Ingress e/ou Node Ingress (contidos no `genesis.json`) apontarem para outros *smart contracts*.

Os *smart contracts* de permissionamento contidos no `genesis.json` também serão comprometidos! Dessa maneira, faz-se necessário realizar novos deploys de *smart contracts* de permissionamento e reiniciar todos os nós com os novos endereços definidos nas variáveis de ambiente relacionadas ao permissionamento. Para tanto, os seguintes passos deverão ser executados:

- Interromper todos os nós participantes da rede.
- Remover as seguintes variáveis de ambiente em todos os nós:

  ```.env
  BESU_PERMISSIONS_ACCOUNTS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000008888
  BESU_PERMISSIONS_ACCOUNTS_CONTRACT_ENABLED=true
  BESU_PERMISSIONS_NODES_CONTRACT_ADDRESS=0x0000000000000000000000000000000000009999
  BESU_PERMISSIONS_NODES_CONTRACT_ENABLED=true
  BESU_PERMISSIONS_NODES_CONTRACT_VERSION=2
  ```

- Adicionar as seguintes variáveis de ambiente em todos os nós:

  ```.env
  BESU_PERMISSIONS_ACCOUNTS_CONFIG_FILE_ENABLED=true
  BESU_PERMISSIONS_NODES_CONFIG_FILE_ENABLED=true
  ```
  
  O uso das variáveis de ambiente acima habilita o permissionamento local de contas e nós. O permissionamento local afeta somente o nó e é usado para restringir o uso do nó. No cenário em questão, o permissionamento local está sendo usado para proteger o nó de conexões com outros nós não listados e de transações emitidas por contas também não listadas no arquivo que será mencionado a seguir.

- Criar um arquivo `permissions_config.toml` (exatamente conforme está escrito) no diretório `data` de todos os nós participantes da rede, com os endereços das contas permitidas de enviarem transações e os enodes dos nós permitidos de se conectarem à rede, conforme exemplo abaixo:

  ```toml
  accounts-allowlist=["0xb9b81ee349c3807e46bc71aa2632203c5b462032", "0xb9b81ee349c3807e46bc71aa2632203c5b462034"]

  nodes-allowlist=["enode://7e4ef30e9ec683f26ad76ffca5b5148fa7a6575f4cfad4eb0f52f9c3d8335f4a9b6f9e66fcc73ef95ed7a2a52784d4f372e7750ac8ae0b544309a5b391a23dd7@127.0.0.1:30303","enode://2feb33b3c6c4a8f77d84a5ce44954e83e5f163e7a65f7f7a7fec499ceb0ddd76a46ef635408c513d64c076470eac86b7f2c8ae4fcd112cb28ce82c0d64ec2c94@127.0.0.1:30304","enode://7b61d5ee4b44335873e6912cb5dd3e3877c860ba21417c9b9ef1f7e500a82213737d4b269046d0669fb2299a234ca03443f25fe5f706b693b3669e5c92478ade@127.0.0.1:30305"]
  ```

- Certificar que a API `PERM` está habilitada, conforme exemplo abaixo:

  ```.env
  BESU_RPC_HTTP_API=ADMIN,ETH,NET,QBFT,WEB3,PERM
  ```

- Iniciar todos os nós.

- [APENAS A INSTITUIÇÃO INICIAL] Implantar os novos *smart contracts* de permissionamento

  - Pré-requisito

    - [Node.js](https://nodejs.org/en/download/)

  - Preparar o Deploy

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
      BESU_NODE_PERM_ACCOUNT=627306090abaB3A6e1400e9345bC60c78a8BEf57
      BESU_NODE_PERM_KEY=c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
      BESU_NODE_PERM_ENDPOINT=http://127.0.0.1:8545
      CHAIN_ID=1337
      INITIAL_ADMIN_ACCOUNTS=<lista-de-admins>
      INITIAL_ALLOWLISTED_ACCOUNTS=<lista-de-contas>
      INITIAL_ALLOWLISTED_NODES=<lista-de-enodes>
      ```

      Em `BESU_NODE_PERM_ACCOUNT`, conforme o template, insira o endereço da conta a fazer o deploy e a ser a primeira conta admin do permissionamento.

      Em `BESU_NODE_PERM_KEY`, insira a chave privada da conta mencionada acima conforme o template.

      Em `BESU_NODE_PERM_ENDPOINT`, insira o endereço `IP_Interno:Porta` do seu writer conforme o template.

      Em `CHAIN_ID`, insira a chain ID da rede conforme o template. A chain ID pode ser encontrada no arquivo `genesis.json`.

      Em `INITIAL_ADMIN_ACCOUNTS`, insira todas as contas admins da rede.

      Em `INITIAL_ALLOWLISTED_ACCOUNTS`, insira as contas autorizadas a enviar transações pela rede.

      Em `INITIAL_ALLOWLISTED_NODES`, insira os enodes de todos os nós da lista localizada em: `https://github.com/RBBNet/participantes/tree/main/piloto/enodes.md`.

      > ⚠️ **Atenção!** Certifique-se de que todas as contas utilizadas acima são virgens e estão devidamente protegidas.

  - Executar o Deploy

    ```bash
    yarn truffle migrate --reset --network besu
    ```

  - Copiar todos os novos endereços dos *smart contracts* de permissionamento.
  - Colar os novos endereços em `https://github.com/RBBNet/participantes/blob/main/piloto/permissioning_addresses.txt`.

- Interromper todos os nós participantes da rede.

- Remover as seguintes variáveis de ambiente em todos os nós:

  ```.env
  BESU_PERMISSIONS_ACCOUNTS_CONFIG_FILE_ENABLED=true
  BESU_PERMISSIONS_NODES_CONFIG_FILE_ENABLED=true
  ```

- Adicionar as seguintes variáveis de ambiente em todos os nós com os novos endereços:

  ```.env
  BESU_PERMISSIONS_ACCOUNTS_CONTRACT_ADDRESS=<novo-endereço-do-account-ingress>
  BESU_PERMISSIONS_ACCOUNTS_CONTRACT_ENABLED=true
  BESU_PERMISSIONS_NODES_CONTRACT_ADDRESS=<novo-endereço-do-node-ingress>
  BESU_PERMISSIONS_NODES_CONTRACT_ENABLED=true
  BESU_PERMISSIONS_NODES_CONTRACT_VERSION=2
  ```

  Os novos endereços poderão ser obtidos em: `https://github.com/RBBNet/participantes/blob/main/piloto/permissioning_addresses.txt`.

- Iniciar todos os nós.
