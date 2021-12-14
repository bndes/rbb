


# Monitoração e Responsabilidades 
Toda instituição participante deve monitorar e tratar incidentes de seus próprios nós

Toda instituição participante deve poder monitorar localmente os dados de todos os nós da RBB necessário para detecção de seus próprios incidentes.

# Tipos de Monitoração

LL- Local para detecção de incidentes
GL- Global para detecção de incidentes locais
MN- Global longo Prazo – Monitoramento de negócio 
GG- global para detecção de incidentes na rede inteira _ Saúde da rede

#  Premissas II 

GL- Global para detecção de incidentes locais
Para obter dados gerados por nós de outras instituições da rede, uma instituição pode
    (a) buscar um subconjunto dos dados diretamente de todos os nós da rede e/ou 
    (b) buscar dados do monitoramento GG. 
Buscar diretamente nos diversos nós da rede preserva a descentralização e minimiza possíveis erros uma vez que o dado é recuperado no local em que se originou.



GG- global para detecção de incidentes na rede inteira _ Saúde da rede
Pelo menos duas instituições da rede devem fazer o monitoramento com input de todos os nós da rede e oferecer uma visão global de toda a rede.

Existe uma equipe técnica responsável por cuidar da saúde global da rede, incluindo incidentes com causa desconhecida. Essa equipe pode ser composta por um subconjunto das instituições participantes, com rotatividade.

#  De onde extrair as métricas 

Besu e Server

Foco em estado dos nós e servidores
Contém visão em alto nível da rede




Diretamente na rede Blockchain 

Foco em endereços, smart contracts e transações. 
Inclui visão em alto nível dos nós
(fora do escopo no momento)

# Tipos de Métricas

Servidores e Processos 

Monitora o uso de CPU e uso de espaço em Disco. Também engloba uso da JVM pelo processo do Besu.
Cada instituição já deve ter padrões estabelecidos para essas métricas.


Especifica da RBB

Monitora sincronização, conectividade e uso da rede.
Importante alinhamento nas métricas e limites para incidentes.


# SLA

Nós validadores devem estar operacionais pelo menos ?% do tempo.


Nós boot e registradores devem estar operacionais pelo menos ?% do tempo. Obs.: Nós registradores também precisam respeitar SLA da aplicação que está oferecendo.

# Implementação

A troca de mensagens de monitoramento não deve impactar negativamente no desempenho dos nós da RBB

A comunicação das métricas coletadas entre as diferentes instituições seguirá o formato de dados do Prometheus. O Prometheus pode ser utilizado para a coleta, armazenamento e consulta de métricas, mas as instituições também podem optar por outra ferramenta de monitoração.

Não existe nenhuma restrição para seleção de ferramenta de gestão de incidentes. A instituição pode selecionar a mais adequada segundo a operação de sua produção de TI.

Além de servir para geração de incidentes, as métricas listadas também podem ser apresentadas em dashboards. Caso as instituições participantes optem pela adoção do Grafana, existe um modelo disponível gerado pelo BNDES. 


![Captura de tela de 2021-12-13 13-56-52](https://user-images.githubusercontent.com/71888455/146039396-ff30f6e3-aa6a-454f-81c4-0860e2dcb49b.png)



![Captura de tela de 2021-12-13 13-57-22](https://user-images.githubusercontent.com/71888455/146040387-c44dfe6f-3e66-4cb1-acd7-dd2ae58bf8c6.png)





